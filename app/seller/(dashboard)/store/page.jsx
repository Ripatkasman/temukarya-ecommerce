import PageHeader from "@/components/dashboard/PageHeader";
import { ServerForm, TextField, AreaField, ImageField, SubmitBtn } from "@/components/dashboard/ServerForm";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import Button from "@/components/ui/Button";
import { requireRole } from "@/lib/auth";
import { getStoreBySeller } from "@/lib/repositories/seller";
import { getProfile } from "@/lib/repositories/buyer";
import { saveStoreAction } from "@/lib/actions/seller";
import { requestDeletionAction, cancelDeletionAction } from "@/lib/actions/auth";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Toko Saya" };

export default async function SellerStorePage() {
  const me = await requireRole(["seller"]);
  const [store, profile] = await Promise.all([
    getStoreBySeller(me.id),
    getProfile(me.id),
  ]);

  return (
    <>
      <PageHeader
        title="Toko saya"
        description="Informasi ini tampil di halaman toko dan halaman produk Anda."
        actions={store && <Button href={`/stores/${store.id}`} variant="outline">Lihat halaman publik</Button>}
      />
      {!store ? (
        <p className="rounded-card border border-line bg-surface p-5 text-sm">Data toko tidak ditemukan. Hubungi admin.</p>
      ) : (
        <ServerForm action={saveStoreAction} className="max-w-2xl">
          <TextField name="name" label="Nama toko" required maxLength={100} defaultValue={store.name} />
          <AreaField name="description" label="Deskripsi toko" rows={4} maxLength={500} defaultValue={store.description ?? ""} hint="Maksimal 500 karakter." />
          <ImageField label="Gambar toko" currentUrl={store.image_url} hint="JPG, PNG, atau WebP, maksimal 2 MB. Kosongkan jika tidak ingin mengganti." />
          <SubmitBtn size="lg" loadingLabel="Menyimpan…">Simpan toko</SubmitBtn>
        </ServerForm>
      )}

      {/* Bagian Permintaan Penghapusan Akun Seller */}
      <section aria-labelledby="hapus-akun-seller" className="mt-10 max-w-2xl rounded-card border border-error/40 bg-surface p-5">
        <h2 id="hapus-akun-seller" className="text-section-title text-error">Penghapusan Akun & Toko</h2>
        {profile?.deletion_requested_at ? (
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
              confirmDescription="Akun dan toko Anda akan tetap aktif dan permintaan penghapusan dicabut dari antrean Admin."
              confirmLabel="Ya, batalkan permintaan"
            />
          </div>
        ) : (
          <div className="mt-2">
            <p className="mb-4 text-sm text-muted-strong">
              Penghapusan akun akan menghapus toko serta seluruh produk Anda secara permanen setelah disetujui Admin. Pastikan semua pesanan sudah selesai.
            </p>
            <ServerForm action={requestDeletionAction}>
              <AreaField
                name="reason"
                label="Alasan penghapusan akun (opsional)"
                rows={3}
                maxLength={300}
                placeholder="Contoh: Toko sudah tidak beroperasi."
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