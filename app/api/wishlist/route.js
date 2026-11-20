import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import { listWishlist } from "@/lib/repositories/wishlist";
import * as wl from "@/lib/services/wishlist";

/** GET /api/wishlist (buyer) -> daftar favorit dengan data produk terkini. */
export const GET = route({ roles: ["buyer"] }, async ({ me }) => ({ ok: true, data: { items: await listWishlist(me.id) } }));

/** POST /api/wishlist { productId } (buyer). Idempotent: produk yang sudah ada dijawab 200. */
export const POST = route({ roles: ["buyer"], body: true, success: 201 }, async ({ me, fd }) => {
  const productId = parseId(String(fd.get("productId") ?? ""));
  if (!productId) return fail(422, "Produk tidak valid.");
  return wl.add(me, productId);
});
