import Link from "next/link";
import { Store } from "lucide-react";
import ProductImage from "./ProductImage";
import PriceDisplay from "./PriceDisplay";
import Rating from "./Rating";
import Badge from "@/components/ui/Badge";

function Availability({ stock }) {
  if (stock <= 0) return <Badge tone="error">Stok habis</Badge>;
  if (stock <= 5) return <Badge tone="warning">Sisa {stock}</Badge>;
  return <Badge tone="success">Tersedia</Badge>;
}

/**
 * Kartu produk klik-penuh menuju halaman detail produk.
 * - product: { id, name, price, stock, image_url, store_name, rating_avg, rating_count }
 * - overlay: slot di pojok kanan atas gambar (tombol favorit).
 */
export default function ProductCard({ product, overlay, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm">
      <div className="relative">
        <div className="overflow-hidden">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        {overlay && <div className="absolute right-2 top-2 z-10">{overlay}</div>}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Heading className="text-card-title line-clamp-2">
          <Link
            href={`/products/${product.id}`}
            className="after:absolute after:inset-0 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {product.name}
          </Link>
        </Heading>
        <PriceDisplay value={product.price} />
        <p className="flex items-center gap-1.5 text-caption text-muted-strong">
          <Store className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{product.store_name}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <Rating value={product.rating_avg} count={product.rating_count} />
          <Availability stock={product.stock} />
        </div>
      </div>
    </article>
  );
}