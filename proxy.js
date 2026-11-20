import { NextResponse } from "next/server";

/**
 * Proxy (di Next.js 16 menggantikan "middleware"): lapisan PERTAMA untuk route dashboard.
 * Request tanpa cookie sesi langsung dialihkan ke /login (dengan tujuan lanjutan), tanpa menyentuh database.
 *
 * Ini hanya penjagaan awal untuk UX dan efisiensi. Otorisasi yang sebenarnya (sesi valid, role, status
 * seller, dan kepemilikan data) tetap dilakukan di server oleh requireRole() dan query SQL berbatas pemilik,
 * jadi cookie palsu tidak memberi akses apa pun.
 */
export function proxy(request) {
  if (!request.cookies.get("tk_session")?.value) {
    const url = request.nextUrl.clone();
    const target = request.nextUrl.pathname + request.nextUrl.search;
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(target)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/seller/:path*", "/buyer/:path*"] };
