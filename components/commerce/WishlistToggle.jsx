import Link from "next/link";
import { Heart } from "lucide-react";
import WishlistButton from "./WishlistButton";
import { loginPathWithNext } from "@/lib/auth";
import { cn } from "@/lib/cn";

/**
 * Menentukan tampilan tombol favorit menurut viewer (Server Component):
 *  - Guest   : ikon hati yang mengarah ke login (tujuan kembali ke produk ini).
 *  - Buyer   : tombol yang benar-benar menyimpan ke database.
 *  - Lainnya : tidak ditampilkan.
 * Pengecekan role diulang di Server Action; ini hanya untuk tampilan.
 */
export default function WishlistToggle({ product, viewer, wishlisted = false, withLabel = false, className }) {
  if (!viewer) {
    return (
      <Link
        href={loginPathWithNext(`/products/${product.id}`)}
        aria-label={`Masuk untuk menyimpan ${product.name} ke favorit`}
        className={cn(
          "flex items-center justify-center gap-2 rounded-full bg-surface/95 text-charcoal shadow-sm ring-1 ring-line hover:text-error",
          withLabel ? "min-h-11 px-4 text-sm font-semibold" : "size-11",
          className
        )}
      >
        <Heart className="size-5" aria-hidden="true" />
        {withLabel && <span>Simpan ke favorit</span>}
      </Link>
    );
  }
  if (viewer.role !== "buyer") return null;
  return <WishlistButton productId={product.id} productName={product.name} initial={wishlisted} withLabel={withLabel} className={className} />;
}
