import { Wrench } from "lucide-react";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/ui/SubmitButton";
import BrandLogo from "@/components/brand/BrandLogo";
import { EmptyState } from "@/components/ui/States";
import { logoutAction } from "@/lib/actions/auth";

/**
 * SEMENTARA (Fase 3): penanda halaman dashboard yang dibangun di Fase 4.
 * Ada agar redirect setelah login dan penjagaan role bisa diuji. Hapus saat dashboard asli dibuat.
 */
export default function RolePlaceholder({ roleLabel, user }) {
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
      <main id="konten" className="container-page py-12">
        <p className="mb-4 text-sm text-muted-strong">Masuk sebagai {user.fullName} ({user.email})</p>
        <EmptyState
          icon={Wrench}
          title={`Dashboard ${roleLabel} belum dibuat`}
          description="Halaman ini dibangun pada Fase 4. Login dan penjagaan role sudah aktif."
        />
        <div className="mt-6 flex justify-center">
          <Button href="/" variant="outline">Ke beranda</Button>
        </div>
      </main>
    </div>
  );
}
