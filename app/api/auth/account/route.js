import { route } from "@/lib/api";
import * as auth from "@/lib/services/auth";
import { destroySession } from "@/lib/session";

/** DELETE /api/auth/account -> seller berstatus 'rejected' menghapus akunnya sendiri. */
export const DELETE = route({ roles: ["seller"], allowUnapproved: true }, async ({ me }) => {
  const r = await auth.deleteRejectedAccount(me);
  if (r.ok) await destroySession();
  return r;
});
