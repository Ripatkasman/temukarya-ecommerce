"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";
import { getCurrentUser, landingPathFor, safeNextPath } from "@/lib/auth";
import { text } from "@/lib/validation";
import * as auth from "@/lib/services/auth";

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
  return {
    ok: true,
    userId: r.user.id,
    recoveryCode: r.recoveryCode,
    redirectTo: landingPathFor(r.user),
  };
}

export async function completeRegisterSessionAction(userId, redirectTo) {
  if (userId) {
    await createSession(userId);
  }
  redirect(redirectTo || "/");
}

export async function resetPasswordAction(_prev, formData) {
  return auth.resetPasswordByRecovery(formData);
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