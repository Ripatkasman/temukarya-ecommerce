import DashboardShell from "./DashboardShell";
import LogoutConfirmButton from "@/components/auth/LogoutConfirmButton";
import { getUnreadNotificationCount } from "@/lib/repositories/notifications";

export const NAV = {
  buyer: [
    { href: "/buyer", label: "Ringkasan", icon: "overview", exact: true },
    { href: "/buyer/profile", label: "Profil Saya", icon: "profile" },
    { href: "/buyer/addresses", label: "Alamat Saya", icon: "address" },
    { href: "/buyer/wishlist", label: "Favorit", icon: "wishlist" },
    { href: "/buyer/cart", label: "Keranjang", icon: "cart" },
    { href: "/buyer/orders", label: "Riwayat Pesanan", icon: "orders" },
    { href: "/buyer/notifications", label: "Notifikasi", icon: "notifications" },
  ],
  seller: [
    { href: "/seller", label: "Ringkasan", icon: "overview", exact: true },
    { href: "/seller/store", label: "Toko Saya", icon: "store" },
    { href: "/seller/products", label: "Produk Saya", icon: "products" },
    { href: "/seller/orders", label: "Pesanan Masuk", icon: "incoming" },
    { href: "/seller/notifications", label: "Notifikasi", icon: "notifications" },
  ],
  admin: [
    { href: "/admin", label: "Ringkasan", icon: "overview", exact: true },
    { href: "/admin/users", label: "Pengguna", icon: "users" },
    { href: "/admin/sellers", label: "Verifikasi Seller", icon: "verify" },
    { href: "/admin/products", label: "Produk", icon: "products" },
    { href: "/admin/categories", label: "Kategori", icon: "categories" },
  ],
};

const LABELS = { buyer: "Dashboard Pembeli", seller: "Dashboard Penjual", admin: "Dashboard Admin" };

/**
 * Kerangka dashboard per role. `user` sudah lolos requireRole() di layout pemanggil;
 * navigasi di sini hanya tampilan, penjagaan sebenarnya ada di server.
 */
export default async function RoleLayout({ role, user, children }) {
  const unreadCount =
    role === "buyer" || role === "seller"
      ? await getUnreadNotificationCount(user.id)
      : 0;

  const items = NAV[role].map((item) =>
    item.icon === "notifications" ? { ...item, badge: unreadCount } : item
  );

  return (
    <DashboardShell
      roleLabel={LABELS[role]}
      userName={user.fullName}
      items={items}
      logoutSlot={
        <LogoutConfirmButton
          variant="ghost"
          size="md"
          iconClassName="size-5"
          fullWidth
        />
      }
    >
      {children}
    </DashboardShell>
  );
}