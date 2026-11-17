import Link from "next/link";
import ProductImage from "./ProductImage";

export default function StoreCard({ store }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-primary"
    >
      <ProductImage src={store.store_image} alt={store.store_name} ratio="aspect-[16/9]" />
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-card-title">{store.store_name}</h3>
        {store.description && (
          <p className="line-clamp-2 text-sm text-muted-strong">{store.description}</p>
        )}
        {store.product_count !== undefined && (
          <p className="mt-auto pt-2 text-caption font-medium text-primary">{store.product_count} produk</p>
        )}
      </div>
    </Link>
  );
}
