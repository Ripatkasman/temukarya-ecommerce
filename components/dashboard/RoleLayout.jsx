import DashboardShell from "./DashboardShell";
import SubmitButton from "@/components/ui/SubmitButton";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export const NAV = {
  buyer: [
    { href: "/buyer", label: "Ringkasan", icon: "overview", exact: true },
    { href: "/buyer/profile", label: "Profil Saya", icon: "profile" },
    { href: "/buyer/cart", label: "Keranjang", icon: "cart" },
    { href: "/buyer/orders", label: "Riwayat Pesanan", icon: "orders" },
  ],
  seller: [
    { href: "/seller", label: "Ringkasan", icon: "overview", exact: true },
    { href: "/seller/store", label: "Toko Saya", icon: "store" },
    { href: "/seller/products", label: "Produk Saya", icon: "products" },
    { href: "/seller/orders", label: "Pesanan Masuk", icon: "incoming" },
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
export default function RoleLayout({ role, user, children }) {
  return (
    <DashboardShell
      roleLabel={LABELS[role]}
      userName={user.fullName}
      items={NAV[role]}
      logoutSlot={
        <form action={logoutAction}>
          <SubmitButton variant="ghost" className="w-full justify-start">
            <LogOut className="size-5" aria-hidden="true" />
            Keluar
          </SubmitButton>
        </form>
      }
    >
      {children}
    </DashboardShell>
  );
}
