import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Rating bintang. `value` boleh null (belum ada ulasan).
 * Teks alternatif menyebut angka sebenarnya, tidak hanya ikon.
 */
export default function Rating({ value, count, size = "sm", showCount = true, className }) {
  const dim = size === "lg" ? "size-5" : "size-4";

  if (value === null || value === undefined || !count) {
    return <span className={cn("text-caption text-muted-strong", className)}>Belum ada ulasan</span>;
  }

  const rounded = Math.round(Number(value));
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={`Rating ${Number(value).toFixed(1)} dari 5${showCount ? `, ${count} ulasan` : ""}`}
    >
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={cn(dim, n <= rounded ? "fill-accent text-accent" : "text-line")} />
        ))}
      </span>
      <span className="text-caption font-medium text-charcoal" aria-hidden="true">
        {Number(value).toFixed(1)}{showCount && <span className="text-muted-strong"> ({count})</span>}
      </span>
    </span>
  );
}
