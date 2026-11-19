import ProductGrid from "@/components/commerce/ProductGrid";
import ProductFilters from "@/components/commerce/ProductFilters";
import AddToCart from "@/components/commerce/AddToCart";
import Pagination from "@/components/ui/Pagination";
import { getCurrentUser } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { listProducts, listCategories, SORT_OPTIONS } from "@/lib/repositories/catalog";

export const metadata = { title: "Jelajahi Produk" };
export const dynamic = "force-dynamic";

const MAX_PRICE = 9_999_999_999;
const first = (v) => (Array.isArray(v) ? v[0] : v);

/** Angka rupiah dari query string: bilangan bulat 0..MAX_PRICE, selain itu diabaikan. */
function parsePrice(v) {
  const s = first(v);
  if (typeof s !== "string" || !/^\d{1,10}$/.test(s)) return null;
  const n = Number(s);
  return n <= MAX_PRICE ? n : null;
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = (typeof first(sp.q) === "string" ? first(sp.q).trim() : "").slice(0, 100);
  const categoryId = parseId(first(sp.category));
  const minPrice = parsePrice(sp.min);
  const maxPrice = parsePrice(sp.max);
  const sortRaw = first(sp.sort);
  const sort = SORT_OPTIONS.some((o) => o.value === sortRaw) ? sortRaw : "newest";
  const pageRaw = Number(first(sp.page));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const [viewer, categories, result] = await Promise.all([
    getCurrentUser(),
    listCategories(),
    listProducts({ q, categoryId, minPrice, maxPrice, sort, page }),
  ]);

  const params = { q, category: categoryId, min: minPrice, max: maxPrice, sort: sort === "newest" ? "" : sort };
  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="container-page py-10 md:py-12">
      <header className="mb-6">
        <h1 className="text-page-title">Jelajahi Produk</h1>
        <p className="mt-1 text-sm text-muted-strong">
          Karya dari penjual lokal dan kreator independen yang sudah disetujui admin.
        </p>
      </header>

      <ProductFilters categories={categories} values={{ q, category: categoryId, min: minPrice, max: maxPrice, sort }} />

      <p className="mb-4 mt-6 text-sm text-muted-strong" aria-live="polite">
        {result.total === 0
          ? "Tidak ada produk yang cocok."
          : `Menampilkan ${result.total} produk${q ? ` untuk "${q}"` : ""}${activeCategory ? ` di kategori ${activeCategory.name}` : ""}.`}
      </p>

      <ProductGrid
        products={result.products}
        renderActions={(p) => <AddToCart product={p} viewer={viewer} />}
        empty={{ title: "Produk tidak ditemukan", description: "Coba kata kunci lain, ubah rentang harga, atau atur ulang filter.", actionLabel: "Atur ulang filter", actionHref: "/products" }}
      />

      <div className="mt-10">
        <Pagination page={result.page} totalPages={result.totalPages} basePath="/products" params={params} />
      </div>
    </div>
  );
}
