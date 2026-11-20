import { route, fail } from "@/lib/api";
import { parseId } from "@/lib/validation";
import * as admin from "@/lib/services/admin";

/** PATCH /api/categories/:id { name, description? } (admin). */
export const PATCH = route({ roles: ["admin"], body: true }, async ({ fd, params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Kategori tidak ditemukan.");
  return admin.saveCategory(id, fd);
});

/** DELETE /api/categories/:id (admin). 409 jika masih dipakai produk. */
export const DELETE = route({ roles: ["admin"] }, async ({ params }) => {
  const id = parseId(params.id);
  if (!id) return fail(404, "Kategori tidak ditemukan.");
  return admin.deleteCategory(id);
});
