import Link from "next/link";
import {
  Users,
  Store,
  Hourglass,
  ShoppingBag,
  Package,
  ClipboardList,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Badge from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { getOverviewStats, listRecentRegistrations } from "@/lib/repositories/admin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata = { title: "Ringkasan Admin" };
export const dynamic = "force-dynamic";

function RoleAndStatusBadge({ role, sellerStatus }) {
  if (role === "buyer") {
    return <Badge tone="neutral">Pembeli</Badge>;
  }
  if (sellerStatus === "pending") {
    return <Badge tone="warning">Penjual · Menunggu</Badge>;
  }
  if (sellerStatus === "approved") {
    return <Badge tone="success">Penjual · Disetujui</Badge>;
  }
  return <Badge tone="error">Penjual · Ditolak</Badge>;
}

export default async function AdminOverviewPage({ searchParams }) {
  const sp = await searchParams;
  const roleRaw = Array.isArray(sp.role) ? sp.role[0] : sp.role;
  const activeRole = ["buyer", "seller"].includes(roleRaw) ? roleRaw : "";

  const [s, recentUsers] = await Promise.all([
    getOverviewStats(),
    listRecentRegistrations({ role: activeRole, limit: 10 }),
  ]);

  const FILTERS = [
    { value: "", label: "Semua" },
    { value: "buyer", label: "Pembeli" },
    { value: "seller", label: "Penjual" },
  ];

  return (
    <>
      <PageHeader title="Ringkasan platform" description="Angka terkini dari database TemuKarya." />
      {s.pending_sellers > 0 && (
        <Link href="/admin/sellers" className="mb-6 flex items-center justify-between gap-3 rounded-card border border-warning/40 bg-warning-soft px-4 py-3 text-sm font-medium text-warning-strong hover:brightness-95">
          <span>{s.pending_sellers} pendaftaran seller menunggu keputusan Anda.</span>
          <span className="underline">Tinjau sekarang</span>
        </Link>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total pengguna" value={s.total_users} icon={Users} />
        <StatCard label="Penjual" value={s.total_sellers} icon={Store} tone="accent" />
        <StatCard label="Seller menunggu" value={s.pending_sellers} icon={Hourglass} tone="warning" />
        <StatCard label="Pembeli" value={s.total_buyers} icon={ShoppingBag} />
        <StatCard label="Produk aktif" value={s.active_products} icon={Package} tone="success" />
        <StatCard label="Total pesanan" value={s.total_orders} icon={ClipboardList} tone="accent" />
      </div>

      {/* Daftar Riwayat Pengguna Baru */}
      <section aria-labelledby="pengguna-baru" className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="pengguna-baru" className="text-section-title">Pendaftaran Pengguna Terbaru</h2>
            <p className="mt-0.5 text-sm text-muted-strong">
              Riwayat akun pembeli dan penjual yang baru mendaftar ke TemuKarya.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Kelola semua pengguna
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Filter Peran */}
        <nav aria-label="Filter pendaftaran berdasarkan peran" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isSelected = activeRole === f.value;
            const href = f.value ? `/admin?role=${f.value}` : "/admin";
            return (
              <Link
                key={f.value || "all"}
                href={href}
                scroll={false}
                className={cn(
                  "rounded-btn border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface text-charcoal hover:bg-cream"
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        {recentUsers.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="Belum ada pengguna terdaftar"
            description="Pendaftaran akun pembeli dan penjual terbaru akan muncul di sini."
          />
        ) : (
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-cream/60 text-xs font-semibold uppercase tracking-wider text-muted-strong">
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3">Peran & Status</th>
                    <th className="px-4 py-3">Tanggal Daftar</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-cream/40">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-charcoal">{u.full_name}</p>
                        <p className="text-xs text-muted-strong">{u.email}</p>
                        {u.role === "seller" && u.store_name && (
                          <p className="mt-0.5 text-xs font-medium text-primary">
                            Toko: {u.store_name}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <RoleAndStatusBadge role={u.role} sellerStatus={u.seller_status} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-strong whitespace-nowrap">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {u.role === "seller" && u.seller_status === "pending" ? (
                          <Link
                            href="/admin/sellers?status=pending"
                            className="inline-flex items-center gap-1 rounded-btn bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95"
                          >
                            Verifikasi
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/users?q=${encodeURIComponent(u.email)}`}
                            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                          >
                            Detail
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}