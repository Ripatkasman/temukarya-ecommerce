import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Sesi berbasis cookie httpOnly yang ditandatangani (HMAC-SHA256).
 * Cookie hanya berisi id user dan waktu kedaluwarsa. Role dan status seller TIDAK disimpan di cookie:
 * keduanya selalu dibaca ulang dari database (lihat lib/auth.js).
 */
export const SESSION_COOKIE = "tk_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET belum diatur atau kurang dari 32 karakter (lihat .env.example).");
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/**
 * Membuat sesi untuk user dan menaruhnya di cookie.
 * @param {string|number} userId
 */
export async function createSession(userId) {
  const payload = Buffer.from(
    JSON.stringify({ uid: String(userId), exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS })
  ).toString("base64url");
  const jar = await cookies();
  jar.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/**
 * Membaca id user dari cookie sesi. Mengembalikan null jika tidak ada, rusak, dipalsukan, atau kedaluwarsa.
 * @returns {Promise<string|null>}
 */
export async function readSessionUserId() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof uid !== "string" || !/^\d+$/.test(uid)) return null;
    if (typeof exp !== "number" || exp < Date.now() / 1000) return null;
    return uid;
  } catch {
    return null;
  }
}

/** Menghapus cookie sesi (logout). */
export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
