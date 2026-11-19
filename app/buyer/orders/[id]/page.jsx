import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import OrderTimeline from "@/components/dashboard/OrderTimeline";
import ReviewForm from "@/components/dashboard/ReviewForm";
import Rating from "@/components/commerce/Rating";
import { OrderStatusBadge } from "@/components/ui/StatusBadges";
import { requireRole } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { first } from "@/lib/query";
import { getOrderDetail } from "@/lib/repositories/buyer";
import { formatRupiah, formatDateTime } from "@/lib/format";

export const metadata = { title: "Detail Pesanan" };

export default async function BuyerOrderDetailPage({ params, searchParams }) {
  const me = await requireRole(["buyer"]);
  const id = parseId((await params).id);
  if (!id) notFound();
  // Query dibatasi buyer_id sesi: pesanan milik orang lain = 404.
  const order = await getOrderDetail(me.id, id);
  if (!order) notFound();
  const isNew = first((await searchParams).baru) === "1";

  return (
    <>
      <Link href="/buyer/orders" className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />Kembali ke riwayat
      </Link>
      <PageHeader title={`Pesanan #${order.id}`} description={formatDateTime(order.created_at)} actions={<OrderStatusBadge status={order.status} />} />

      {isNew && (
        <div role="status" className="mb-6 flex items-start gap-2.5 rounded-card border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success-strong">
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>Pesanan berhasil dibuat. Pembayaran hanya simulasi; penjual akan memproses pesananmu dan statusnya bisa kamu pantau di halaman ini.</p>
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {order.stores.map((s) => (
            <section key={s.id} aria-label={`Pesanan dari ${s.store_name}`} className="rounded-card border border-line bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-card-title">{s.store_name}</h2>
                <OrderStatusBadge status={s.status} />
              </div>
              <div className="my-4"><OrderTimeline status={s.status} /></div>
              <ul className="space-y-4 border-t border-line pt-4">
                {s.items.map((i) => (
                  <li key={i.id}>
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        {i.productId ? <Link href={`/products/${i.productId}`} className="font-medium hover:text-primary hover:underline">{i.name}</Link> : <span className="font-medium">{i.name}</span>}
                        <span className="text-muted-strong"> × {i.quantity}</span>
                        <span className="block text-caption text-muted-strong">{formatRupiah(i.unit_price)} per barang (harga saat pembelian)</span>
                      </span>
                      <span className="shrink-0 font-semibold">{formatRupiah(i.unit_price * i.quantity)}</span>
                    </div>
                    {s.status === "completed" && i.productId && (
                      <div className="mt-3">
                        {i.review ? (
                          <div className="rounded-btn bg-cream/60 p-3 text-sm">
                            <p className="mb-1 font-medium">Ulasan Anda</p>
                            <Rating value={i.review.rating} count={1} showCount={false} />
                            <p className="mt-1">{i.review.comment}</p>
                          </div>
                        ) : (
                          <ReviewForm orderItemId={i.id} productName={i.name} />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              {s.status !== "completed" && s.status !== "cancelled" && (
                <p className="mt-4 text-caption text-muted-strong">Ulasan bisa diberikan setelah pesanan toko ini berstatus Selesai.</p>
              )}
            </section>
          ))}
        </div>

        <aside className="space-y-4 rounded-card border border-line bg-surface p-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="font-medium">Total pesanan</span>
            <span className="font-heading text-xl font-bold text-primary">{formatRupiah(order.total)}</span>
          </div>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-caption text-muted-strong">Penerima</dt><dd>{order.recipient_name} · {order.recipient_phone}</dd></div>
            <div><dt className="text-caption text-muted-strong">Alamat pengiriman</dt><dd className="whitespace-pre-line">{order.shipping_address}</dd></div>
            {order.notes && <div><dt className="text-caption text-muted-strong">Catatan</dt><dd>{order.notes}</dd></div>}
          </dl>
          <p className="text-caption text-muted-strong">Pembayaran disimulasikan, tidak ada transaksi uang sungguhan.</p>
        </aside>
      </div>
    </>
  );
}
