/** Helper membaca searchParams Next.js (nilai bisa string atau array). */
export const first = (v) => (Array.isArray(v) ? v[0] : v);

/** Teks pencarian: dirapikan dan dibatasi 100 karakter. */
export function qParam(sp, key = "q") {
  const v = first(sp[key]);
  return (typeof v === "string" ? v.trim() : "").slice(0, 100);
}

/** Nomor halaman >= 1; nilai tidak valid menjadi 1. */
export function pageParam(sp) {
  const n = Number(first(sp.page));
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** Nilai param yang harus salah satu dari `allowed`, selain itu "". */
export function enumParam(sp, key, allowed) {
  const v = first(sp[key]);
  return allowed.includes(v) ? v : "";
}
