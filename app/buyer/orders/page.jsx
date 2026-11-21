import Link from "next/link";
import { ClipboardList } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { OrderStatusBadge } from "@/components/ui/StatusBadges";
import { requireRole } from "@/lib/auth";
import { listOrders } from "@/lib/repositories/buyer";
import { pageParam } from "@/lib/query";
import { formatRupiah, formatDateTime } from "@/lib/format";

export const metadata = { title: "Riwayat Pesanan" };

export default async function BuyerOrdersPage({ searchParams }) {
  const me = await requireRole(["buyer"]);
  const { orders, page, totalPages } = await listOrders(me.id, { page: pageParam(await searchParams) });

  const columns = [
    { key: "id", header: "Pesanan", render: (o) => <Link href={`/buyer/orders/${o.id}`} className="font-semibold text-primary underline-offset-4 hover:underline">#{o.id}</Link> },
    { key: "created_at", header: "Tanggal", render: (o) => formatDateTime(o.created_at) },
    { key: "item_count", header: "Barang" },
    { key: "total", header: "Total", render: (o) => formatRupiah(o.total) },
    { key: "status", header: "Status", render: (o) => <OrderStatusBadge status={o.status} /> },
    { key: "aksi", header: "Aksi", render: (o) => <Button href={`/buyer/orders/${o.id}`} variant="outline" size="sm" aria-label={`Lihat detail pesanan #${o.id}`}>Lihat detail</Button> },
  ];

  return (
    <>
      <PageHeader title="Riwayat pesanan" description="Semua pesanan beserta statusnya, termasuk yang masih dalam pengiriman. Pembayaran disimulasikan." />
      <DataTable columns={columns} rows={orders} empty={{ icon: ClipboardList, title: "Belum ada pesanan", description: "Pesanan yang kamu buat akan tampil di sini.", actionLabel: "Mulai belanja", actionHref: "/products" }} />
      <div className="mt-6"><Pagination page={page} totalPages={totalPages} basePath="/buyer/orders" /></div>
    </>
  );
}
