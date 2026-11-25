import Link from "next/link";
import ProductImage from "./ProductImage";

export default function StoreCard({ store, variant = "card" }) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/stores/${store.id}`}
        className="group flex flex-col gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-primary sm:flex-row sm:items-center sm:gap-6 sm:p-6"
      >
        <span className="size-20 shrink-0 overflow-hidden rounded-card border border-line bg-cream sm:size-24">
          <ProductImage
            src={store.store_image}
            alt={`Logo ${store.store_name}`}
            ratio="aspect-square"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="font-heading text-xl font-bold text-charcoal group-hover:text-primary sm:text-2xl">
            {store.store_name}
          </h3>
          {store.description && (
            <p className="line-clamp-2 text-sm text-muted-strong">
              {store.description}
            </p>
          )}
          <p className="pt-0.5 text-sm text-muted-strong">
            {store.product_count ?? 0} produk aktif. Penjual telah disetujui admin TemuKarya.
          </p>
        </div>
      </Link>
    );
  }

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