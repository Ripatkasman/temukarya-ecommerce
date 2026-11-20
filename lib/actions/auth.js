"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/session";
import { getCurrentUser, landingPathFor, safeNextPath } from "@/lib/auth";
import { text } from "@/lib/validation";
import * as auth from "@/lib/services/auth";

/**
 * Server Actions autentikasi: adapter tipis di atas lib/services/auth.js
 * (jalur yang sama juga tersedia sebagai Route Handler di app/api/auth/*).
 */

/** Seller yang belum disetujui selalu ke halaman statusnya; selain itu `next` yang aman, atau halaman utama role. */
function destinationAfterLogin(user, nextPath) {
  if (user.role === "seller" && user.sellerStatus !== "approved") return "/seller/pending";
  return safeNextPath(nextPath) ?? landingPathFor(user);
}

export async function loginAction(_prev, formData) {
  const r = await auth.login(formData);
  if (!r.ok) return r;
  redirect(destinationAfterLogin(r.user, text(formData, "next")));
}

export async function registerAction(_prev, formData) {
  const r = await auth.register(formData);
  if (!r.ok) return r;
  redirect(landingPathFor(r.user));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function deleteRejectedAccountAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const r = await auth.deleteRejectedAccount(user);
  if (!r.ok) redirect(user.role === "seller" ? "/seller/pending" : landingPathFor(user));
  await destroySession();
  redirect("/login?info=akun-dihapus");
}
