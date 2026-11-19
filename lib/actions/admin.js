"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseId, text, validateUserInfo, validateCategory } from "@/lib/validation";
import { removeUploadedFile } from "@/lib/uploads";
import * as admin from "@/lib/repositories/admin";

/**
 * Server Actions Admin. Setiap action memanggil requireRole(["admin"]) lebih dulu,
 * jadi menyembunyikan tombol di UI bukan satu-satunya penjagaan.
 * Hasil: { ok, message, errors? } untuk ditampilkan sebagai toast / pesan field.
 */

export async function updateUserAction(_prev, fd) {
  await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return { ok: false, message: "Pengguna tidak valid." };
  const { values, errors } = validateUserInfo(fd);
  if (Object.keys(errors).length) return { ok: false, errors, values };
  try {
    const done = await admin.updateUserInfo(id, values);
    if (!done) return { ok: false, message: "Pengguna tidak ditemukan." };
  } catch (err) {
    if (err?.code === "23505") return { ok: false, errors: { email: "Email ini sudah dipakai pengguna lain." }, values };
    throw err;
  }
  revalidatePath("/admin/users");
  return { ok: true, message: "Data pengguna disimpan." };
}

export async function deleteUserAction(_prev, fd) {
  const me = await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return { ok: false, message: "Pengguna tidak valid." };
  if (id === me.id) return { ok: false, message: "Anda tidak dapat menghapus akun Anda sendiri." };
  const done = await admin.deleteUser(id, me.id);
  if (!done) return { ok: false, message: "Pengguna tidak ditemukan." };
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true, message: "Pengguna dihapus." };
}

export async function decideSellerAction(_prev, fd) {
  const me = await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  const decision = text(fd, "decision") === "approve" ? "approved" : text(fd, "decision") === "reject" ? "rejected" : null;
  if (!id || !decision) return { ok: false, message: "Permintaan tidak valid." };
  const done = await admin.decideSeller(id, me.id, decision);
  if (!done) return { ok: false, message: "Seller tidak ditemukan atau sudah diputuskan." };
  revalidatePath("/admin/sellers");
  revalidatePath("/admin");
  return { ok: true, message: decision === "approved" ? "Seller disetujui." : "Seller ditolak." };
}

export async function deleteProductAsAdminAction(_prev, fd) {
  await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return { ok: false, message: "Produk tidak valid." };
  const image = await admin.deleteProductAsAdmin(id);
  if (image === null) return { ok: false, message: "Produk tidak ditemukan." };
  await removeUploadedFile(image);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { ok: true, message: "Produk dihapus." };
}

/** Membuat kategori baru (tanpa `id`) atau mengubah kategori (dengan `id`). */
export async function saveCategoryAction(_prev, fd) {
  await requireRole(["admin"]);
  const idRaw = text(fd, "id");
  const id = idRaw ? parseId(idRaw) : null;
  if (idRaw && !id) return { ok: false, message: "Kategori tidak valid." };
  const { values, errors } = validateCategory(fd);
  if (Object.keys(errors).length) return { ok: false, errors, values };
  try {
    if (id) {
      if (!(await admin.updateCategory(id, values))) return { ok: false, message: "Kategori tidak ditemukan." };
    } else {
      await admin.createCategory(values);
    }
  } catch (err) {
    if (err?.code === "23505") return { ok: false, errors: { name: "Nama kategori sudah ada." }, values };
    throw err;
  }
  revalidatePath("/admin/categories");
  return { ok: true, message: id ? "Kategori diperbarui." : "Kategori ditambahkan." };
}

export async function deleteCategoryAction(_prev, fd) {
  await requireRole(["admin"]);
  const id = parseId(text(fd, "id"));
  if (!id) return { ok: false, message: "Kategori tidak valid." };
  const result = await admin.deleteCategory(id);
  if (result === "in_use") return { ok: false, message: "Kategori masih dipakai produk. Pindahkan atau hapus produknya lebih dulu." };
  if (result === "not_found") return { ok: false, message: "Kategori tidak ditemukan." };
  revalidatePath("/admin/categories");
  return { ok: true, message: "Kategori dihapus." };
}
