import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/commerce/ProductImage";
import { listAllProducts } from "@/lib/repositories/admin";
import { deleteProductAsAdminAction } from "@/lib/actions/admin";
import { qParam, pageParam } from "@/lib/query";
import { formatRupiah } from "@/lib/format";

export const metadata = { title: "Manajemen Produk" };

export default async function AdminProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = qParam(sp);
  const { products, total, page, totalPages } = await listAllProducts({ q, page: pageParam(sp) });

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
    { key: "store", header: "Toko", render: (p) => p.store_name ?? p.seller_name },
    { key: "category_name", header: "Kategori" },
    { key: "price", header: "Harga", render: (p) => formatRupiah(p.price) },
    { key: "stock", header: "Stok" },
    { key: "is_active", header: "Status", render: (p) => <Badge tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge> },
    {
      key: "aksi", header: "Aksi",
      render: (p) => (
        <ConfirmAction
          action={deleteProductAsAdminAction} fields={{ id: p.id }} label="Hapus" ariaLabel={`Hapus produk ${p.name}`}
          confirmTitle={`Hapus "${p.name}"?`}
          confirmDescription="Gunakan untuk produk yang melanggar aturan platform. Produk dihapus permanen dari katalog dan keranjang pembeli; riwayat pesanan tetap tersimpan."
          confirmLabel="Ya, hapus produk" destructive
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Manajemen produk" description={`${total} produk di seluruh toko. Hapus produk yang melanggar aturan platform.`} />
      <SearchFilterBar basePath="/admin/products" q={q} placeholder="Cari nama produk" />
      <DataTable columns={columns} rows={products} empty={{ title: "Produk tidak ditemukan", description: "Coba kata kunci lain." }} />
      <div className="mt-6"><Pagination page={page} totalPages={totalPages} basePath="/admin/products" params={{ q }} /></div>
    </>
  );
}
