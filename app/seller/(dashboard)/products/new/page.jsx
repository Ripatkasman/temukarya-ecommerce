import PageHeader from "@/components/dashboard/PageHeader";
import ProductForm from "@/components/dashboard/ProductForm";
import { listCategories } from "@/lib/repositories/catalog";

export const metadata = { title: "Tambah Produk" };

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <>
      <PageHeader title="Tambah produk" description="Semua kolom wajib diisi." />
      <ProductForm categories={categories} />
    </>
  );
}
