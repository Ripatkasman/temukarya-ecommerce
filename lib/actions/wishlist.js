"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, loginPathWithNext } from "@/lib/auth";
import { parseId, text } from "@/lib/validation";
import * as svc from "@/lib/services/wishlist";

/**
 * Tombol hati. Guest diarahkan ke login (tujuan kembali ke produk); hanya buyer yang boleh memakai favorit.
 * Mengembalikan { ok, message, data: { wishlisted } } sesuai keadaan SETELAH aksi.
 */
export async function toggleWishlistAction(_prev, fd) {
  const productId = parseId(text(fd, "productId"));
  if (!productId) return { ok: false, message: "Produk tidak valid." };
  const user = await getCurrentUser();
  if (!user) redirect(loginPathWithNext(`/products/${productId}`));
  if (user.role !== "buyer") return { ok: false, message: "Favorit hanya tersedia untuk akun pembeli." };
  const r = await svc.toggle(user, productId);
  if (r.ok) revalidatePath("/buyer/wishlist");
  return r;
}
