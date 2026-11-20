import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as wl from "@/lib/services/wishlist";

/** DELETE /api/wishlist/:productId (buyer pemilik favorit). */
export const DELETE = route({ roles: ["buyer"] }, async ({ me, params }) => {
  const id = parseId(params.productId);
  if (!id) return fail(404, "Produk tidak ada di favorit Anda.");
  return wl.remove(me, id);
});
