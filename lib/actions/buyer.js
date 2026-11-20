"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseId, text } from "@/lib/validation";
import * as svc from "@/lib/services/buyer";

/** Server Actions Buyer: adapter tipis di atas lib/services/buyer.js. */

const bad = (message) => ({ ok: false, status: 422, message });

export async function updateProfileAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const r = await svc.updateProfile(me, fd);
  if (r.ok) revalidatePath("/buyer/profile");
  return r;
}

export async function changePasswordAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  return svc.changePassword(me, fd);
}

export async function setCartQuantityAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const itemId = parseId(text(fd, "itemId"));
  if (!itemId) return bad("Item tidak valid.");
  const r = await svc.setCartQuantity(me, itemId, text(fd, "quantity"));
  if (r.ok) revalidatePath("/buyer/cart");
  return r;
}

export async function removeCartItemAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const itemId = parseId(text(fd, "itemId"));
  if (!itemId) return bad("Item tidak valid.");
  const r = await svc.removeCartItem(me, itemId);
  if (r.ok) revalidatePath("/buyer/cart");
  return r;
}

export async function checkoutAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const r = await svc.checkout(me, fd);
  if (!r.ok) return r;
  revalidatePath("/buyer", "layout");
  redirect(`/buyer/orders/${r.data.orderId}?baru=1`);
}

export async function submitReviewAction(_prev, fd) {
  const me = await requireRole(["buyer"]);
  const itemId = parseId(text(fd, "orderItemId"));
  if (!itemId) return bad("Item tidak valid.");
  const r = await svc.submitReview(me, itemId, fd);
  if (r.ok) { revalidatePath("/buyer/orders", "layout"); revalidatePath("/products", "layout"); }
  return r;
}
