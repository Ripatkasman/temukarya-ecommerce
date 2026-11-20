import Link from "next/link";
import { Users, Store, Hourglass, ShoppingBag, Package, ClipboardList } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { getOverviewStats } from "@/lib/repositories/admin";

export const metadata = { title: "Ringkasan Admin" };

export default async function AdminOverviewPage() {
  const s = await getOverviewStats();
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
    </>
  );
}
