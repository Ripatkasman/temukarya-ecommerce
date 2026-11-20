import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import { getProduct, listReviews } from "@/lib/repositories/catalog";
import { getCurrentUser } from "@/lib/auth";
import * as seller from "@/lib/services/seller";
import * as admin from "@/lib/services/admin";

/** GET /api/products/:id  (publik) -> detail produk + ulasan. */
export const GET = route({}, async ({ params }) => {
  const id = parseId(params.id);
  const product = id ? await getProduct(id) : null;
  if (!product) return fail(404, "Produk tidak ditemukan.");
  return { ok: true, data: { product, reviews: await listReviews(id) } };
});

/** PATCH /api/products/:id  (seller pemilik; multipart agar bisa mengganti gambar). */
export const PATCH = route({ roles: ["seller"], body: true }, async ({ me, fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Produk tidak ditemukan.");
  return seller.saveProduct(me, id, fd);
});

/** DELETE /api/products/:id  (seller: produk miliknya; admin: produk mana pun yang melanggar aturan). */
export const DELETE = route({ roles: ["seller", "admin"] }, async ({ me, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Produk tidak ditemukan.");
  return me.role === "admin" ? admin.deleteProduct(id) : seller.deleteProduct(me, id);
});
