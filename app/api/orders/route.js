import { route } from "@/lib/api";
import { pageParam } from "@/lib/query";
import { listOrders } from "@/lib/repositories/buyer";
import * as buyer from "@/lib/services/buyer";

/** GET /api/orders?page= (buyer) -> riwayat pesanan sendiri beserta status turunan. */
export const GET = route({ roles: ["buyer"] }, async ({ me, query }) => ({ ok: true, data: await listOrders(me.id, { page: pageParam(query) }) }));

/** POST /api/orders { recipientName, recipientPhone, shippingAddress, notes? } (buyer) -> checkout atomik dari keranjang di database. */
export const POST = route({ roles: ["buyer"], body: true, success: 201 }, async ({ me, fd }) => buyer.checkout(me, fd));
