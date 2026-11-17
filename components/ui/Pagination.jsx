import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

function buildHref(basePath, params, page) {
  const sp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && k !== "page") sp.set(k, String(v));
  });
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Pagination berbasis link (bekerja di Server Component, tanpa JS klien). */
export default function Pagination({ page = 1, totalPages = 1, basePath, params }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const itemBase = "flex size-11 items-center justify-center rounded-btn text-sm font-semibold";

  return (
    <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={buildHref(basePath, params, page - 1)} className={cn(itemBase, "border border-line bg-surface hover:border-primary")} aria-label="Halaman sebelumnya">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(itemBase, "border border-line bg-cream text-muted opacity-60")} aria-hidden="true">
          <ChevronLeft className="size-5" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-strong" aria-hidden="true">…</span>
        ) : (
          <Link
            key={p}
            href={buildHref(basePath, params, p)}
            aria-label={`Halaman ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              itemBase,
              p === page ? "bg-primary text-white" : "border border-line bg-surface hover:border-primary"
            )}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={buildHref(basePath, params, page + 1)} className={cn(itemBase, "border border-line bg-surface hover:border-primary")} aria-label="Halaman berikutnya">
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(itemBase, "border border-line bg-cream text-muted opacity-60")} aria-hidden="true">
          <ChevronRight className="size-5" />
        </span>
      )}
    </nav>
  );
}
