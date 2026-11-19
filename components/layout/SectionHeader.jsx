import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Judul bagian di halaman, dengan tautan "lihat semua" opsional. */
export default function SectionHeader({ id, title, description, href, linkLabel = "Lihat semua" }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="max-w-xl">
        <h2 id={id} className="text-section-title">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-strong">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
