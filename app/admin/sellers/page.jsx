import Link from "next/link";
import { Store } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import { SellerStatusBadge } from "@/components/ui/StatusBadges";
import { EmptyState } from "@/components/ui/States";
import { listSellerApplications } from "@/lib/repositories/admin";
import { decideSellerAction } from "@/lib/actions/admin";
import { enumParam } from "@/lib/query";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata = { title: "Verifikasi Seller" };

const TABS = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "all", label: "Semua" },
];

export default async function AdminSellersPage({ searchParams }) {
  const sp = await searchParams;
  const tab = enumParam(sp, "status", ["pending", "approved", "rejected", "all"]) || "pending";
  const sellers = await listSellerApplications({ status: tab === "all" ? "" : tab });

  return (
    <>
      <PageHeader title="Verifikasi seller" description="Setujui atau tolak pendaftaran penjual. Keputusan ini tidak bisa diubah setelah dibuat." />
      <nav aria-label="Filter status" className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value} href={`/admin/sellers?status=${t.value}`} aria-current={tab === t.value ? "page" : undefined}
            className={cn("inline-flex min-h-11 items-center rounded-btn px-4 text-sm font-semibold", tab === t.value ? "bg-primary text-white" : "border border-line bg-surface hover:border-primary")}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {sellers.length === 0 ? (
        <EmptyState icon={Store} title="Tidak ada pendaftaran" description="Belum ada seller pada kategori status ini." />
      ) : (
        <ul className="space-y-4">
          {sellers.map((s) => (
            <li key={s.id} className="rounded-card border border-line bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-card-title">{s.full_name}</h2>
                  <p className="text-sm text-muted-strong">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                </div>
                <SellerStatusBadge status={s.seller_status} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-caption text-muted-strong">Nama toko</dt>
                  <dd className="font-medium">{s.store_name ?? "Belum ada toko"}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-strong">Mendaftar</dt>
                  <dd>{formatDateTime(s.created_at)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-caption text-muted-strong">Deskripsi toko</dt>
                  <dd>{s.store_description || <span className="text-muted-strong">Tidak diisi</span>}</dd>
                </div>
                {s.reviewed_at && (
                  <div className="sm:col-span-2">
                    <dt className="text-caption text-muted-strong">Keputusan</dt>
                    <dd>{formatDateTime(s.reviewed_at)}{s.reviewed_by_name ? ` oleh ${s.reviewed_by_name}` : ""}</dd>
                  </div>
                )}
              </dl>
              {s.seller_status === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  <ConfirmAction
                    action={decideSellerAction} fields={{ id: s.id, decision: "approve" }} label="Setujui" variant="primary" size="md"
                    ariaLabel={`Setujui ${s.full_name}`}
                    confirmTitle={`Setujui ${s.full_name}?`} confirmDescription="Seller akan bisa mengelola toko dan produknya, dan produknya tampil di katalog publik." confirmLabel="Ya, setujui"
                  />
                  <ConfirmAction
                    action={decideSellerAction} fields={{ id: s.id, decision: "reject" }} label="Tolak" variant="outline" size="md"
                    ariaLabel={`Tolak ${s.full_name}`}
                    confirmTitle={`Tolak ${s.full_name}?`} confirmDescription="Seller akan melihat status ditolak dan hanya bisa menghapus akunnya. Keputusan tidak bisa dibatalkan." confirmLabel="Ya, tolak" destructive
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
