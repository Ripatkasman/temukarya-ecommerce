"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, loginPathWithNext } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import * as svc from "@/lib/services/buyer";

/**
 * Server Action Tambah ke Keranjang.
 * Guest diarahkan ke login (tujuan dikembalikan ke halaman produk). Hanya role buyer yang boleh.
 */
export async function addToCartAction(_prev, formData) {
  const productId = parseId(formData.get("productId"));
  if (!productId) return { ok: false, message: "Produk tidak valid." };

  const user = await getCurrentUser();
  if (!user) redirect(loginPathWithNext(`/products/${productId}`));
  if (user.role !== "buyer") {
    return { ok: false, message: "Hanya akun pembeli yang dapat menambahkan produk ke keranjang." };
  }
  const r = await svc.addToCart(user, productId, formData.get("quantity") ?? 1);
  if (r.ok) revalidatePath("/", "layout"); // perbarui jumlah keranjang di navbar
  return r;
}
