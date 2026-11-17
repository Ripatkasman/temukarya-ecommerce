import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover",
  // Teks charcoal di atas terakota (putih hanya 2.7:1, tidak lolos kontras)
  accent: "bg-accent text-charcoal hover:brightness-95 active:brightness-90",
  secondary: "bg-cream text-primary hover:bg-primary-soft",
  outline: "border border-line bg-surface text-charcoal hover:border-primary hover:text-primary",
  ghost: "text-charcoal hover:bg-cream",
  danger: "bg-error text-white hover:brightness-95 active:brightness-90",
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

/**
 * Tombol. Jika `href` diberikan, dirender sebagai link (next/link).
 * `loading` menampilkan spinner dan menonaktifkan tombol.
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  href,
  className,
  children,
  type = "button",
  ...props
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
