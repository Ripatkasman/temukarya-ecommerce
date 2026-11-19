import RoleLayout from "@/components/dashboard/RoleLayout";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BuyerLayout({ children }) {
  const user = await requireRole(["buyer"]);
  return <RoleLayout role="buyer" user={user}>{children}</RoleLayout>;
}
