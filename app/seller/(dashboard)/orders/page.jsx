import Link from "next/link";
import { Inbox } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import { OrderStatusBadge } from "@/components/ui/StatusBadges";
import { EmptyState } from "@/components/ui/States";
import Pagination from "@/components/ui/Pagination";
import { requireRole } from "@/lib/auth";
import { listIncomingOrders, SELLER_TRANSITIONS } from "@/lib/repositories/seller";
import { updateOrderStatusAction } from "@/lib/actions/seller";
import { enumParam, pageParam } from "@/lib/query";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata = { title: "Pesanan Masuk" };

const STATUSES = ["awaiting_payment", "processing", "shipped", "completed", "cancelled"];
const TABS = [
  { value: "", label: "Semua" },
  { value: "awaiting_payment", label: "Menunggu Pembayaran" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const ACTIONS = {
  processing: {
    label: "Proses pesanan", variant: "primary",
    title: "Proses pesanan ini?",
    description: "Pembayaran pada proyek ini hanya simulasi. Dengan memproses, Anda menganggap pembayaran sudah diterima dan mulai menyiapkan barang.",
  },
  shipped: { label: "Tandai dikirim", variant: "primary", title: "Tandai sudah dikirim?", description: "Pembeli akan melihat status Dikirim." },
  completed: { label: "Tandai selesai", variant: "primary", title: "Tandai pesanan selesai?", description: "Gunakan setelah barang sampai. Pembeli baru bisa memberi ulasan setelah status Selesai." },
  cancelled: { label: "Batalkan", variant: "outline", destructive: true, title: "Batalkan pesanan ini?", description: "Stok barang dalam pesanan ini akan dikembalikan. Pembatalan tidak bisa diurungkan." },
};

export default async function SellerOrdersPage({ searchParams }) {
  const sp = await searchParams;
  const me = await requireRole(["seller"]);
  const status = enumParam(sp, "status", STATUSES);
  const { orders, total, page, totalPages } = await listIncomingOrders(me.id, { status, page: pageParam(sp) });

  return (
    <>
      <PageHeader title="Pesanan masuk" description="Hanya pesanan untuk toko Anda yang tampil di sini. Pembayaran disimulasikan." />
      <nav aria-label="Filter status" className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value} href={t.value ? `/seller/orders?status=${t.value}` : "/seller/orders"} aria-current={status === t.value ? "page" : undefined}
            className={cn("inline-flex min-h-11 items-center rounded-btn px-4 text-sm font-semibold", status === t.value ? "bg-primary text-white" : "border border-line bg-surface hover:border-primary")}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <EmptyState icon={Inbox} title="Belum ada pesanan" description="Pesanan akan muncul di sini ketika pembeli membeli produk Anda." />
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-card border border-line bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-card-title">Pesanan #{o.order_id}</h2>
                  <p className="text-caption text-muted-strong">{formatDateTime(o.created_at)}</p>
                </div>
                <OrderStatusBadge status={o.fulfillment_status} />
              </div>

              <ul className="mt-4 divide-y divide-line rounded-btn border border-line text-sm">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="min-w-0"><span className="font-medium">{i.name}</span> <span className="text-muted-strong">× {i.quantity}</span></span>
                    <span className="shrink-0">{formatRupiah(i.unit_price * i.quantity)}</span>
                  </li>
                ))}
                <li className="flex justify-between bg-cream/60 px-3 py-2.5 font-semibold"><span>Total</span><span>{formatRupiah(o.total)}</span></li>
              </ul>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-caption text-muted-strong">Penerima</dt><dd>{o.recipient_name} · {o.recipient_phone}</dd></div>
                <div><dt className="text-caption text-muted-strong">Alamat pengiriman</dt><dd className="whitespace-pre-line">{o.shipping_address}</dd></div>
                {o.notes && <div className="sm:col-span-2"><dt className="text-caption text-muted-strong">Catatan pembeli</dt><dd>{o.notes}</dd></div>}
              </dl>

              {SELLER_TRANSITIONS[o.fulfillment_status].length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {SELLER_TRANSITIONS[o.fulfillment_status].map((next) => {
                    const a = ACTIONS[next];
                    return (
                      <ConfirmAction
                        key={next} action={updateOrderStatusAction} fields={{ id: o.id, status: next }}
                        label={a.label} variant={a.variant} size="md" destructive={a.destructive}
                        ariaLabel={`${a.label} pesanan #${o.order_id}`}
                        confirmTitle={a.title} confirmDescription={a.description} confirmLabel={`Ya, ${a.label.toLowerCase()}`}
                      />
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6"><Pagination page={page} totalPages={totalPages} basePath="/seller/orders" params={{ status }} /></div>
      <p className="sr-only">{total} pesanan</p>
    </>
  );
}
