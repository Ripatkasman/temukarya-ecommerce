import { Plus, SquarePen } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import ProductImage from "@/components/commerce/ProductImage";
import { requireRole } from "@/lib/auth";
import { listSellerProducts } from "@/lib/repositories/seller";
import { deleteProductAction } from "@/lib/actions/seller";
import { qParam, pageParam } from "@/lib/query";
import { formatRupiah } from "@/lib/format";

export const metadata = { title: "Produk Saya" };

export default async function SellerProductsPage({ searchParams }) {
  const sp = await searchParams;
  const me = await requireRole(["seller"]);
  const q = qParam(sp);
  const { products, total, page, totalPages } = await listSellerProducts(me.id, { q, page: pageParam(sp) });

  const columns = [
    {
      key: "name", header: "Produk",
      render: (p) => (
        <div className="flex items-center gap-3">
          <span className="size-12 shrink-0 overflow-hidden rounded-btn border border-line"><ProductImage src={p.image_url} alt="" className="size-full" /></span>
          <span className="font-medium">{p.name}</span>
        </div>
      ),
    },
    { key: "category_name", header: "Kategori" },
    { key: "price", header: "Harga", render: (p) => formatRupiah(p.price) },
    { key: "stock", header: "Stok", render: (p) => (p.stock === 0 ? <Badge tone="error">Habis</Badge> : p.stock <= 5 ? <Badge tone="warning">{p.stock}</Badge> : p.stock) },
    { key: "is_active", header: "Status", render: (p) => <Badge tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge> },
    {
      key: "aksi", header: "Aksi",
      render: (p) => (
        <div className="flex flex-wrap gap-2">
          <Button href={`/seller/products/${p.id}/edit`} variant="outline" size="sm" aria-label={`Ubah ${p.name}`}>
            <SquarePen className="size-4" aria-hidden="true" />Ubah
          </Button>
          <ConfirmAction
            action={deleteProductAction} fields={{ id: p.id }} label="Hapus" ariaLabel={`Hapus ${p.name}`}
            confirmTitle={`Hapus "${p.name}"?`} confirmDescription="Produk dihapus permanen dari katalog dan keranjang pembeli. Riwayat pesanan yang sudah ada tetap tersimpan." confirmLabel="Ya, hapus" destructive
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Produk saya" description={`${total} produk di toko Anda.`}
        actions={<Button href="/seller/products/new"><Plus className="size-5" aria-hidden="true" />Tambah produk</Button>}
      />
      <SearchFilterBar basePath="/seller/products" q={q} placeholder="Cari nama produk" />
      <DataTable
        columns={columns} rows={products}
        empty={q ? { title: "Produk tidak ditemukan", description: "Coba kata kunci lain." } : { title: "Belum ada produk", description: "Tambahkan produk pertama agar tampil di katalog.", actionLabel: "Tambah produk", actionHref: "/seller/products/new" }}
      />
      <div className="mt-6"><Pagination page={page} totalPages={totalPages} basePath="/seller/products" params={{ q }} /></div>
    </>
  );
}
