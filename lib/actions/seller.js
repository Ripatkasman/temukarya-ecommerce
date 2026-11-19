"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseId, text, validateStore, validateProduct } from "@/lib/validation";
import { saveImage, removeUploadedFile } from "@/lib/uploads";
import * as seller from "@/lib/repositories/seller";

/**
 * Server Actions Seller. requireRole(["seller"]) hanya meloloskan seller berstatus approved,
 * dan semua query memakai seller_id dari sesi (bukan dari form).
 */

export async function saveStoreAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const { values, errors } = validateStore(fd);
  const img = await saveImage(fd, "image");
  if (img.error) errors.image = img.error;
  if (Object.keys(errors).length) return { ok: false, errors, values };

  const before = await seller.getStoreBySeller(me.id);
  const done = await seller.updateStore(me.id, { ...values, imageUrl: img.url });
  if (!done) return { ok: false, message: "Toko tidak ditemukan." };
  if (img.url && before?.image_url) await removeUploadedFile(before.image_url);
  revalidatePath("/seller/store");
  revalidatePath("/products");
  return { ok: true, message: "Informasi toko disimpan." };
}

/** Membuat produk (tanpa `id`) atau mengubah produk milik sendiri (dengan `id`). */
export async function saveProductAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const idRaw = text(fd, "id");
  const id = idRaw ? parseId(idRaw) : null;
  if (idRaw && !id) return { ok: false, message: "Produk tidak valid." };

  const { values, parsed, errors } = validateProduct(fd);
  if (parsed.categoryId && !(await seller.categoryExists(parsed.categoryId))) errors.categoryId = "Kategori tidak ditemukan.";
  const img = await saveImage(fd, "image", { required: !id });
  if (img.error) errors.image = img.error;
  if (Object.keys(errors).length) {
    if (img.url) await removeUploadedFile(img.url); // jangan menyisakan file yatim
    return { ok: false, errors, values };
  }

  const data = { ...parsed, name: values.name, description: values.description, isActive: values.isActive, imageUrl: img.url };
  if (!id) {
    await seller.createProduct(me.id, data);
    revalidatePath("/seller/products");
    revalidatePath("/products");
    return { ok: true, message: "Produk ditambahkan.", redirectTo: "/seller/products" };
  }
  const { updated, oldImage } = await seller.updateProduct(me.id, id, data);
  if (!updated) {
    if (img.url) await removeUploadedFile(img.url);
    return { ok: false, message: "Produk tidak ditemukan." };
  }
  if (img.url && oldImage) await removeUploadedFile(oldImage);
  revalidatePath("/seller/products");
  revalidatePath(`/products/${id}`);
  return { ok: true, message: "Produk diperbarui.", redirectTo: "/seller/products" };
}

export async function deleteProductAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const id = parseId(text(fd, "id"));
  if (!id) return { ok: false, message: "Produk tidak valid." };
  const image = await seller.deleteProduct(me.id, id);
  if (image === null) return { ok: false, message: "Produk tidak ditemukan." };
  await removeUploadedFile(image);
  revalidatePath("/seller/products");
  revalidatePath("/products");
  return { ok: true, message: "Produk dihapus." };
}

const LABELS = { processing: "Diproses", shipped: "Dikirim", completed: "Selesai", cancelled: "Dibatalkan" };

export async function updateOrderStatusAction(_prev, fd) {
  const me = await requireRole(["seller"]);
  const id = parseId(text(fd, "id"));
  const next = text(fd, "status");
  if (!id || !LABELS[next]) return { ok: false, message: "Permintaan tidak valid." };
  const r = await seller.updateStoreOrderStatus(me.id, id, next);
  if (r.status === "not_found") return { ok: false, message: "Pesanan tidak ditemukan." };
  if (r.status === "invalid") return { ok: false, message: "Perubahan status ini tidak diizinkan dari status saat ini." };
  revalidatePath("/seller/orders");
  revalidatePath("/seller");
  return { ok: true, message: `Status pesanan diubah menjadi ${LABELS[next]}.` };
}
