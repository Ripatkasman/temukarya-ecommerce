import { route } from "@/lib/api";
import { listCategories } from "@/lib/repositories/catalog";
import * as admin from "@/lib/services/admin";

/** GET /api/categories (publik). */
export const GET = route({}, async () => ({ ok: true, data: { categories: await listCategories() } }));

/** POST /api/categories { name, description? } (admin). */
export const POST = route({ roles: ["admin"], body: true, success: 201 }, async ({ fd }) => admin.saveCategory(null, fd));
