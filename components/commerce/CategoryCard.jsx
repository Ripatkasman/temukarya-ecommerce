import Link from "next/link";
import { Tag } from "lucide-react";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?category=${category.id}`}
      className="flex h-full items-center gap-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-primary hover:bg-primary-soft"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-btn bg-cream text-primary">
        <Tag className="size-6" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-card-title">{category.name}</span>
        {category.description && (
          <span className="line-clamp-2 text-caption text-muted-strong">{category.description}</span>
        )}
      </span>
    </Link>
  );
}
