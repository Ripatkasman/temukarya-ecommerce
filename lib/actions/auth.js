"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";
import { getCurrentUser, landingPathFor, safeNextPath } from "@/lib/auth";
import { text } from "@/lib/validation";
import { requestAccountDeletion, cancelAccountDeletion } from "@/lib/repositories/users";
import * as auth from "@/lib/services/auth";

function destinationAfterLogin(user, nextPath) {
  if (user.isActive === false) return "/account-deactivated";
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

export async function requestDeletionAction(_prev, formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") return { ok: false, status: 403, message: "Akun admin tidak dapat dihapus." };
  const reason = text(formData, "reason");
  await requestAccountDeletion(user.id, reason);
  revalidatePath("/buyer/profile");
  revalidatePath("/seller/store");
  revalidatePath("/admin/users");
  return { ok: true, message: "Permintaan penghapusan akun berhasil dikirim dan menunggu persetujuan Admin." };
}

export async function cancelDeletionAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await cancelAccountDeletion(user.id);
  revalidatePath("/buyer/profile");
  revalidatePath("/seller/store");
  revalidatePath("/admin/users");
  return { ok: true, message: "Permintaan penghapusan akun dibatalkan." };
}