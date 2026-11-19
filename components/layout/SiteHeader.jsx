import Navbar from "./Navbar";
import SubmitButton from "@/components/ui/SubmitButton";
import { getCurrentUser, homePathFor } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

/** Navbar yang sadar sesi: menampilkan Masuk/Daftar untuk guest, Dashboard + Keluar untuk user. */
export default async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <Navbar
      user={user ? { fullName: user.fullName, dashboardHref: homePathFor(user) } : null}
      logoutSlot={
        user ? (
          <form action={logoutAction}>
            <SubmitButton variant="ghost" size="sm" className="w-full md:w-auto">Keluar</SubmitButton>
          </form>
        ) : null
      }
    />
  );
}
