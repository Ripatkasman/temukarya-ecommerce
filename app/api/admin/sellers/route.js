import { route } from "@/lib/api";
import { enumParam } from "@/lib/query";
import { listSellerApplications } from "@/lib/repositories/admin";

/** GET /api/admin/sellers?status=pending|approved|rejected (admin). */
export const GET = route({ roles: ["admin"] }, async ({ query }) => ({
  ok: true,
  data: { sellers: await listSellerApplications({ status: enumParam(query, "status", ["pending", "approved", "rejected"]) }) },
}));
