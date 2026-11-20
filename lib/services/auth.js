import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { validateLogin, validateRegister } from "@/lib/validation";
import { findUserForLogin, registerUser, deleteRejectedSeller } from "@/lib/repositories/users";

/**
 * Logika bisnis autentikasi, dipakai bersama oleh Server Action (lib/actions) dan Route Handler (app/api).
 * Hasil: { ok: true, ... } atau { ok: false, status, message?, errors?, values? }.
 */

// Hash palsu: dibandingkan saat email tidak ditemukan supaya waktu respons tidak membocorkan email terdaftar.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.QZ1H8Z7ZpF0Z5v0m5G6m8mB1uQe2";

/** @param {FormData} fd */
export async function login(fd) {
  const { values, password, errors } = validateLogin(fd);
  if (Object.keys(errors).length > 0) return { ok: false, status: 422, errors, values };

  const user = await findUserForLogin(values.email);
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) return { ok: false, status: 401, message: "Email atau kata sandi salah.", values };

  await createSession(user.id);
  const { passwordHash: _omit, ...safe } = user;
  return { ok: true, user: safe };
}

/** @param {FormData} fd */
export async function register(fd) {
  const { values, password, errors } = validateRegister(fd);
  if (Object.keys(errors).length > 0) return { ok: false, status: 422, errors, values };

  const passwordHash = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await registerUser({
      fullName: values.fullName, email: values.email, passwordHash, accountType: values.accountType,
      storeName: values.storeName, storeDescription: values.storeDescription,
    });
  } catch (err) {
    if (err?.code === "23505") return { ok: false, status: 409, errors: { email: "Email ini sudah terdaftar. Silakan masuk." }, values };
    console.error("register gagal:", err);
    return { ok: false, status: 500, message: "Pendaftaran belum berhasil. Coba lagi beberapa saat.", values };
  }
  await createSession(user.id);
  return { ok: true, user };
}

/** Seller yang DITOLAK menghapus akunnya sendiri. Kondisi role+status dicek ulang di SQL. */
export async function deleteRejectedAccount(me) {
  if (me.role !== "seller" || me.sellerStatus !== "rejected") {
    return { ok: false, status: 403, message: "Hanya seller yang ditolak yang dapat menghapus akun lewat jalur ini." };
  }
  const deleted = await deleteRejectedSeller(me.id);
  if (!deleted) return { ok: false, status: 404, message: "Akun tidak ditemukan." };
  return { ok: true, message: "Akun dihapus." };
}
