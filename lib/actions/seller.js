"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseId, text } from "@/lib/validation";
import * as svc from "@/lib/services/seller";

/** Server Actions Seller: requireRole(["seller"]) hanya meloloskan seller approved; logika di lib/services/seller.js. */

const bad = (message) => ({ ok: false, status: 422, message });

export async function saveStoreAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const r = await svc.saveStore(me, fd);
  if (r.ok) { revalidatePath("/seller/store"); revalidatePath("/products"); }
  return r;
}

/** Membuat produk (tanpa `id`) atau mengubah produk milik sendiri (dengan `id`). */
export async function saveProductAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const idRaw = text(fd, "id");
  const id = idRaw ? parseId(idRaw) : null;
  if (idRaw && !id) return bad("Produk tidak valid.");
  const r = await svc.saveProduct(me, id, fd);
  if (r.ok) {
    revalidatePath("/seller/products");
    revalidatePath("/products");
    if (id) revalidatePath(`/products/${id}`);
  }
  return r;
}

export async function deleteProductAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Produk tidak valid.");
  const r = await svc.deleteProduct(me, id);
  if (r.ok) { revalidatePath("/seller/products"); revalidatePath("/products"); }
  return r;
}

export async function updateOrderStatusAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Permintaan tidak valid.");
  const r = await svc.updateOrderStatus(me, id, text(fd, "status"));
  if (r.ok) { revalidatePath("/seller/orders"); revalidatePath("/seller"); }
  return r;
}
