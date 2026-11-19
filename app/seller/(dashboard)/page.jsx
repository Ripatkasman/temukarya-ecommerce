import Link from "next/link";
import { Package, TriangleAlert, Inbox, Truck, CheckCircle2, PackageX } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { requireRole } from "@/lib/auth";
import { getSellerOverview } from "@/lib/repositories/seller";

export const metadata = { title: "Ringkasan Penjual" };

export default async function SellerOverviewPage() {
  const me = await requireRole(["seller"]);
  const s = await getSellerOverview(me.id);
  return (
    <>
      <PageHeader title={`Halo, ${me.fullName.split(" ")[0]}`} description="Ringkasan toko dan pesanan Anda." />
      {s.awaiting > 0 && (
        <Link href="/seller/orders?status=awaiting_payment" className="mb-6 flex items-center justify-between gap-3 rounded-card border border-warning/40 bg-warning-soft px-4 py-3 text-sm font-medium text-warning-strong hover:brightness-95">
          <span>{s.awaiting} pesanan baru menunggu Anda proses.</span>
          <span className="underline">Lihat pesanan</span>
        </Link>
      )}
      <h2 className="text-section-title mb-3">Produk</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total produk" value={s.product_count} icon={Package} />
        <StatCard label="Stok menipis (1-5)" value={s.low_stock} icon={TriangleAlert} tone="warning" />
        <StatCard label="Stok habis" value={s.out_of_stock} icon={PackageX} tone="accent" />
      </div>
      <h2 className="text-section-title mb-3 mt-8">Pesanan</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Menunggu diproses" value={s.awaiting} icon={Inbox} tone="warning" />
        <StatCard label="Sedang diproses/dikirim" value={s.in_progress} icon={Truck} />
        <StatCard label="Selesai" value={s.completed} icon={CheckCircle2} tone="success" />
      </div>
    </>
  );
}
