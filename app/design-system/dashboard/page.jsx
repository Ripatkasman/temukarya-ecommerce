import { notFound } from "next/navigation";
import { Package, Inbox, Clock, CheckCircle2 } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import Button from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/StatusBadges";
import { formatRupiah } from "@/lib/format";

export const metadata = { title: "Kerangka dashboard" };

// Menu contoh seller. Ikon dirujuk lewat nama (lihat DashboardShell).
const SELLER_NAV = [
  { href: "/design-system/dashboard", label: "Ringkasan", icon: "overview", exact: true },
  { href: "/design-system/dashboard/store", label: "Kelola Toko", icon: "store" },
  { href: "/design-system/dashboard/products", label: "Produk Saya", icon: "products" },
  { href: "/design-system/dashboard/orders", label: "Pesanan Masuk", icon: "incoming" },
];

// DATA CONTOH (demo).
const ROWS = [
  { id: 1, product: "Tas Anyaman Lontar", buyer: "Andi Pembeli", total: 185000, status: "awaiting_payment" },
  { id: 2, product: "Tenun Sutra Sengkang", buyer: "Dewi Lestari", total: 450000, status: "processing" },
  { id: 3, product: "Hiasan Dinding Rotan", buyer: "Rudi Hartono", total: 95000, status: "completed" },
];

export default function DashboardDemoPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <DashboardShell roleLabel="Seller" userName="Sari Kriya" items={SELLER_NAV}>
      <PageHeader
        title="Ringkasan toko"
        description="Contoh kerangka dashboard. Angka di sini adalah data contoh."
        actions={<Button href="/design-system/dashboard/products" size="sm">Tambah produk</Button>}
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Produk aktif" value="4" icon={Package} />
        <StatCard label="Pesanan masuk" value="3" icon={Inbox} tone="accent" />
        <StatCard label="Perlu diproses" value="1" icon={Clock} tone="warning" />
        <StatCard label="Selesai" value="1" icon={CheckCircle2} tone="success" />
      </div>
      <h2 className="text-section-title mb-3 mt-8">Pesanan terbaru</h2>
      <DataTable
        rows={ROWS}
        columns={[
          { key: "product", header: "Produk" },
          { key: "buyer", header: "Pembeli" },
          { key: "total", header: "Total", render: (r) => formatRupiah(r.total) },
          { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
        ]}
      />
    </DashboardShell>
  );
}
