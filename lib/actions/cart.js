"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, loginPathWithNext } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { addToCart } from "@/lib/repositories/cart";

/**
 * Server Action Tambah ke Keranjang.
 * - Guest diarahkan ke login (tujuan dikembalikan ke halaman produk).
 * - Hanya role buyer yang boleh. Harga tidak pernah diterima dari client.
 * @param {{ ok?: boolean, message?: string }} _prev
 * @param {FormData} formData berisi productId, quantity
 */
export async function addToCartAction(_prev, formData) {
  const productId = parseId(formData.get("productId"));
  if (!productId) return { ok: false, message: "Produk tidak valid." };

  const user = await getCurrentUser();
  if (!user) redirect(loginPathWithNext(`/products/${productId}`));
  if (user.role !== "buyer") {
    return { ok: false, message: "Hanya akun pembeli yang dapat menambahkan produk ke keranjang." };
  }

  const quantity = Number(formData.get("quantity") ?? 1);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return { ok: false, message: "Jumlah harus berupa angka bulat minimal 1." };
  }

  const result = await addToCart(user.id, productId, quantity);
  if (result.status === "unavailable") return { ok: false, message: "Produk ini sedang tidak tersedia." };
  if (result.status === "exceeds_stock") {
    return { ok: false, message: `Jumlah melebihi stok. Stok tersedia: ${result.stock}.` };
  }
  return { ok: true, message: "Produk ditambahkan ke keranjang." };
}
