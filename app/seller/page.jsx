import RolePlaceholder from "@/components/dashboard/RolePlaceholder";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Dashboard Penjual" };
export const dynamic = "force-dynamic";

export default async function PenjualDashboardPage() {
  const user = await requireRole(["seller"]);
  return <RolePlaceholder roleLabel="Penjual" user={user} />;
}
