import { route } from "@/lib/api";
import { qParam, pageParam, enumParam } from "@/lib/query";
import { listUsers } from "@/lib/repositories/admin";

/** GET /api/admin/users?q=&role=&page= (admin). */
export const GET = route({ roles: ["admin"] }, async ({ query }) => ({
  ok: true,
  data: await listUsers({ q: qParam(query), role: enumParam(query, "role", ["admin", "seller", "buyer"]), page: pageParam(query) }),
}));
