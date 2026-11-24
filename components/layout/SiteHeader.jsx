import Navbar from "./Navbar";
import SubmitButton from "@/components/ui/SubmitButton";
import { getCurrentUser, homePathFor } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { getCartCount } from "@/lib/repositories/buyer";
import LogoutConfirmButton from "@/components/auth/LogoutConfirmButton";

/** Navbar yang sadar sesi: menampilkan Masuk/Daftar untuk guest, Dashboard + Keluar untuk user. */
export default async function SiteHeader() {
  const user = await getCurrentUser();
  const cartCount = user?.role === "buyer" ? await getCartCount(user.id) : null;
  return (
    <Navbar
      cartCount={cartCount}
      user={user ? { fullName: user.fullName, dashboardHref: homePathFor(user) } : null}
      logoutSlot={
        user ? (
          <LogoutConfirmButton variant="ghost" size="sm" />
        ) : null
      }
    />
  );
}
