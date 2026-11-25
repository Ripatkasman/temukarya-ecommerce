import PageHeader from "@/components/dashboard/PageHeader";
import NotificationList from "@/components/dashboard/NotificationList";
import { requireRole } from "@/lib/auth";
import { listNotifications } from "@/lib/repositories/notifications";

export const metadata = { title: "Notifikasi Saya" };
export const dynamic = "force-dynamic";

export default async function BuyerNotificationsPage() {
  const me = await requireRole(["buyer"]);
  const notifications = await listNotifications(me.id);

  return (
    <>
      <PageHeader
        title="Notifikasi"
        description="Pemberitahuan penting terkait akun dan aktivitas Anda di TemuKarya."
      />
      <NotificationList notifications={notifications} />
    </>
  );
}