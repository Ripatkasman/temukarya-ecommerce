import PageHeader from "@/components/dashboard/PageHeader";
import { ServerForm, TextField, AreaField, ImageField, SubmitBtn } from "@/components/dashboard/ServerForm";
import Button from "@/components/ui/Button";
import { requireRole } from "@/lib/auth";
import { getStoreBySeller } from "@/lib/repositories/seller";
import { saveStoreAction } from "@/lib/actions/seller";

export const metadata = { title: "Toko Saya" };

export default async function SellerStorePage() {
  const me = await requireRole(["seller"]);
  const store = await getStoreBySeller(me.id);
  return (
    <>
      <PageHeader
        title="Toko saya" description="Informasi ini tampil di halaman toko dan halaman produk Anda."
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
    </>
  );
}
