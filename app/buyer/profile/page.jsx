import PageHeader from "@/components/dashboard/PageHeader";
import { ServerForm, TextField, PasswordField, SubmitBtn } from "@/components/dashboard/ServerForm";
import { requireRole } from "@/lib/auth";
import { getProfile } from "@/lib/repositories/buyer";
import { updateProfileAction, changePasswordAction } from "@/lib/actions/buyer";

export const metadata = { title: "Profil Saya" };

export default async function BuyerProfilePage() {
  const me = await requireRole(["buyer"]);
  const profile = await getProfile(me.id);
  return (
    <>
      <PageHeader title="Profil saya" description="Kelola data diri dan kata sandi Anda." />
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
    </>
  );
}
