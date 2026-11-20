import { route, publicUser } from "@/lib/api";
import { safeNextPath, landingPathFor } from "@/lib/auth";
import { text } from "@/lib/validation";
import * as auth from "@/lib/services/auth";

/** POST /api/auth/login  { email, password, next? } -> sesi cookie httpOnly + data user. */
export const POST = route({ body: true }, async ({ fd }) => {
  const r = await auth.login(fd);
  if (!r.ok) return r;
  const redirectTo = r.user.role === "seller" && r.user.sellerStatus !== "approved"
    ? "/seller/pending"
    : safeNextPath(text(fd, "next")) ?? landingPathFor(r.user);
  return { ok: true, message: "Berhasil masuk.", data: { user: publicUser(r.user), redirectTo } };
});
