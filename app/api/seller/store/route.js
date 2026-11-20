import { route, fail } from "@/lib/api";
import { getStoreBySeller } from "@/lib/repositories/seller";
import * as seller from "@/lib/services/seller";

/** GET /api/seller/store (seller approved). */
export const GET = route({ roles: ["seller"] }, async ({ me }) => {
  const store = await getStoreBySeller(me.id);
  return store ? { ok: true, data: { store } } : fail(404, "Toko tidak ditemukan.");
});

/** PATCH /api/seller/store { name, description? } + file `image` opsional (multipart). */
export const PATCH = route({ roles: ["seller"], body: true }, async ({ me, fd }) => seller.saveStore(me, fd));
