import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as admin from "@/lib/services/admin";

/** POST /api/admin/sellers/:id/decision { decision: "approve"|"reject" } (admin). Hanya dari status pending. */
export const POST = route({ roles: ["admin"], body: true }, async ({ me, fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Seller tidak ditemukan.");
  return admin.decideSeller(me, id, String(fd.get("decision") ?? ""));
});
