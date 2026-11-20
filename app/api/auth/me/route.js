import { route, fail, publicUser } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

/** GET /api/auth/me -> user yang sedang login (role dan status dibaca dari database). */
export const GET = route({}, async () => {
  const user = await getCurrentUser();
  if (!user) return fail(401, "Belum masuk.");
  return { ok: true, data: { user: publicUser(user) } };
});
