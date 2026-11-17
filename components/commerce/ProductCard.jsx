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
 * Kartu produk.
 * product: { id, name, price, stock, image_url, store_name, rating_avg, rating_count }
 * `actions`: slot untuk tombol Add to Cart / Wishlist (diisi komponen klien yang benar-benar bekerja).
 */
export default function ProductCard({ product, actions }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-primary/50">
      <Link href={`/products/${product.id}`} className="block overflow-hidden" aria-label={`Lihat ${product.name}`} tabIndex={-1}>
        <ProductImage src={product.image_url} alt={product.name} className="transition-transform duration-300 group-hover:scale-[1.03]" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-card-title line-clamp-2">
          <Link href={`/products/${product.id}`} className="hover:text-primary">{product.name}</Link>
        </h3>
        <PriceDisplay value={product.price} />
        <p className="flex items-center gap-1.5 text-caption text-muted-strong">
          <Store className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{product.store_name}</span>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Rating value={product.rating_avg} count={product.rating_count} />
          <Availability stock={product.stock} />
        </div>
        {actions && <div className="mt-auto flex gap-2 pt-2">{actions}</div>}
      </div>
    </article>
  );
}
