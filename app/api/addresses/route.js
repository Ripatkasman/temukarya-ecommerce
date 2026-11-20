import { route } from "@/lib/api";
import { listAddresses } from "@/lib/repositories/addresses";
import * as svc from "@/lib/services/addresses";

/** GET /api/addresses (buyer) -> buku alamat sendiri (alamat utama di urutan pertama). */
export const GET = route({ roles: ["buyer"] }, async ({ me }) => ({ ok: true, data: { addresses: await listAddresses(me.id) } }));

/** POST /api/addresses { label, recipientName, phone, fullAddress, isDefault? } (buyer). Maksimal 10 alamat. */
export const POST = route({ roles: ["buyer"], body: true, success: 201 }, async ({ me, fd }) => svc.save(me, null, fd));
