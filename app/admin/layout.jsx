import RoleLayout from "@/components/dashboard/RoleLayout";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await requireRole(["admin"]);
  return <RoleLayout role="admin" user={user}>{children}</RoleLayout>;
}
