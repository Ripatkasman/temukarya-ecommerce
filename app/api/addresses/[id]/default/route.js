import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as svc from "@/lib/services/addresses";

/** POST /api/addresses/:id/default (buyer pemilik) -> jadikan alamat utama. */
export const POST = route({ roles: ["buyer"] }, async ({ me, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Alamat tidak ditemukan.");
  return svc.setDefault(me, id);
});
