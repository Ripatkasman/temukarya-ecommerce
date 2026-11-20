import bcrypt from "bcryptjs";
import {
  parseQuantity, validateProfile, validatePasswordChange, validateCheckout, validateReview,
} from "@/lib/validation";
import * as buyer from "@/lib/repositories/buyer";
import { addToCart as addToCartRepo } from "@/lib/repositories/cart";

/** Logika Buyer. `me` = buyer dari sesi; semua query dibatasi buyer_id = me.id. */

export async function updateProfile(me, fd) {
  const { values, errors } = validateProfile(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors, values };
  await buyer.updateProfile(me.id, values);
  return { ok: true, message: "Profil disimpan." };
}

export async function changePassword(me, fd) {
  const { current, next, errors } = validatePasswordChange(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors };
  const hash = await buyer.getPasswordHash(me.id);
  if (!hash || !(await bcrypt.compare(current, hash))) {
    return { ok: false, status: 422, errors: { currentPassword: "Kata sandi saat ini salah." } };
  }
  await buyer.setPasswordHash(me.id, await bcrypt.hash(next, 10));
  return { ok: true, message: "Kata sandi diperbarui." };
}

export async function addToCart(me, productId, quantityRaw) {
  const quantity = parseQuantity(String(quantityRaw ?? "1"));
  if (!quantity) return { ok: false, status: 422, message: "Jumlah harus berupa angka bulat minimal 1." };
  const r = await addToCartRepo(me.id, productId, quantity);
  if (r.status === "unavailable") return { ok: false, status: 409, message: "Produk ini sedang tidak tersedia." };
  if (r.status === "exceeds_stock") return { ok: false, status: 409, message: `Jumlah melebihi stok. Stok tersedia: ${r.stock}.` };
  return { ok: true, status: 201, message: "Produk ditambahkan ke keranjang.", data: { quantity: r.quantity } };
}

export async function setCartQuantity(me, itemId, quantityRaw) {
  const quantity = parseQuantity(String(quantityRaw ?? ""));
  if (!quantity) return { ok: false, status: 422, message: "Jumlah harus berupa angka bulat minimal 1." };
  const r = await buyer.setCartQuantity(me.id, itemId, quantity);
  if (r === "not_found") return { ok: false, status: 404, message: "Item tidak ditemukan di keranjang." };
  if (r === "exceeds_stock") return { ok: false, status: 409, message: "Jumlah melebihi stok yang tersedia." };
  return { ok: true };
}

export async function removeCartItem(me, itemId) {
  if (!(await buyer.removeCartItem(me.id, itemId))) return { ok: false, status: 404, message: "Item tidak ditemukan di keranjang." };
  return { ok: true, message: "Produk dihapus dari keranjang." };
}

/** Checkout atomik dari keranjang di database. @returns {{ ok: true, data: { orderId: string } }} */
export async function checkout(me, fd) {
  const { values, errors } = validateCheckout(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors, values };
  try {
    const orderId = await buyer.checkout(me.id, values);
    return { ok: true, status: 201, message: "Pesanan dibuat.", data: { orderId } };
  } catch (err) {
    if (err instanceof buyer.CheckoutError) return { ok: false, status: 409, message: err.message, values };
    console.error("checkout gagal:", err);
    return { ok: false, status: 500, message: "Checkout belum berhasil. Coba lagi beberapa saat.", values };
  }
}

export async function submitReview(me, orderItemId, fd) {
  const { rating, comment, errors } = validateReview(fd);
  if (Object.keys(errors).length) return { ok: false, status: 422, errors };
  const r = await buyer.createReview(me.id, orderItemId, rating, comment);
  if (r === "not_eligible") return { ok: false, status: 403, message: "Ulasan hanya bisa diberikan untuk produk dari pesanan yang sudah selesai." };
  if (r === "duplicate") return { ok: false, status: 409, message: "Produk ini sudah Anda ulas." };
  return { ok: true, status: 201, message: "Ulasan terkirim. Terima kasih!" };
}
