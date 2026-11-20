import { route } from "@/lib/api";
import { getProfile } from "@/lib/repositories/buyer";
import * as buyer from "@/lib/services/buyer";

/** GET /api/profile (buyer). */
export const GET = route({ roles: ["buyer"] }, async ({ me }) => {
  const p = await getProfile(me.id);
  return { ok: true, data: { profile: { fullName: p.full_name, email: p.email, phone: p.phone } } };
});

/** PATCH /api/profile { fullName, phone? } (buyer). */
export const PATCH = route({ roles: ["buyer"], body: true }, async ({ me, fd }) => buyer.updateProfile(me, fd));
