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

/**
 * Filter katalog produk dari query string (dipakai halaman /products dan GET /api/products).
 * Semua nilai divalidasi; nilai tidak valid diabaikan.
 * @param {Record<string, string|string[]|undefined>} sp
 * @param {string[]} sortValues urutan yang diizinkan
 */
export function parseProductFilters(sp, sortValues) {
  const price = (key) => {
    const s = first(sp[key]);
    if (typeof s !== "string" || !/^\d{1,10}$/.test(s)) return null;
    const n = Number(s);
    return n <= 9_999_999_999 ? n : null;
  };
  const cat = first(sp.category);
  const sortRaw = first(sp.sort);
  return {
    q: qParam(sp),
    categoryId: typeof cat === "string" && /^[1-9]\d{0,17}$/.test(cat) ? cat : null,
    minPrice: price("min"),
    maxPrice: price("max"),
    sort: sortValues.includes(sortRaw) ? sortRaw : "newest",
    page: pageParam(sp),
  };
}
