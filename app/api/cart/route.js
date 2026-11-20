import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import { getCart } from "@/lib/repositories/buyer";
import * as buyer from "@/lib/services/buyer";

/** GET /api/cart (buyer) -> isi keranjang dengan harga dan stok terkini. */
export const GET = route({ roles: ["buyer"] }, async ({ me }) => ({ ok: true, data: await getCart(me.id) }));

/** POST /api/cart { productId, quantity? } (buyer). */
export const POST = route({ roles: ["buyer"], body: true, success: 201 }, async ({ me, fd }) => {
  const productId = parseId(String(fd.get("productId") ?? ""));
  if (!productId) return fail(422, "Produk tidak valid.");
  return buyer.addToCart(me, productId, fd.get("quantity") ?? 1);
});
