import { cn } from "@/lib/cn";

const tones = {
  neutral: "bg-cream text-charcoal",
  brand: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent-strong",
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  error: "bg-error-soft text-error-strong",
};

/** Badge status. Selalu berisi teks (dan ikon opsional), tidak mengandalkan warna saja. */
export default function Badge({ tone = "neutral", icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold",
        tones[tone],
        className
      )}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}
