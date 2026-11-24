import { ShoppingCart, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import AddToCartForm from "./AddToCartForm";
import { loginPathWithNext } from "@/lib/auth";

/**
 * Menentukan tampilan tombol aksi pembelian menurut viewer (Server Component).
 *  - Guest   : tombol yang mengarah ke halaman login (tujuan kembali ke produk ini).
 *  - Buyer   : form Tambah ke Keranjang (Oranye) & Beli Langsung (Hijau).
 *  - Lainnya : keterangan bahwa pembelian hanya untuk pembeli.
 */
export default function AddToCart({ product, viewer, withQuantity = false }) {
  if (product.stock <= 0) {
    return (
      <Button disabled size={withQuantity ? "lg" : "sm"} className={withQuantity ? "" : "w-full"}>
        Stok habis
      </Button>
    );
  }

  if (!viewer) {
    return (
      <div className="flex flex-wrap items-center gap-3">

        {withQuantity && (
          <Button
            href={loginPathWithNext(`/buyer/cart?direct=${product.id}`)}
            size="lg"
            variant="primary"
          >
            Beli Sekarang
          </Button>
        )}
        
       <Button
          href={loginPathWithNext(`/products/${product.id}`)}
          size={withQuantity ? "lg" : "sm"}
          className="!border-amber-600 !bg-amber-600 !text-white hover:!bg-amber-700"
        >
          <ShoppingCart className={withQuantity ? "size-5" : "size-4"} aria-hidden="true" />
          Tambah ke Keranjang
        </Button>

        
      </div>
    );
  }

  if (viewer.role === "buyer") {
    return <AddToCartForm productId={product.id} stock={product.stock} withQuantity={withQuantity} />;
  }

  if (withQuantity) {
    return (
      <p className="rounded-btn bg-cream px-4 py-3 text-sm text-muted-strong">
        Anda masuk sebagai {viewer.role === "admin" ? "admin" : "penjual"}. Pembelian hanya tersedia untuk akun pembeli.
      </p>
    );
  }

  return null;
}