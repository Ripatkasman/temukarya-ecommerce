import { ProductCardSkeleton } from "@/components/ui/States";

export default function Loading() {
  return (
    <div className="container-page py-10 md:py-12" role="status" aria-label="Memuat produk">
      <div className="mb-6 h-8 w-56 animate-pulse rounded bg-cream" />
      <div className="mb-8 h-40 animate-pulse rounded-card bg-cream" />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i}><ProductCardSkeleton /></li>
        ))}
      </ul>
    </div>
  );
}
