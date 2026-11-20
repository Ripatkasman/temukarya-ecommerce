import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as svc from "@/lib/services/addresses";

/** PATCH /api/addresses/:id (buyer pemilik). */
export const PATCH = route({ roles: ["buyer"], body: true }, async ({ me, fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Alamat tidak ditemukan.");
  return svc.save(me, id, fd);
});

/** DELETE /api/addresses/:id (buyer pemilik). Jika alamat utama dihapus, alamat terbaru lainnya menjadi utama. */
export const DELETE = route({ roles: ["buyer"] }, async ({ me, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Alamat tidak ditemukan.");
  return svc.remove(me, id);
});
