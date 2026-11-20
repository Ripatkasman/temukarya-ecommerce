import { validateStore, validateProduct } from "@/lib/validation";
import { saveImage, removeUploadedFile } from "@/lib/uploads";
import * as seller from "@/lib/repositories/seller";

/** Logika Seller. `me` = seller approved dari sesi; semua query dibatasi seller_id = me.id. */

export async function saveStore(me, fd) {
  const { values, errors } = validateStore(fd);
  const img = await saveImage(fd, "image");
  if (img.error) errors.image = img.error;
  if (Object.keys(errors).length) return { ok: false, status: 422, errors, values };

  const before = await seller.getStoreBySeller(me.id);
  if (!(await seller.updateStore(me.id, { ...values, imageUrl: img.url }))) {
    if (img.url) await removeUploadedFile(img.url);
    return { ok: false, status: 404, message: "Toko tidak ditemukan." };
  }
  if (img.url && before?.image_url) await removeUploadedFile(before.image_url);
  return { ok: true, message: "Informasi toko disimpan." };
}

/** `id` kosong = produk baru (gambar wajib). Gambar opsional saat mengubah. */
export async function saveProduct(me, id, fd) {
  const { values, parsed, errors } = validateProduct(fd);
  if (parsed.categoryId && !(await seller.categoryExists(parsed.categoryId))) errors.categoryId = "Kategori tidak ditemukan.";
  const img = await saveImage(fd, "image", { required: !id });
  if (img.error) errors.image = img.error;
  if (Object.keys(errors).length) {
    if (img.url) await removeUploadedFile(img.url); // jangan menyisakan file yatim
    return { ok: false, status: 422, errors, values };
  }

  const data = { ...parsed, name: values.name, description: values.description, isActive: values.isActive, imageUrl: img.url };
  if (!id) {
    const newId = await seller.createProduct(me.id, data);
    return { ok: true, status: 201, message: "Produk ditambahkan.", data: { id: newId }, redirectTo: "/seller/products" };
  }
  const { updated, oldImage } = await seller.updateProduct(me.id, id, data);
  if (!updated) {
    if (img.url) await removeUploadedFile(img.url);
    return { ok: false, status: 404, message: "Produk tidak ditemukan." };
  }
  if (img.url && oldImage) await removeUploadedFile(oldImage);
  return { ok: true, message: "Produk diperbarui.", data: { id }, redirectTo: "/seller/products" };
}

export async function deleteProduct(me, id) {
  const image = await seller.deleteProduct(me.id, id);
  if (image === null) return { ok: false, status: 404, message: "Produk tidak ditemukan." };
  await removeUploadedFile(image);
  return { ok: true, message: "Produk dihapus." };
}

const LABELS = { processing: "Diproses", shipped: "Dikirim", completed: "Selesai", cancelled: "Dibatalkan" };

export async function updateOrderStatus(me, id, status) {
  if (!LABELS[status]) return { ok: false, status: 422, message: "Status tidak valid." };
  const r = await seller.updateStoreOrderStatus(me.id, id, status);
  if (r.status === "not_found") return { ok: false, status: 404, message: "Pesanan tidak ditemukan." };
  if (r.status === "invalid") return { ok: false, status: 409, message: "Perubahan status ini tidak diizinkan dari status saat ini." };
  return { ok: true, message: `Status pesanan diubah menjadi ${LABELS[status]}.` };
}
