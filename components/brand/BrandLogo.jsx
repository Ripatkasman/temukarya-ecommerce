import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Logo resmi TemuKarya.
 * Simbol: dua tangan berjabat di tengah = kolaborasi & kepercayaan antara kreator/penjual dan pembeli.
 */
export function LogoMark({ className = "size-9", title, outlined = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        rx="21"
        fill="var(--color-cream, #F5F3EE)"
        stroke={outlined ? "var(--color-cream, #F5F3EE)" : "var(--color-line, #E5E0D5)"}
        strokeOpacity={outlined ? "0.6" : "0.8"}
        strokeWidth="3"
      />
      {/* Tangan Kiri (Primary) */}
      <path
        d="M10 24 C18 30, 24 30, 31 27.5 C36 25.5, 42 26, 48 29.5 L31 46.5 C28.5 49, 28.5 52.5, 31 55 C34.5 58.5, 40.5 58.5, 44 55 L55.5 43.5 C57 42, 59.5 42, 61 43.5 L70 52.5 C72.2 54.7, 72.2 58.3, 70 60.5 C67.8 62.7, 64.2 62.7, 62 60.5 L55 53.5 L52 56.5 L61.5 66 C63.7 68.2, 63.7 71.8, 61.5 74 C59.3 76.2, 55.7 76.2, 53.5 74 L44.5 65 L41.5 68 L48.5 75 C50.7 77.2, 50.7 80.8, 48.5 83 C46.3 85.2, 42.7 85.2, 40.5 83 L34.5 77 L27 77 C21 71, 10 59, 10 45 Z"
        fill="var(--color-primary, #174B3A)"
      />
      {/* Tangan Kanan (Accent) */}
      <path
        d="M90 24 C82 30, 76 30, 69 27.5 C62 25, 55 26, 49.5 31.5 L34.5 46.5 C32 49, 32 52.5, 34.5 55 C37 57.5, 41 57.5, 43.5 55 L54 44.5 C56.5 42, 60.5 42, 63 44.5 L72.5 54 C75.5 57, 75.5 62, 72.5 65 L56.5 77 L68 77 C77 69, 90 58, 90 45 Z"
        fill="var(--color-accent, #D98B56)"
      />
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