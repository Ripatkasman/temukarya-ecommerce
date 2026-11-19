import RolePlaceholder from "@/components/dashboard/RolePlaceholder";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Dashboard Pembeli" };
export const dynamic = "force-dynamic";

export default async function PembeliDashboardPage() {
  const user = await requireRole(["buyer"]);
  return <RolePlaceholder roleLabel="Pembeli" user={user} />;
}
