import { notFound } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import ProductForm from "@/components/dashboard/ProductForm";
import { requireRole } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { getSellerProduct } from "@/lib/repositories/seller";
import { listCategories } from "@/lib/repositories/catalog";

export const metadata = { title: "Ubah Produk" };

export default async function EditProductPage({ params }) {
  const me = await requireRole(["seller"]);
  const id = parseId((await params).id);
  if (!id) notFound();
  // Hanya produk milik seller ini yang ditemukan; produk seller lain = 404.
  const [product, categories] = await Promise.all([getSellerProduct(me.id, id), listCategories()]);
  if (!product) notFound();
  return (
    <>
      <PageHeader title="Ubah produk" description={product.name} />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
