import { cache } from "react";
import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { findUserById } from "@/lib/repositories/users";

export const getCurrentUser = cache(async () => {
  const uid = await readSessionUserId();
  if (!uid) return null;
  return findUserById(uid);
});

export function homePathFor(user) {
  if (user.isActive === false) return "/account-deactivated";
  if (user.role === "admin") return "/admin";
  if (user.role === "seller") return user.sellerStatus === "approved" ? "/seller" : "/seller/pending";
  return "/buyer";
}

export function landingPathFor(user) {
  if (user.isActive === false) return "/account-deactivated";
  return user.role === "buyer" ? "/" : homePathFor(user);
}

export function safeNextPath(value) {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  return value;
}

export function loginPathWithNext(nextPath) {
  const safe = safeNextPath(nextPath);
  return safe ? `/login?next=${encodeURIComponent(safe)}` : "/login";
}

export async function requireRole(roles, { allowUnapprovedSeller = false } = {}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.isActive === false) redirect("/account-deactivated");
  if (!roles.includes(user.role)) redirect(homePathFor(user));
  if (user.role === "seller" && user.sellerStatus !== "approved" && !allowUnapprovedSeller) {
    redirect("/seller/pending");
  }
  return user;
}