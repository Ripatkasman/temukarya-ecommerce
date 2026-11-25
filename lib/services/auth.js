import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { checkLoginLimit, recordLoginFailure, clearLoginFailures } from "@/lib/rateLimit";
import { createSession } from "@/lib/session";
import { text, validateLogin, validateRegister } from "@/lib/validation";
import {
  findUserForLogin,
  findUserForRecovery,
  registerUser,
  resetPasswordWithRecovery,
  deleteRejectedSeller,
} from "@/lib/repositories/users";

const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.QZ1H8Z7ZpF0Z5v0m5G6m8mB1uQe2";

function generateRecoveryCode() {
  return String(crypto.randomInt(100000, 1000000));
}

/** @param {FormData} fd */
export async function login(fd) {
  const { values, password, errors } = validateLogin(fd);
  if (Object.keys(errors).length > 0) return { ok: false, status: 422, errors, values };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "lokal";
  const key = `${ip}|${values.email}`;
  const limit = checkLoginLimit(key);
  if (limit.limited) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return { ok: false, status: 429, message: `Terlalu banyak percobaan masuk. Coba lagi dalam ${minutes} menit.`, values };
  }

  const user = await findUserForLogin(values.email);
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) {
    recordLoginFailure(key);
    return { ok: false, status: 401, message: "Email atau kata sandi salah.", values };
  }
  clearLoginFailures(key);

  await createSession(user.id);
  const { passwordHash: _omit, ...safe } = user;
  return { ok: true, user: safe };
}

/** @param {FormData} fd */
export async function register(fd) {
  const { values, password, errors } = validateRegister(fd);
  if (Object.keys(errors).length > 0) return { ok: false, status: 422, errors, values };

  const recoveryCode = generateRecoveryCode();
  const [passwordHash, recoveryCodeHash] = await Promise.all([
    bcrypt.hash(password, 10),
    bcrypt.hash(recoveryCode, 10),
  ]);

  let user;
  try {
    user = await registerUser({
      fullName: values.fullName,
      email: values.email,
      passwordHash,
      recoveryCodeHash,
      accountType: values.accountType,
      storeName: values.storeName,
      storeDescription: values.storeDescription,
    });
  } catch (err) {
    if (err?.code === "23505") {
      return { ok: false, status: 409, errors: { email: "Email ini sudah terdaftar. Silakan masuk." }, values };
    }
    console.error("register gagal:", err);
    return { ok: false, status: 500, message: "Pendaftaran belum berhasil. Coba lagi beberapa saat.", values };
  }

  // Sesi dibuat setelah pengguna mengonfirmasi kode pemulihan di modal
  return { ok: true, user, recoveryCode };
}

/**
 * Reset kata sandi menggunakan email + kode pemulihan 6 angka.
 * Setelah berhasil, kode pemulihan otomatis dirotasi ke 6 angka baru.
 * @param {FormData} fd
 */
export async function resetPasswordByRecovery(fd) {
  const email = text(fd, "email").toLowerCase();
  const recoveryCode = text(fd, "recoveryCode").replace(/\s+/g, "");
  const newPassword = String(fd.get("newPassword") ?? "");
  const confirmPassword = String(fd.get("confirmPassword") ?? "");

  const values = { email };
  const errors = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Masukkan alamat email yang valid.";
  }
  if (!/^\d{6}$/.test(recoveryCode)) {
    errors.recoveryCode = "Kode pemulihan harus berupa 6 digit angka.";
  }
  if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
    errors.newPassword = "Kata sandi baru minimal 8 karakter dan mengandung huruf serta angka.";
  }
  if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 422, errors, values };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "lokal";
  const key = `recovery|${ip}|${email}`;
  const limit = checkLoginLimit(key);
  if (limit.limited) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return {
      ok: false,
      status: 429,
      message: `Terlalu banyak percobaan pemulihan akun. Coba lagi dalam ${minutes} menit.`,
      values,
    };
  }

  const user = await findUserForRecovery(email);
  const hashToCheck = user?.recoveryCodeHash || DUMMY_HASH;
  const codeValid = await bcrypt.compare(recoveryCode, hashToCheck);

  if (!user || !user.recoveryCodeHash || !codeValid) {
    recordLoginFailure(key);
    return {
      ok: false,
      status: 401,
      message: "Email atau kode pemulihan 6 angka tidak cocok.",
      values,
    };
  }

  clearLoginFailures(key);

  const nextRecoveryCode = generateRecoveryCode();
  const [newPasswordHash, nextRecoveryCodeHash] = await Promise.all([
    bcrypt.hash(newPassword, 10),
    bcrypt.hash(nextRecoveryCode, 10),
  ]);

  await resetPasswordWithRecovery(user.id, newPasswordHash, nextRecoveryCodeHash);

  return {
    ok: true,
    nextRecoveryCode,
  };
}

/** Seller yang DITOLAK menghapus akunnya sendiri. */
export async function deleteRejectedAccount(me) {
  if (me.role !== "seller" || me.sellerStatus !== "rejected") {
    return { ok: false, status: 403, message: "Hanya seller yang ditolak yang dapat menghapus akun lewat jalur ini." };
  }
  const deleted = await deleteRejectedSeller(me.id);
  if (!deleted) return { ok: false, status: 404, message: "Akun tidak ditemukan." };
  return { ok: true, message: "Akun dihapus." };
}