import { validateUserInfo, validateCategory } from "@/lib/validation";
import { removeUploadedFile } from "@/lib/uploads";
import * as admin from "@/lib/repositories/admin";

/** Logika Admin (dipanggil setelah role admin diverifikasi oleh adapter). */

export async function updateUser(id, fd) {
  const { values, errors } = validateUserInfo(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors, values };
  try {
    if (!(await admin.updateUserInfo(id, values))) return { ok: false, status: 404, message: "Pengguna tidak ditemukan." };
  } catch (err) {
    if (err?.code === "23505") return { ok: false, status: 409, errors: { email: "Email ini sudah dipakai pengguna lain." }, values };
    throw err;
  }
  return { ok: true, message: "Data pengguna disimpan." };
}

export async function deleteUser(me, id) {
  if (id === me.id) return { ok: false, status: 403, message: "Anda tidak dapat menghapus akun Anda sendiri." };
  if (!(await admin.deleteUser(id, me.id))) return { ok: false, status: 404, message: "Pengguna tidak ditemukan." };
  return { ok: true, message: "Pengguna dihapus." };
}

/** @param {"approve"|"reject"} decision */
export async function decideSeller(me, id, decision) {
  const next = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : null;
  if (!next) return { ok: false, status: 422, message: "Keputusan harus 'approve' atau 'reject'." };
  if (!(await admin.decideSeller(id, me.id, next))) {
    return { ok: false, status: 409, message: "Seller tidak ditemukan atau sudah diputuskan." };
  }
  return { ok: true, message: next === "approved" ? "Seller disetujui." : "Seller ditolak." };
}

export async function deleteProduct(id) {
  const image = await admin.deleteProductAsAdmin(id);
  if (image === null) return { ok: false, status: 404, message: "Produk tidak ditemukan." };
  await removeUploadedFile(image);
  return { ok: true, message: "Produk dihapus." };
}

/** `id` kosong = buat baru. */
export async function saveCategory(id, fd) {
  const { values, errors } = validateCategory(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors, values };
  try {
    if (id) {
      if (!(await admin.updateCategory(id, values))) return { ok: false, status: 404, message: "Kategori tidak ditemukan." };
    } else {
      await admin.createCategory(values);
    }
  } catch (err) {
    if (err?.code === "23505") return { ok: false, status: 409, errors: { name: "Nama kategori sudah ada." }, values };
    throw err;
  }
  return { ok: true, status: id ? 200 : 201, message: id ? "Kategori diperbarui." : "Kategori ditambahkan." };
}

export async function deleteCategory(id) {
  const r = await admin.deleteCategory(id);
  if (r === "in_use") return { ok: false, status: 409, message: "Kategori masih dipakai produk. Pindahkan atau hapus produknya lebih dulu." };
  if (r === "not_found") return { ok: false, status: 404, message: "Kategori tidak ditemukan." };
  return { ok: true, message: "Kategori dihapus." };
}
