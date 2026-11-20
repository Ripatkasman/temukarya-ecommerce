import Link from "next/link";
import { ClipboardList, Clock, Truck, CheckCircle2, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Button from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/StatusBadges";
import { EmptyState } from "@/components/ui/States";
import { requireRole } from "@/lib/auth";
import { getBuyerOverview, listOrders, getCartCount } from "@/lib/repositories/buyer";
import { formatRupiah, formatDateTime } from "@/lib/format";

export const metadata = { title: "Ringkasan Pembeli" };

export default async function BuyerOverviewPage() {
  const me = await requireRole(["buyer"]);
  const [s, recent, cartCount] = await Promise.all([getBuyerOverview(me.id), listOrders(me.id, { page: 1 }), getCartCount(me.id)]);
  return (
    <>
      <PageHeader
        title={`Halo, ${me.fullName.split(" ")[0]}`} description="Ringkasan pesanan dan keranjang Anda."
        actions={<Button href="/products" variant="outline">Jelajahi produk</Button>}
      />
      {cartCount > 0 && (
        <Link href="/buyer/cart" className="mb-6 flex items-center justify-between gap-3 rounded-card border border-primary/30 bg-primary-soft px-4 py-3 text-sm font-medium text-primary hover:brightness-95">
          <span className="flex items-center gap-2"><ShoppingCart className="size-4" aria-hidden="true" />{cartCount} barang menunggu di keranjang Anda.</span>
          <span className="underline">Lihat keranjang</span>
        </Link>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total pesanan" value={s.totalOrders} icon={ClipboardList} />
        <StatCard label="Menunggu pembayaran" value={s.awaiting} icon={Clock} tone="warning" hint="Hitungan per toko" />
        <StatCard label="Diproses/dikirim" value={s.inProgress} icon={Truck} tone="accent" hint="Hitungan per toko" />
        <StatCard label="Selesai" value={s.completed} icon={CheckCircle2} tone="success" hint="Hitungan per toko" />
      </div>

      <h2 className="text-section-title mb-3 mt-10">Pesanan terbaru</h2>
      {recent.orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Belum ada pesanan" description="Pesanan yang kamu buat akan tampil di sini beserta statusnya." actionLabel="Mulai belanja" actionHref="/products" />
      ) : (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface">
          {recent.orders.slice(0, 5).map((o) => (
            <li key={o.id}>
              <Link href={`/buyer/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-cream/60">
                <span>
                  <span className="block text-sm font-semibold">Pesanan #{o.id}</span>
                  <span className="text-caption text-muted-strong">{formatDateTime(o.created_at)} · {o.item_count} barang</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{formatRupiah(o.total)}</span>
                  <OrderStatusBadge status={o.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
