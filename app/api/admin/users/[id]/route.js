import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as admin from "@/lib/services/admin";

/** PATCH /api/admin/users/:id { fullName, email, phone? } (admin). Role dan status seller tidak bisa diubah. */
export const PATCH = route({ roles: ["admin"], body: true }, async ({ fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Pengguna tidak ditemukan.");
  return admin.updateUser(id, fd);
});

/** DELETE /api/admin/users/:id (admin; tidak bisa menghapus diri sendiri). */
export const DELETE = route({ roles: ["admin"] }, async ({ me, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Pengguna tidak ditemukan.");
  return admin.deleteUser(me, id);
});
