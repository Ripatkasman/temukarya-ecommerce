import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import DialogForm from "@/components/dashboard/DialogForm";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import { TextField } from "@/components/dashboard/ServerForm";
import Pagination from "@/components/ui/Pagination";
import { RoleBadge, SellerStatusBadge } from "@/components/ui/StatusBadges";
import { requireRole } from "@/lib/auth";
import { listUsers } from "@/lib/repositories/admin";
import { updateUserAction, deleteUserAction } from "@/lib/actions/admin";
import { qParam, pageParam, enumParam } from "@/lib/query";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Manajemen Pengguna" };

export default async function AdminUsersPage({ searchParams }) {
  const sp = await searchParams;
  const me = await requireRole(["admin"]);
  const q = qParam(sp);
  const role = enumParam(sp, "role", ["admin", "seller", "buyer"]);
  const { users, total, page, totalPages } = await listUsers({ q, role, page: pageParam(sp) });

  const columns = [
    { key: "full_name", header: "Nama", render: (u) => <span className="font-medium">{u.full_name}</span> },
    { key: "email", header: "Email" },
    { key: "role", header: "Peran", render: (u) => <RoleBadge role={u.role} /> },
    { key: "seller_status", header: "Status penjual", render: (u) => (u.seller_status ? <SellerStatusBadge status={u.seller_status} /> : <span className="text-muted-strong">-</span>) },
    { key: "created_at", header: "Terdaftar", render: (u) => formatDate(u.created_at) },
    {
      key: "aksi", header: "Aksi",
      render: (u) => (
        <div className="flex flex-wrap gap-2">
          <DialogForm triggerLabel="Ubah" triggerVariant="outline" triggerSize="sm" title={`Ubah ${u.full_name}`} description="Peran dan status penjual tidak bisa diubah dari sini." action={updateUserAction}>
            <input type="hidden" name="id" value={u.id} />
            <TextField name="fullName" label="Nama lengkap" required defaultValue={u.full_name} maxLength={100} />
            <TextField name="email" type="email" label="Email" required defaultValue={u.email} />
            <TextField name="phone" label="Telepon (opsional)" defaultValue={u.phone ?? ""} />
          </DialogForm>
          {u.id === me.id ? (
            <span className="inline-flex min-h-9 items-center text-caption text-muted-strong">Akun Anda</span>
          ) : (
            <ConfirmAction
              action={deleteUserAction} fields={{ id: u.id }} label="Hapus" variant="outline" ariaLabel={`Hapus ${u.full_name}`}
              confirmTitle={`Hapus ${u.full_name}?`}
              confirmDescription={
                u.role === "seller"
                  ? "Akun, toko, dan semua produk penjual ini akan dihapus permanen. Riwayat pesanan pembeli tetap tersimpan."
                  : "Akun akan dihapus permanen. Riwayat pesanan yang terkait tetap tersimpan tanpa tautan ke akun ini."
              }
              confirmLabel="Ya, hapus" destructive
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Manajemen pengguna" description={`${total} pengguna terdaftar.`} />
      <SearchFilterBar
        basePath="/admin/users" q={q} placeholder="Cari nama atau email"
        filters={[{ name: "role", label: "Semua peran", value: role, options: [{ value: "admin", label: "Admin" }, { value: "seller", label: "Penjual" }, { value: "buyer", label: "Pembeli" }] }]}
      />
      <DataTable columns={columns} rows={users} empty={{ title: "Pengguna tidak ditemukan", description: "Ubah kata kunci atau filter peran." }} />
      <div className="mt-6"><Pagination page={page} totalPages={totalPages} basePath="/admin/users" params={{ q, role }} /></div>
    </>
  );
}
