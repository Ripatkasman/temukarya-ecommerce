import { validateCategory } from "@/lib/validation";
import { removeUploadedFile } from "@/lib/uploads";
import { createNotification } from "@/lib/repositories/notifications";
import * as admin from "@/lib/repositories/admin";

/** Logika Admin (dipanggil setelah role admin diverifikasi oleh adapter). */

export async function deleteUser(me, id) {
  const r = await admin.deleteUser(id, me.id);
  if (r === "self") return { ok: false, status: 403, message: "Anda tidak dapat menghapus akun Anda sendiri." };
  if (r === "not_found") return { ok: false, status: 404, message: "Pengguna tidak ditemukan." };
  if (r === "not_requested") {
    return { ok: false, status: 409, message: "Pengguna ini belum mengajukan permintaan penghapusan akun." };
  }
  if (r === "active_orders") {
    return { ok: false, status: 409, message: "Pengguna masih memiliki pesanan yang berjalan. Selesaikan atau batalkan pesanan itu lebih dulu." };
  }
  return { ok: true, message: "Permintaan penghapusan disetujui dan akun telah dihapus." };
}

/** @param {"approve"|"reject"} decision */
export async function decideSeller(me, id, decision, reason = "") {
  const next = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : null;
  if (!next) return { ok: false, status: 422, message: "Keputusan harus 'approve' atau 'reject'." };

  const cleanReason = reason?.trim() ?? "";
  if (next === "rejected" && cleanReason.length < 5) {
    return {
      ok: false,
      status: 422,
      errors: { reason: "Alasan penolakan wajib diisi minimal 5 karakter." },
      message: "Alasan penolakan wajib diisi agar calon penjual mengetahui kekurangannya.",
    };
  }

  if (!(await admin.decideSeller(id, me.id, next, cleanReason))) {
    return { ok: false, status: 409, message: "Seller tidak ditemukan atau sudah diputuskan." };
  }
  return { ok: true, message: next === "approved" ? "Seller disetujui." : "Seller ditolak dengan alasan." };
}

export async function deleteProduct(id, reason = "") {
  const cleanReason = reason?.trim() ?? "";
  if (cleanReason.length < 5) {
    return {
      ok: false,
      status: 422,
      errors: { reason: "Alasan penghapusan wajib diisi minimal 5 karakter." },
      message: "Alasan penghapusan produk wajib diisi agar penjual mengetahui pelanggarannya.",
    };
  }

  const deleted = await admin.deleteProductAsAdmin(id);
  if (!deleted) return { ok: false, status: 404, message: "Produk tidak ditemukan." };

  await removeUploadedFile(deleted.image_url);

  await createNotification({
    userId: deleted.seller_id,
    type: "product_removed",
    title: `Produk "${deleted.name}" Dihapus oleh Admin`,
    message: `Produk Anda "${deleted.name}" telah dihapus dari katalog karena melanggar ketentuan platform.\n\nAlasan Admin: ${cleanReason}`,
  });

  return { ok: true, message: "Produk dihapus dan alasan telah dikirim ke notifikasi penjual." };
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

export async function deleteReview(id) {
  const ok = await admin.deleteReviewAsAdmin(id);
  if (!ok) return { ok: false, status: 404, message: "Ulasan tidak ditemukan." };
  return { ok: true, message: "Ulasan berhasil dihapus." };
}

export async function toggleUserStatus(me, id, nextActive) {
  const r = await admin.setUserActiveStatus(id, me.id, nextActive);
  if (r === "self") return { ok: false, status: 403, message: "Anda tidak dapat menonaktifkan akun Anda sendiri." };
  if (r === "not_found") return { ok: false, status: 404, message: "Pengguna tidak ditemukan atau merupakan akun admin." };
  return {
    ok: true,
    message: nextActive ? "Akun pengguna diaktifkan kembali." : "Akun pengguna berhasil dinonaktifkan.",
  };
}