import PageHeader from "@/components/dashboard/PageHeader";
import NotificationList from "@/components/dashboard/NotificationList";
import { requireRole } from "@/lib/auth";
import { listNotifications } from "@/lib/repositories/notifications";

export const metadata = { title: "Notifikasi Penjual" };
export const dynamic = "force-dynamic";

export default async function SellerNotificationsPage() {
  const me = await requireRole(["seller"]);
  const notifications = await listNotifications(me.id);

  return (
    <>
      <PageHeader
        title="Notifikasi"
        description="Pemberitahuan dari Admin dan informasi penting terkait toko maupun produk Anda."
      />
      <NotificationList notifications={notifications} />
    </>
  );
}