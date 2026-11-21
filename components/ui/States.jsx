import { Inbox, TriangleAlert, Loader2 } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/cn";

/** Keadaan kosong: selalu beri arahan, bukan halaman kosong. */
export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, actionHref, className, as: Heading = "h2" }) {
  return (
    <div className={cn("flex flex-col items-center rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center", className)}>
      <div className="flex size-14 items-center justify-center rounded-full bg-cream text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <Heading className="mt-4 text-card-title">{title}</Heading>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-strong">{description}</p>}
      {actionLabel && actionHref && (
        <Button href={actionHref} className="mt-5">{actionLabel}</Button>
      )}
    </div>
  );
}

/** Keadaan error: jelaskan apa yang salah dan beri jalan keluar (coba lagi). */
export function ErrorState({ title = "Terjadi kesalahan", description = "Data tidak dapat dimuat. Coba lagi beberapa saat.", onRetry, className, as: Heading = "h2" }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center rounded-card border border-error/30 bg-error-soft px-6 py-12 text-center", className)}>
      <TriangleAlert className="size-8 text-error-strong" aria-hidden="true" />
      <Heading className="mt-3 text-card-title text-error-strong">{title}</Heading>
      <p className="mt-1 max-w-sm text-sm text-error-strong">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-5">Coba lagi</Button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Memuat…", className }) {
  return (
    <div role="status" className={cn("flex items-center justify-center gap-3 py-12 text-muted-strong", className)}>
      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Kerangka kartu produk untuk loading.jsx */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card border border-line bg-surface" aria-hidden="true">
      <div className="aspect-square bg-cream" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-cream" />
        <div className="h-4 w-1/3 rounded bg-cream" />
        <div className="h-3 w-1/2 rounded bg-cream" />
      </div>
    </div>
  );
}
