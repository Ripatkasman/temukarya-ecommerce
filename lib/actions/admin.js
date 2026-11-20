"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseId, text } from "@/lib/validation";
import * as svc from "@/lib/services/admin";

/** Server Actions Admin: requireRole lebih dulu, lalu delegasi ke lib/services/admin.js. */

const bad = (message) => ({ ok: false, status: 422, message });

export async function updateUserAction(_prev, fd) {
  await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Pengguna tidak valid.");
  const r = await svc.updateUser(id, fd);
  if (r.ok) revalidatePath("/admin/users");
  return r;
}

export async function deleteUserAction(_prev, fd) {
  const me = await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Pengguna tidak valid.");
  const r = await svc.deleteUser(me, id);
  if (r.ok) { revalidatePath("/admin/users"); revalidatePath("/admin"); }
  return r;
}

export async function decideSellerAction(_prev, fd) {
  const me = await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Permintaan tidak valid.");
  const r = await svc.decideSeller(me, id, text(fd, "decision"));
  if (r.ok) { revalidatePath("/admin/sellers"); revalidatePath("/admin"); }
  return r;
}

export async function deleteProductAsAdminAction(_prev, fd) {
  await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Produk tidak valid.");
  const r = await svc.deleteProduct(id);
  if (r.ok) { revalidatePath("/admin/products"); revalidatePath("/products"); }
  return r;
}

/** Membuat kategori baru (tanpa `id`) atau mengubah kategori (dengan `id`). */
export async function saveCategoryAction(_prev, fd) {
  await requireRole(["admin"]);
  const idRaw = text(fd, "id");
  const id = idRaw ? parseId(idRaw) : null;
  if (idRaw && !id) return bad("Kategori tidak valid.");
  const r = await svc.saveCategory(id, fd);
  if (r.ok) revalidatePath("/admin/categories");
  return r;
}

export async function deleteCategoryAction(_prev, fd) {
  await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return bad("Kategori tidak valid.");
  const r = await svc.deleteCategory(id);
  if (r.ok) revalidatePath("/admin/categories");
  return r;
}
