import { cache } from "react";
import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { findUserById } from "@/lib/repositories/users";

/**
 * User yang sedang login, dibaca dari database (bukan dari cookie).
 * Di-cache per request supaya beberapa komponen tidak memicu query berulang.
 * @returns {Promise<import("@/lib/repositories/users").AuthUser|null>}
 */
export const getCurrentUser = cache(async () => {
  const uid = await readSessionUserId();
  if (!uid) return null;
  return findUserById(uid);
});

/**
 * Halaman tujuan setelah login / tombol Dashboard, sesuai role dan status akun.
 * @param {import("@/lib/repositories/users").AuthUser} user
 */
export function homePathFor(user) {
  if (user.role === "admin") return "/admin";
  if (user.role === "seller") return user.sellerStatus === "approved" ? "/seller" : "/seller/pending";
  return "/buyer";
}

/**
 * Halaman tujuan langsung setelah login/registrasi. Buyer ke beranda (beranda buyer ada di "/"),
 * role lain ke dashboard/halaman statusnya.
 * @param {import("@/lib/repositories/users").AuthUser} user
 */
export function landingPathFor(user) {
  return user.role === "buyer" ? "/" : homePathFor(user);
}

/**
 * Hanya menerima path internal ("/produk") untuk parameter `next`.
 * Menolak URL absolut dan "//host" supaya tidak menjadi open redirect.
 * @param {unknown} value
 * @returns {string|null}
 */
export function safeNextPath(value) {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  return value;
}

/** Path login dengan tujuan lanjutan (dipakai tombol yang membutuhkan login). */
export function loginPathWithNext(nextPath) {
  const safe = safeNextPath(nextPath);
  return safe ? `/login?next=${encodeURIComponent(safe)}` : "/login";
}

/**
 * Guard untuk halaman dengan role tertentu. Dipanggil di server (Server Component / Server Action).
 * - Belum login            -> /login
 * - Seller belum disetujui -> /seller/pending
 * - Role tidak cocok       -> halaman utama role tersebut
 * @param {Array<"admin"|"seller"|"buyer">} roles
 * @param {{ allowUnapprovedSeller?: boolean }} [options]
 * @returns {Promise<import("@/lib/repositories/users").AuthUser>}
 */
export async function requireRole(roles, { allowUnapprovedSeller = false } = {}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(homePathFor(user));
  if (user.role === "seller" && user.sellerStatus !== "approved" && !allowUnapprovedSeller) {
    redirect("/seller/pending");
  }
  return user;
}
