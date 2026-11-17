import { LogoMark } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/cn";

/**
 * Gambar produk/toko dengan rasio konsisten. Jika belum ada gambar,
 * tampilkan placeholder lokal (tanpa hotlink). `alt` wajib bermakna.
 */
export default function ProductImage({ src, alt, className, ratio = "aspect-square" }) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} (belum ada gambar)` : "Belum ada gambar"}
        className={cn("flex items-center justify-center bg-cream", ratio, className)}
      >
        <LogoMark className="size-12 opacity-40" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={cn("w-full object-cover", ratio, className)} />;
}
