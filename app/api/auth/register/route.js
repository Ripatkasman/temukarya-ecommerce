import { route, publicUser } from "@/lib/api";
import { landingPathFor } from "@/lib/auth";
import * as auth from "@/lib/services/auth";

/** POST /api/auth/register  { accountType: "buyer"|"seller", fullName, email, password, confirmPassword, storeName?, storeDescription? } */
export const POST = route({ body: true, success: 201 }, async ({ fd }) => {
  const r = await auth.register(fd);
  if (!r.ok) return r;
  return { ok: true, message: "Pendaftaran berhasil.", data: { user: publicUser(r.user), redirectTo: landingPathFor(r.user) } };
});
