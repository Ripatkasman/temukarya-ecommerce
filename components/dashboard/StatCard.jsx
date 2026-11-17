import { cn } from "@/lib/cn";

/** Kartu angka ringkas untuk overview dashboard. Hanya tampilkan angka yang berguna. */
export default function StatCard({ label, value, icon: Icon, hint, tone = "brand" }) {
  const tones = {
    brand: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent-strong",
    warning: "bg-warning-soft text-warning-strong",
    success: "bg-success-soft text-success-strong",
  };
  return (
    <div className="flex flex-col items-start gap-3 rounded-card border border-line bg-surface p-4 sm:flex-row sm:gap-4 sm:p-5">
      {Icon && (
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-btn", tones[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-muted-strong">{label}</p>
        <p className="font-heading text-2xl font-bold text-charcoal">{value}</p>
        {hint && <p className="mt-0.5 text-caption text-muted-strong">{hint}</p>}
      </div>
    </div>
  );
}
