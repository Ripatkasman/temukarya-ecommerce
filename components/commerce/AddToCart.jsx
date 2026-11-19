import { ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import AddToCartForm from "./AddToCartForm";
import { loginPathWithNext } from "@/lib/auth";

/**
 * Menentukan tampilan tombol Tambah ke Keranjang menurut viewer (Server Component).
 *  - Guest   : tombol yang mengarah ke halaman login (tujuan kembali ke produk ini).
 *  - Buyer   : form yang benar-benar menyimpan ke keranjang.
 *  - Lainnya : tidak ditampilkan di kartu; di halaman detail diberi keterangan.
 * Pengecekan role tetap diulang di Server Action, ini hanya untuk tampilan.
 */
export default function AddToCart({ product, viewer, withQuantity = false }) {
  if (product.stock <= 0) {
    return <Button disabled size={withQuantity ? "lg" : "sm"} className={withQuantity ? "" : "w-full"}>Stok habis</Button>;
  }
  if (!viewer) {
    return (
      <Button
        href={loginPathWithNext(`/products/${product.id}`)}
        size={withQuantity ? "lg" : "sm"}
        className={withQuantity ? "" : "w-full"}
      >
        <ShoppingCart className={withQuantity ? "size-5" : "size-4"} aria-hidden="true" />
        Tambah ke Keranjang
      </Button>
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
