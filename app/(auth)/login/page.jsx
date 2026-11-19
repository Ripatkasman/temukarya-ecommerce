import { redirect } from "next/navigation";
import { CircleCheck, Info } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser, landingPathFor, safeNextPath } from "@/lib/auth";

export const metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(landingPathFor(user));

  const nextRaw = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeNextPath(nextRaw) ?? "";
  const accountDeleted = sp.info === "akun-dihapus";
  const needsLoginForCart = next.startsWith("/products/");

  return (
    <>
      <h1 className="text-page-title">Masuk ke TemuKarya</h1>
      <p className="mt-1 text-sm text-muted-strong">Gunakan email dan kata sandi akunmu.</p>

      {accountDeleted && (
        <div role="status" className="mt-5 flex items-start gap-2.5 rounded-btn border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success-strong">
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>Akunmu sudah dihapus.</p>
        </div>
      )}
      {needsLoginForCart && (
        <div role="status" className="mt-5 flex items-start gap-2.5 rounded-btn border border-line bg-cream px-4 py-3 text-sm text-charcoal">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>Masuk dengan akun pembeli untuk menambahkan produk ke keranjang.</p>
        </div>
      )}

      <div className="mt-6">
        <LoginForm next={next} />
      </div>
    </>
  );
}
