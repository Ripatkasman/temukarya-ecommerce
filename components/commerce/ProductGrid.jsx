import ProductCard from "./ProductCard";
import { EmptyState } from "@/components/ui/States";

/** Grid responsif: 2 kolom (mobile) -> 3 -> 4. Kartu seragam tinggi. */
export default function ProductGrid({ products, renderActions, renderOverlay, empty }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Produk tidak ditemukan"
        description="Coba kata kunci atau filter yang berbeda."
        {...empty}
      />
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} actions={renderActions?.(p)} overlay={renderOverlay?.(p)} />
        </li>
      ))}
    </ul>
  );
}
