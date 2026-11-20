import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as buyer from "@/lib/services/buyer";

/** PATCH /api/cart/items/:id { quantity } (buyer pemilik keranjang). */
export const PATCH = route({ roles: ["buyer"], body: true }, async ({ me, fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Item tidak ditemukan di keranjang.");
  return buyer.setCartQuantity(me, id, fd.get("quantity"));
});

/** DELETE /api/cart/items/:id (buyer pemilik keranjang). */
export const DELETE = route({ roles: ["buyer"] }, async ({ me, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Item tidak ditemukan di keranjang.");
  return buyer.removeCartItem(me, id);
});
