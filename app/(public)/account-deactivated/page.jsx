import { redirect } from "next/navigation";
import { ShieldBan } from "lucide-react";
import Button from "@/components/ui/Button";
import { getCurrentUser, homePathFor } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export const metadata = { title: "Akun Dinonaktifkan" };

export default async function AccountDeactivatedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.isActive !== false) redirect(homePathFor(user));

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-card border border-error/40 bg-surface p-6 text-center sm:p-8">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-error-soft text-error">
          <ShieldBan className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-page-title mt-4">Akun Anda Dinonaktifkan</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-strong">
          Halo <span className="font-semibold text-charcoal">{user.fullName}</span>, akun Anda sementara dinonaktifkan oleh Administrator TemuKarya karena terindikasi melanggar ketentuan platform.
        </p>
        <p className="mt-2 text-sm text-muted-strong">
          Selama akun dinonaktifkan, Anda tidak dapat mengakses dashboard maupun melakukan transaksi. Hubungi tim dukungan TemuKarya jika Anda merasa ini adalah kekeliruan.
        </p>
        <form action={logoutAction} className="mt-6">
          <Button type="submit" variant="outline">Keluar dari Akun</Button>
        </form>
      </div>
    </div>
  );
}