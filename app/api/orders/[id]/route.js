import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import { getOrderDetail } from "@/lib/repositories/buyer";

/** GET /api/orders/:id (buyer pemilik). Pesanan milik orang lain = 404. */
export const GET = route({ roles: ["buyer"] }, async ({ me, params }) => {
  const id = parseId(params.id);
  const order = id ? await getOrderDetail(me.id, id) : null;
  if (!order) return fail(404, "Pesanan tidak ditemukan.");
  return { ok: true, data: { order } };
});
