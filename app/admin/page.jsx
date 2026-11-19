import RolePlaceholder from "@/components/dashboard/RolePlaceholder";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Dashboard Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin"]);
  return <RolePlaceholder roleLabel="Admin" user={user} />;
}
