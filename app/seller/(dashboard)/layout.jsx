import RoleLayout from "@/components/dashboard/RoleLayout";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

// requireRole(["seller"]) hanya meloloskan seller 'approved'; pending/rejected dialihkan ke /seller/pending.
// /seller/pending sengaja berada di luar group ini agar tidak terjadi redirect berulang.
export default async function SellerLayout({ children }) {
  const user = await requireRole(["seller"]);
  return <RoleLayout role="seller" user={user}>{children}</RoleLayout>;
}
