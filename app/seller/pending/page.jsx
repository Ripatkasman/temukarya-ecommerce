import { redirect } from "next/navigation";
import { Hourglass, ShieldX } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/ui/SubmitButton";
import { SellerStatusBadge } from "@/components/ui/StatusBadges";
import DeleteAccountButton from "@/components/auth/DeleteAccountButton";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export const metadata = { title: "Status akun penjual" };
export const dynamic = "force-dynamic";

/**
 * Halaman untuk seller yang belum disetujui.
 * Seller 'approved' dialihkan ke dashboard; non-seller dialihkan oleh requireRole.
 */
export default async function SellerStatusPage() {
  const user = await requireRole(["seller"], { allowUnapprovedSeller: true });
  if (user.sellerStatus === "approved") redirect("/seller");

  const rejected = user.sellerStatus === "rejected";
  const Icon = rejected ? ShieldX : Hourglass;

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <BrandLogo />
          <form action={logoutAction}>
            <SubmitButton variant="ghost" size="sm">Keluar</SubmitButton>
          </form>
        </div>
      </header>
      <main id="konten" className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-xl rounded-card border border-line bg-surface p-6 text-center sm:p-10">
          <span className={`mx-auto flex size-16 items-center justify-center rounded-full ${rejected ? "bg-error-soft text-error-strong" : "bg-warning-soft text-warning-strong"}`}>
            <Icon className="size-8" aria-hidden="true" />
          </span>
          <div className="mt-4 flex justify-center"><SellerStatusBadge status={user.sellerStatus} /></div>
          <h1 className="text-page-title mt-4">
            {rejected ? "Pendaftaran toko belum dapat disetujui" : "Akun Anda sedang ditinjau."}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-strong">
            {rejected
              ? "Pendaftaran toko Anda belum dapat disetujui. Anda dapat menghapus akun ini, lalu mendaftar kembali dengan data yang diperbarui."
              : "Terima kasih telah bergabung dengan TemuKarya. Akun Anda sedang ditinjau oleh tim Admin. Dashboard toko akan tersedia setelah proses verifikasi selesai."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/products" variant="outline">Lihat produk</Button>
            {rejected && <DeleteAccountButton />}
          </div>
        </div>
      </main>
    </div>
  );
}
