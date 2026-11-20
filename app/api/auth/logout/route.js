import { route } from "@/lib/api";
import { destroySession } from "@/lib/session";

/** POST /api/auth/logout */
export const POST = route({}, async () => {
  await destroySession();
  return { ok: true, message: "Berhasil keluar." };
});
