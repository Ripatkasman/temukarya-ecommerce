import { route } from "@/lib/api";
import { parseProductFilters } from "@/lib/query";
import { listProducts, SORT_OPTIONS } from "@/lib/repositories/catalog";
import * as seller from "@/lib/services/seller";

/**
 * GET /api/products?q=&category=&min=&max=&sort=newest|price_asc|price_desc&page=  (publik)
 * Hanya produk aktif milik seller yang sudah disetujui.
 */
export const GET = route({}, async ({ query }) => {
  const f = parseProductFilters(query, SORT_OPTIONS.map((o) => o.value));
  const r = await listProducts(f);
  return { ok: true, data: r };
});

/** POST /api/products  (seller approved; multipart atau JSON tanpa gambar tidak diterima karena gambar wajib) */
export const POST = route({ roles: ["seller"], body: true, success: 201 }, async ({ me, fd }) => seller.saveProduct(me, null, fd));
