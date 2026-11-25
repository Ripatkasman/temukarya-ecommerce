import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import SearchFilterBar from "@/components/dashboard/SearchFilterBar";
import DialogForm from "@/components/dashboard/DialogForm";
import { AreaField } from "@/components/dashboard/ServerForm";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/commerce/ProductImage";
import { listAllProducts, listCategoriesWithUsage } from "@/lib/repositories/admin";
import { deleteProductAsAdminAction } from "@/lib/actions/admin";
import { qParam, pageParam } from "@/lib/query";
import { parseId } from "@/lib/validation";
import { formatRupiah } from "@/lib/format";

export const metadata = { title: "Manajemen Produk" };

export default async function AdminProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = qParam(sp);
  const rawCategory = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const categoryId = rawCategory ? parseId(rawCategory) ?? "" : "";

  const [categories, { products, total, page, totalPages }] = await Promise.all([
    listCategoriesWithUsage(),
    listAllProducts({ q, categoryId, page: pageParam(sp) }),
  ]);

  const columns = [
    {
      key: "name",
      header: "Produk",
      render: (p) => (
        <Link href={`/products/${p.id}`} className="group flex items-center gap-3">
          <span className="size-12 shrink-0 overflow-hidden rounded-btn border border-line bg-cream">
            <ProductImage
              src={p.image_url}
              alt={p.name}
              className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </span>
          <span className="font-medium text-charcoal group-hover:text-primary group-hover:underline">
            {p.name}
          </span>
        </Link>
      ),
    },
    { key: "store", header: "Toko", render: (p) => p.store_name ?? p.seller_name },
    { key: "category_name", header: "Kategori" },
    { key: "price", header: "Harga", render: (p) => formatRupiah(p.price) },
    { key: "stock", header: "Stok" },
    {
      key: "is_active",
      header: "Status",
      render: (p) => <Badge tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Aktif" : "Nonaktif"}</Badge>,
    },
    {
      key: "aksi",
      header: "Aksi",
      render: (p) => (
        <DialogForm
          triggerLabel="Hapus"
          triggerVariant="danger"
          triggerSize="sm"
          title={`Hapus "${p.name}"?`}
          description="Tuliskan alasan penghapusan produk. Produk akan dihapus permanen dan alasan ini akan dikirim ke halaman notifikasi penjual."
          submitLabel="Ya, hapus produk"
          submitVariant="danger"
          action={deleteProductAsAdminAction}
        >
          <input type="hidden" name="id" value={p.id} />
          <AreaField
            name="reason"
            label="Alasan penghapusan produk"
            required
            rows={4}
            maxLength={500}
            placeholder="Contoh: Produk mengandung kata kunci terlarang atau foto tidak sesuai dengan kategori."
            hint="Wajib diisi (minimal 5 karakter)."
          />
        </DialogForm>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Manajemen produk" description={`${total} produk di seluruh toko. Hapus produk yang melanggar aturan platform.`} />
      <SearchFilterBar
        basePath="/admin/products"
        q={q}
        placeholder="Cari nama produk atau toko"
        filters={[
          {
            name: "category",
            label: "Semua kategori",
            value: categoryId,
            options: categories.map((c) => ({ value: c.id, label: c.name })),
          },
        ]}
      />
      <DataTable columns={columns} rows={products} empty={{ title: "Produk tidak ditemukan", description: "Coba kata kunci atau kategori lain." }} />
      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} basePath="/admin/products" params={{ q, category: categoryId }} />
      </div>
    </>
  );
}