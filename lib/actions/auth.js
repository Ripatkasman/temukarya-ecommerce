"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession, destroySession } from "@/lib/session";
import { getCurrentUser, landingPathFor, safeNextPath } from "@/lib/auth";
import { validateLogin, validateRegister, text } from "@/lib/validation";
import { findUserForLogin, registerUser, deleteRejectedSeller } from "@/lib/repositories/users";

// Hash palsu: dibandingkan saat email tidak ditemukan supaya waktu respons tidak membocorkan email terdaftar.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.QZ1H8Z7ZpF0Z5v0m5G6m8mB1uQe2";

/**
 * Tujuan setelah login. Seller yang belum disetujui selalu ke halaman statusnya.
 * Selain itu, pakai `next` jika aman, kalau tidak ke halaman utama sesuai role.
 */
function destinationAfterLogin(user, nextPath) {
  if (user.role === "seller" && user.sellerStatus !== "approved") return "/seller/pending";
  return safeNextPath(nextPath) ?? landingPathFor(user);
}

/**
 * Server Action login.
 * @param {{ errors?: Record<string,string>, message?: string, values?: Record<string,string> }} _prev
 * @param {FormData} formData
 */
export async function loginAction(_prev, formData) {
  const { values, password, errors } = validateLogin(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  const user = await findUserForLogin(values.email);
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) {
    return { message: "Email atau kata sandi salah.", values };
  }

  await createSession(user.id);
  redirect(destinationAfterLogin(user, text(formData, "next")));
}

/**
 * Server Action registrasi (Buyer atau Seller saja).
 * Role dan status seller ditentukan di repository, bukan dari input client.
 */
export async function registerAction(_prev, formData) {
  const { values, password, errors } = validateRegister(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  const passwordHash = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await registerUser({
      fullName: values.fullName,
      email: values.email,
      passwordHash,
      accountType: values.accountType,
      storeName: values.storeName,
      storeDescription: values.storeDescription,
    });
  } catch (err) {
    if (err?.code === "23505") {
      return { errors: { email: "Email ini sudah terdaftar. Silakan masuk." }, values };
    }
    console.error("registerAction gagal:", err);
    return { message: "Pendaftaran belum berhasil. Coba lagi beberapa saat.", values };
  }

  await createSession(user.id);
  redirect(landingPathFor(user));
}

/** Server Action logout. */
export async function logoutAction() {
  await destroySession();
  redirect("/");
}

/**
 * Seller yang ditolak menghapus akunnya sendiri.
 * Dicek ulang di server: hanya seller dengan status 'rejected' yang boleh.
 */
export async function deleteRejectedAccountAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "seller" || user.sellerStatus !== "rejected") redirect(landingPathFor(user));

  const deleted = await deleteRejectedSeller(user.id);
  if (!deleted) redirect("/seller/pending");

  await destroySession();
  redirect("/login?info=akun-dihapus");
}
