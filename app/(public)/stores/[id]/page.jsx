import { notFound } from "next/navigation";
import ProductImage from "@/components/commerce/ProductImage";
import ProductGrid from "@/components/commerce/ProductGrid";
import AddToCart from "@/components/commerce/AddToCart";
import Pagination from "@/components/ui/Pagination";
import { getCurrentUser } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { getStore, listProducts } from "@/lib/repositories/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const id = parseId((await params).id);
  const store = id ? await getStore(id) : null;
  return { title: store ? store.store_name : "Toko tidak ditemukan" };
}

export default async function StorePage({ params, searchParams }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const store = await getStore(id);
  if (!store) notFound();

  const pageRaw = Number((await searchParams).page);
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const [viewer, result] = await Promise.all([getCurrentUser(), listProducts({ storeId: id, page })]);

  return (
    <div className="container-page py-8 md:py-12">
      <header className="flex flex-col gap-5 rounded-card border border-line bg-surface p-5 sm:flex-row sm:items-center">
        <span className="size-24 shrink-0 overflow-hidden rounded-card border border-line">
          <ProductImage src={store.store_image} alt={`Logo ${store.store_name}`} className="size-full" />
        </span>
        <div className="min-w-0">
          <h1 className="text-page-title">{store.store_name}</h1>
          {store.description && <p className="mt-1 max-w-2xl text-sm text-muted-strong">{store.description}</p>}
          <p className="mt-2 text-caption text-muted-strong">
            {store.product_count} produk aktif. Penjual telah disetujui admin TemuKarya.
          </p>
        </div>
      </header>

      <section aria-labelledby="produk-toko" className="mt-10">
        <h2 id="produk-toko" className="text-section-title mb-5">Produk dari toko ini</h2>
        <ProductGrid
          products={result.products}
          renderActions={(p) => <AddToCart product={p} viewer={viewer} />}
          empty={{ title: "Belum ada produk", description: "Toko ini belum menampilkan produk.", actionLabel: "Jelajahi produk lain", actionHref: "/products" }}
        />
        <div className="mt-10">
          <Pagination page={result.page} totalPages={result.totalPages} basePath={`/stores/${id}`} />
        </div>
      </section>
    </div>
  );
}
