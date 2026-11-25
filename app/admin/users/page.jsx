import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { RoleBadge, SellerStatusBadge } from "@/components/ui/StatusBadges";
import { requireRole } from "@/lib/auth";
import { listUsers } from "@/lib/repositories/admin";
import { toggleUserStatusAction, deleteUserAction } from "@/lib/actions/admin";
import { qParam, pageParam, enumParam } from "@/lib/query";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Manajemen Pengguna" };

export default async function AdminUsersPage({ searchParams }) {
  const sp = await searchParams;
  const me = await requireRole(["admin"]);
  const q = qParam(sp);
  const role = enumParam(sp, "role", ["admin", "seller", "buyer"]);
  const status = enumParam(sp, "status", ["active", "inactive", "deletion_requested"]);
  const { users, total, page, totalPages } = await listUsers({ q, role, status, page: pageParam(sp) });

  const columns = [
    {
      key: "full_name",
      header: "Nama",
      render: (u) => (
        <div className="max-w-[170px]">
          <p className="truncate font-medium text-charcoal" title={u.full_name}>
            {u.full_name}
          </p>
          {u.phone && <p className="truncate text-xs text-muted-strong">{u.phone}</p>}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (u) => (
        <span className="block max-w-[200px] truncate text-charcoal" title={u.email}>
          {u.email}
        </span>
      ),
    },
    {
      key: "role",
      header: "Peran",
      render: (u) => (
        <div className="whitespace-nowrap">
          <RoleBadge role={u.role} />
        </div>
      ),
    },
    {
      key: "seller_status",
      header: "Status penjual",
      render: (u) => (
        <div className="whitespace-nowrap">
          {u.seller_status ? <SellerStatusBadge status={u.seller_status} /> : <span className="text-muted-strong">-</span>}
        </div>
      ),
    },
    {
      key: "account_status",
      header: "Status akun",
      render: (u) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Badge tone={u.is_active ? "success" : "error"}>{u.is_active ? "Aktif" : "Nonaktif"}</Badge>
          {u.deletion_requested_at && <Badge tone="warning">Minta Hapus</Badge>}
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Terdaftar",
      render: (u) => <span className="whitespace-nowrap">{formatDate(u.created_at)}</span>,
    },
    {
      key: "aksi",
      header: "Aksi",
      render: (u) => {
        if (u.id === me.id || u.role === "admin") {
          return <span className="inline-flex min-h-9 items-center whitespace-nowrap text-caption text-muted-strong">Akun Admin</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <ConfirmAction
              action={toggleUserStatusAction}
              fields={{ id: u.id, nextActive: u.is_active ? "false" : "true" }}
              label={u.is_active ? "Nonaktif" : "Aktif"}
              variant="outline"
              className="whitespace-nowrap"
              ariaLabel={`${u.is_active ? "Nonaktifkan" : "Aktifkan"} akun ${u.full_name}`}
              confirmTitle={u.is_active ? `Nonaktifkan akun ${u.full_name}?` : `Aktifkan kembali akun ${u.full_name}?`}
              confirmDescription={
                <span className="whitespace-normal">
                  {u.is_active
                    ? "Pengguna tidak akan bisa masuk ke dashboard maupun melakukan transaksi hingga akun diaktifkan kembali."
                    : "Pengguna akan dapat masuk kembali dan menggunakan fitur platform seperti biasa."}
                </span>
              }
              confirmLabel={u.is_active ? "Ya, nonaktifkan" : "Ya, aktifkan"}
              destructive={u.is_active}
            />

            {u.deletion_requested_at && (
              <ConfirmAction
                action={deleteUserAction}
                fields={{ id: u.id }}
                label="ACC Hapus"
                variant="outline"
                className="whitespace-nowrap"
                ariaLabel={`Setujui penghapusan akun ${u.full_name}`}
                confirmTitle={`Setujui penghapusan akun ${u.full_name}?`}
                confirmDescription={
                  <span className="block whitespace-normal break-words leading-relaxed">
                    {u.deletion_reason && (
                      <span className="mb-2 block rounded-btn bg-cream px-3 py-2 text-charcoal">
                        <strong>Alasan pengguna:</strong> “{u.deletion_reason}”
                      </span>
                    )}
                    {u.role === "seller"
                      ? "Akun, toko, dan seluruh produk penjual ini akan dihapus permanen. Riwayat pesanan tetap tersimpan."
                      : "Akun akan dihapus permanen. Riwayat pesanan terkait tetap tersimpan tanpa tautan akun."}
                  </span>
                }
                confirmLabel="Ya, ACC & hapus"
                destructive
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Manajemen pengguna"
        description={`${total} pengguna terdaftar. Kelola status aktif akun atau setujui permintaan penghapusan akun.`}
      />
      <SearchFilterBar
        basePath="/admin/users"
        q={q}
        placeholder="Cari nama atau email"
        filters={[
          {
            name: "role",
            label: "Semua peran",
            value: role,
            options: [
              { value: "admin", label: "Admin" },
              { value: "seller", label: "Penjual" },
              { value: "buyer", label: "Pembeli" },
            ],
          },
          {
            name: "status",
            label: "Semua status akun",
            value: status,
            options: [
              { value: "active", label: "Aktif" },
              { value: "inactive", label: "Nonaktif" },
              { value: "deletion_requested", label: "Mengajukan Hapus Akun" },
            ],
          },
        ]}
      />
      <DataTable
        columns={columns}
        rows={users}
        empty={{ title: "Pengguna tidak ditemukan", description: "Ubah kata kunci, filter peran, atau status akun." }}
      />
      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} basePath="/admin/users" params={{ q, role, status }} />
      </div>
    </>
  );
}