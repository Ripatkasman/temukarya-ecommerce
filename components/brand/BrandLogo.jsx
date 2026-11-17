import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * LOGO SEMENTARA (placeholder asli buatan sendiri).
 * Simbol: dua bentuk yang bertemu di tengah = penjual dan pembeli bertemu.
 * Ganti dengan aset final di: public/brand/logo-mark.svg dan komponen ini.
 */
export function LogoMark({ className = "size-9", title, outlined = false }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="9.5" fill="var(--color-primary)" stroke={outlined ? "var(--color-cream)" : "none"} strokeOpacity="0.55" strokeWidth="1.5" />
      <path d="M8 21a12 12 0 0 1 12-12v12H8Z" fill="var(--color-cream)" />
      <path d="M32 19a12 12 0 0 1-12 12V19h12Z" fill="var(--color-accent)" />
    </svg>
  );
}

export default function BrandLogo({
  href = "/",
  showWordmark = true,
  className,
  markClassName = "size-9",
  light = false,
}) {
  const content = (
    <>
      <LogoMark className={markClassName} outlined={light} />
      {showWordmark && (
        <span
          className={cn(
            "font-heading text-xl font-extrabold tracking-tight",
            light ? "text-cream" : "text-primary"
          )}
        >
          TemuKarya
        </span>
      )}
    </>
  );
  const classes = cn("inline-flex items-center gap-2.5", className);
  if (!href) return <span className={classes}>{content}</span>;
  return (
    <Link href={href} className={classes} aria-label="TemuKarya, ke beranda">
      {content}
    </Link>
  );
}
