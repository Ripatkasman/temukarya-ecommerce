import { route } from "@/lib/api";
import { pageParam, enumParam } from "@/lib/query";
import { listIncomingOrders } from "@/lib/repositories/seller";

/** GET /api/seller/orders?status=&page= (seller approved) -> hanya sub-order milik toko sendiri. */
export const GET = route({ roles: ["seller"] }, async ({ me, query }) => {
  const status = enumParam(query, "status", ["awaiting_payment", "processing", "shipped", "completed", "cancelled"]);
  return { ok: true, data: await listIncomingOrders(me.id, { status, page: pageParam(query) }) };
});
