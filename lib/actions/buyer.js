"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import {
  parseId, parseQuantity, text, validateProfile, validatePasswordChange, validateCheckout, validateReview,
} from "@/lib/validation";
import * as buyer from "@/lib/repositories/buyer";

/** Server Actions Buyer. Semua memakai buyer_id dari sesi. */

export async function updateProfileAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const { values, errors } = validateProfile(fd);
  if (Object.keys(errors).length) return { ok: false, errors, values };
  await buyer.updateProfile(me.id, values);
  revalidatePath("/buyer/profile");
  return { ok: true, message: "Profil disimpan." };
}

export async function changePasswordAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const { current, next, errors } = validatePasswordChange(fd);
  if (Object.keys(errors).length) return { ok: false, errors };
  const hash = await buyer.getPasswordHash(me.id);
  if (!hash || !(await bcrypt.compare(current, hash))) {
    return { ok: false, errors: { currentPassword: "Kata sandi saat ini salah." } };
  }
  await buyer.setPasswordHash(me.id, await bcrypt.hash(next, 10));
  return { ok: true, message: "Kata sandi diperbarui." };
}

export async function setCartQuantityAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const itemId = parseId(text(fd, "itemId"));
  const quantity = parseQuantity(text(fd, "quantity"));
  if (!itemId || !quantity) return { ok: false, message: "Jumlah harus berupa angka bulat minimal 1." };
  const r = await buyer.setCartQuantity(me.id, itemId, quantity);
  if (r === "not_found") return { ok: false, message: "Item tidak ditemukan di keranjang." };
  if (r === "exceeds_stock") return { ok: false, message: "Jumlah melebihi stok yang tersedia." };
  revalidatePath("/buyer/cart");
  return { ok: true };
}

export async function removeCartItemAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const itemId = parseId(text(fd, "itemId"));
  if (!itemId) return { ok: false, message: "Item tidak valid." };
  const done = await buyer.removeCartItem(me.id, itemId);
  if (!done) return { ok: false, message: "Item tidak ditemukan di keranjang." };
  revalidatePath("/buyer/cart");
  return { ok: true, message: "Produk dihapus dari keranjang." };
}

export async function checkoutAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const { values, errors } = validateCheckout(fd);
  if (Object.keys(errors).length) return { ok: false, errors, values };
  let orderId;
  try {
    orderId = await buyer.checkout(me.id, values);
  } catch (err) {
    if (err instanceof buyer.CheckoutError) return { ok: false, message: err.message, values };
    console.error("checkoutAction gagal:", err);
    return { ok: false, message: "Checkout belum berhasil. Coba lagi beberapa saat.", values };
  }
  revalidatePath("/buyer", "layout");
  redirect(`/buyer/orders/${orderId}?baru=1`);
}

export async function submitReviewAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const itemId = parseId(text(fd, "orderItemId"));
  if (!itemId) return { ok: false, message: "Item tidak valid." };
  const { rating, comment, errors } = validateReview(fd);
  if (Object.keys(errors).length) return { ok: false, errors };
  const r = await buyer.createReview(me.id, itemId, rating, comment);
  if (r === "not_eligible") return { ok: false, message: "Ulasan hanya bisa diberikan untuk produk dari pesanan yang sudah selesai." };
  if (r === "duplicate") return { ok: false, message: "Produk ini sudah Anda ulas." };
  revalidatePath("/buyer/orders", "layout");
  revalidatePath("/products", "layout");
  return { ok: true, message: "Ulasan terkirim. Terima kasih!" };
}
