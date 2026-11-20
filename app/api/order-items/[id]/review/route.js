import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as buyer from "@/lib/services/buyer";

/** POST /api/order-items/:id/review { rating: 1-5, comment } (buyer pemilik, sub-order berstatus Selesai). */
export const POST = route({ roles: ["buyer"], body: true, success: 201 }, async ({ me, fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Item pesanan tidak ditemukan.");
  return buyer.submitReview(me, id, fd);
});
