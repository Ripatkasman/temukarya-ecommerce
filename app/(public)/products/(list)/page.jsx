import ProductGrid from "@/components/commerce/ProductGrid";
import ProductFilters from "@/components/commerce/ProductFilters";
import AddToCart from "@/components/commerce/AddToCart";
import WishlistToggle from "@/components/commerce/WishlistToggle";
import { getWishlistIds } from "@/lib/repositories/wishlist";
import Pagination from "@/components/ui/Pagination";
import { getCurrentUser } from "@/lib/auth";
import { parseProductFilters } from "@/lib/query";
import { listProducts, listCategories, SORT_OPTIONS } from "@/lib/repositories/catalog";

export const metadata = { title: "Jelajahi Produk" };
export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const { q, categoryId, minPrice, maxPrice, minRating, inStock, sort, page } = parseProductFilters(sp, SORT_OPTIONS.map((o) => o.value));

  const viewer = await getCurrentUser();
  const [categories, result, wished] = await Promise.all([
    listCategories(),
    listProducts({ q, categoryId, minPrice, maxPrice, minRating, inStock, sort, page }),
    viewer?.role === "buyer" ? getWishlistIds(viewer.id) : Promise.resolve(new Set()),
  ]);

  const params = {
    q, category: categoryId, min: minPrice, max: maxPrice, rating: minRating, stok: inStock ? "1" : "",
    sort: sort === "newest" ? "" : sort,
  };
  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="container-page py-10 md:py-12">
      <header className="mb-6">
        <h1 className="text-page-title">Jelajahi Produk</h1>
        <p className="mt-1 text-sm text-muted-strong">
          Karya dari penjual lokal dan kreator independen yang sudah disetujui admin.
        </p>
      </header>

      <ProductFilters categories={categories} values={{ q, category: categoryId, min: minPrice, max: maxPrice, rating: minRating, stok: inStock, sort }} />

      <p className="mb-4 mt-6 text-sm text-muted-strong" aria-live="polite">
        {result.total === 0
          ? "Tidak ada produk yang cocok."
          : `Menampilkan ${result.total} produk${q ? ` untuk "${q}"` : ""}${activeCategory ? ` di kategori ${activeCategory.name}` : ""}.`}
      </p>

      <ProductGrid
        headingLevel={2}
        products={result.products}
        renderActions={(p) => <AddToCart product={p} viewer={viewer} />}
        renderOverlay={(p) => <WishlistToggle product={p} viewer={viewer} wishlisted={wished.has(p.id)} />}
        empty={{ title: "Produk tidak ditemukan", description: "Coba kata kunci lain, ubah rentang harga, atau atur ulang filter.", actionLabel: "Atur ulang filter", actionHref: "/products" }}
      />

      <div className="mt-10">
        <Pagination page={result.page} totalPages={result.totalPages} basePath="/products" params={params} />
      </div>
    </div>
  );
}
