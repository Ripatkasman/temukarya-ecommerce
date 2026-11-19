import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import DialogForm from "@/components/dashboard/DialogForm";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import { TextField, AreaField } from "@/components/dashboard/ServerForm";
import { listCategoriesWithUsage } from "@/lib/repositories/admin";
import { saveCategoryAction, deleteCategoryAction } from "@/lib/actions/admin";

export const metadata = { title: "Manajemen Kategori" };

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesWithUsage();

  const columns = [
    { key: "name", header: "Nama", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "description", header: "Deskripsi", render: (c) => c.description || <span className="text-muted-strong">-</span> },
    { key: "product_count", header: "Dipakai produk" },
    {
      key: "aksi", header: "Aksi",
      render: (c) => (
        <div className="flex flex-wrap items-center gap-2">
          <DialogForm triggerLabel="Ubah" triggerVariant="outline" triggerSize="sm" title={`Ubah kategori`} action={saveCategoryAction}>
            <input type="hidden" name="id" value={c.id} />
            <TextField name="name" label="Nama kategori" required defaultValue={c.name} maxLength={80} />
            <AreaField name="description" label="Deskripsi (opsional)" rows={3} defaultValue={c.description ?? ""} maxLength={300} />
          </DialogForm>
          {c.product_count > 0 ? (
            <span className="text-caption text-muted-strong">Tidak bisa dihapus selama dipakai produk</span>
          ) : (
            <ConfirmAction
              action={deleteCategoryAction} fields={{ id: c.id }} label="Hapus" ariaLabel={`Hapus kategori ${c.name}`}
              confirmTitle={`Hapus kategori "${c.name}"?`} confirmDescription="Kategori ini tidak dipakai produk mana pun dan akan dihapus permanen." confirmLabel="Ya, hapus" destructive
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Manajemen kategori"
        description="Kategori yang masih dipakai produk dilindungi dari penghapusan."
        actions={
          <DialogForm triggerLabel="Tambah kategori" title="Tambah kategori" action={saveCategoryAction} submitLabel="Tambah">
            <TextField name="name" label="Nama kategori" required maxLength={80} />
            <AreaField name="description" label="Deskripsi (opsional)" rows={3} maxLength={300} />
          </DialogForm>
        }
      />
      <DataTable columns={columns} rows={categories} empty={{ title: "Belum ada kategori", description: "Tambahkan kategori pertama agar penjual bisa memilihnya." }} />
    </>
  );
}
