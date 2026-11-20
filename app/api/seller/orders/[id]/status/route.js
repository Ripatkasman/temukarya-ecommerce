import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as seller from "@/lib/services/seller";

/** PATCH /api/seller/orders/:id/status { status: processing|shipped|completed|cancelled } (seller pemilik sub-order). */
export const PATCH = route({ roles: ["seller"], body: true }, async ({ me, fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Pesanan tidak ditemukan.");
  return seller.updateOrderStatus(me, id, String(fd.get("status") ?? ""));
});
