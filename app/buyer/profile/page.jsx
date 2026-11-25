import PageHeader from "@/components/dashboard/PageHeader";
import { ServerForm, TextField, AreaField, PasswordField, SubmitBtn } from "@/components/dashboard/ServerForm";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import { requireRole } from "@/lib/auth";
import { getProfile } from "@/lib/repositories/buyer";
import { updateProfileAction, changePasswordAction } from "@/lib/actions/buyer";
import { requestDeletionAction, cancelDeletionAction } from "@/lib/actions/auth";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Profil Saya" };

export default async function BuyerProfilePage() {
  const me = await requireRole(["buyer"]);
  const profile = await getProfile(me.id);

  return (
    <>
      <PageHeader title="Profil saya" description="Kelola data diri, kata sandi, dan status akun Anda." />
      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="data-diri" className="rounded-card border border-line bg-surface p-5">
          <h2 id="data-diri" className="text-section-title mb-4">Data diri</h2>
          <ServerForm action={updateProfileAction}>
            <TextField name="fullName" label="Nama lengkap" required maxLength={100} defaultValue={profile.full_name} />
            <TextField name="email" type="email" label="Email" defaultValue={profile.email} disabled hint="Email tidak dapat diubah." />
            <TextField name="phone" label="Telepon (opsional)" defaultValue={profile.phone ?? ""} />
            <SubmitBtn loadingLabel="Menyimpan…">Simpan profil</SubmitBtn>
          </ServerForm>
        </section>

        <section aria-labelledby="ganti-sandi" className="rounded-card border border-line bg-surface p-5">
          <h2 id="ganti-sandi" className="text-section-title mb-4">Ganti kata sandi</h2>
          <ServerForm action={changePasswordAction} resetOnSuccess>
            <PasswordField name="currentPassword" label="Kata sandi saat ini" required autoComplete="current-password" />
            <PasswordField name="newPassword" label="Kata sandi baru" required autoComplete="new-password" hint="Minimal 8 karakter, berisi huruf dan angka." />
            <PasswordField name="confirmPassword" label="Ulangi kata sandi baru" required autoComplete="new-password" />
            <SubmitBtn loadingLabel="Menyimpan…">Ganti kata sandi</SubmitBtn>
          </ServerForm>
        </section>
      </div>

      {/* Bagian Permintaan Penghapusan Akun */}
      <section aria-labelledby="hapus-akun" className="mt-8 rounded-card border border-error/40 bg-surface p-5">
        <h2 id="hapus-akun" className="text-section-title text-error">Penghapusan Akun</h2>
        {profile.deletion_requested_at ? (
          <div className="mt-3 space-y-3 text-sm">
            <p className="rounded-btn bg-warning-soft px-4 py-3 text-warning-strong">
              Anda telah mengajukan penghapusan akun pada <strong>{formatDate(profile.deletion_requested_at)}</strong>. Permintaan sedang menunggu persetujuan (ACC) dari Admin.
            </p>
            {profile.deletion_reason && (
              <p className="text-muted-strong">Alasan: &ldquo;{profile.deletion_reason}&rdquo;</p>
            )}
            <ConfirmAction
              action={cancelDeletionAction}
              fields={{}}
              label="Batalkan Permintaan Hapus"
              variant="outline"
              confirmTitle="Batalkan permintaan penghapusan akun?"
              confirmDescription="Akun Anda akan tetap aktif dan permintaan penghapusan dicabut dari antrean Admin."
              confirmLabel="Ya, batalkan permintaan"
            />
          </div>
        ) : (
          <div className="mt-2 max-w-xl">
            <p className="mb-4 text-sm text-muted-strong">
              Penghapusan akun bersifat permanen dan memerlukan persetujuan Admin. Pastikan Anda tidak memiliki pesanan yang sedang berjalan.
            </p>
            <ServerForm action={requestDeletionAction}>
              <AreaField
                name="reason"
                label="Alasan penghapusan akun (opsional)"
                rows={3}
                maxLength={300}
                placeholder="Contoh: Sudah tidak menggunakan akun ini lagi."
              />
              <SubmitBtn variant="outline" loadingLabel="Mengirim permintaan…">
                Ajukan Penghapusan Akun
              </SubmitBtn>
            </ServerForm>
          </div>
        )}
      </section>
    </>
  );
}