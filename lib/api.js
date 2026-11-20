import { NextResponse } from "next/server";
import { getCurrentUser, homePathFor } from "@/lib/auth";

/**
 * Pembantu untuk Route Handler (app/api/**). Semua endpoint memakai bentuk respons yang sama:
 *   sukses: { ok: true,  message?, data? }
 *   gagal : { ok: false, message?, errors? }
 * Kode status: 200/201 sukses, 401 belum login, 403 role/kepemilikan salah, 404 tidak ada,
 * 409 konflik (duplikat, stok, transisi status), 415 tipe body salah, 422 validasi, 500 kesalahan server.
 */

export function fail(status, message, errors) {
  return NextResponse.json({ ok: false, message, ...(errors ? { errors } : {}) }, { status });
}

/** Mengubah hasil service menjadi Response JSON. */
export function respond(result, successStatus = 200) {
  if (result.ok) {
    return NextResponse.json({ ok: true, message: result.message, data: result.data }, { status: result.status ?? successStatus });
  }
  return fail(result.status ?? (result.errors ? 422 : 400), result.message, result.errors);
}

/**
 * Perlindungan CSRF tambahan di atas cookie SameSite=Lax: request yang mengubah data dan membawa
 * header Origin dari host lain ditolak.
 */
function sameOrigin(req) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return true;
  const origin = req.headers.get("origin");
  if (!origin) return true; // klien non-browser (curl, Postman) tidak mengirim Origin
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** Body JSON dikonversi ke FormData agar memakai validator yang sama dengan Server Action. */
function jsonToFormData(obj) {
  const fd = new FormData();
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined) continue;
      if (typeof v === "boolean") { if (v) fd.set(k, "on"); continue; }
      if (typeof v === "string" || typeof v === "number") fd.set(k, String(v));
    }
  }
  return fd;
}

/** Membaca body JSON atau multipart/form-data (untuk upload gambar). */
async function readBody(req) {
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) return { fd: jsonToFormData(await req.json()) };
    if (type.includes("multipart/form-data")) return { fd: await req.formData() };
  } catch {
    return { res: fail(400, "Body request tidak dapat dibaca.") };
  }
  return { res: fail(415, "Content-Type harus application/json atau multipart/form-data.") };
}

/**
 * Pengecekan sesi + role di server. Seller hanya lolos jika berstatus approved.
 * @returns {Promise<{ user: import("@/lib/repositories/users").AuthUser } | { res: Response }>}
 */
async function authorize(roles, allowUnapproved = false) {
  const user = await getCurrentUser();
  if (!user) return { res: fail(401, "Silakan masuk terlebih dahulu.") };
  if (!roles.includes(user.role)) return { res: fail(403, "Anda tidak memiliki akses ke sumber daya ini.") };
  if (user.role === "seller" && user.sellerStatus !== "approved" && !allowUnapproved) return { res: fail(403, "Akun penjual belum disetujui admin.") };
  return { user };
}

/**
 * Membungkus Route Handler: cek origin, otorisasi role, baca body, parameter URL, dan tangkap error tak terduga.
 * @param {{ roles?: Array<"admin"|"seller"|"buyer">, body?: boolean, success?: number, allowUnapproved?: boolean }} opts
 * @param {(ctx: { req: Request, me: any, fd: FormData|null, params: Record<string,string>, query: Record<string,string> }) => Promise<object|Response>} fn
 */
export function route({ roles, body = false, success = 200, allowUnapproved = false } = {}, fn) {
  return async (req, ctx) => {
    try {
      if (!sameOrigin(req)) return fail(403, "Origin tidak diizinkan.");
      let me = null;
      if (roles) {
        const a = await authorize(roles, allowUnapproved);
        if (a.res) return a.res;
        me = a.user;
      }
      let fd = null;
      if (body) {
        const b = await readBody(req);
        if (b.res) return b.res;
        fd = b.fd;
      }
      const params = ctx?.params ? await ctx.params : {};
      const query = Object.fromEntries(new URL(req.url).searchParams);
      const result = await fn({ req, me, fd, params, query });
      return result instanceof Response ? result : respond(result, success);
    } catch (err) {
      console.error(`API ${req.method} ${new URL(req.url).pathname} gagal:`, err);
      return fail(500, "Terjadi kesalahan pada server.");
    }
  };
}

/** Bentuk user yang aman dikirim ke klien. */
export function publicUser(user) {
  return { id: user.id, fullName: user.fullName, email: user.email, role: user.role, sellerStatus: user.sellerStatus, home: homePathFor(user) };
}
