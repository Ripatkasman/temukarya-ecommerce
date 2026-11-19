import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/States";
import { SearchX } from "lucide-react";

export const metadata = { title: "Halaman tidak ditemukan" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="konten" className="container-page py-16">
        <EmptyState
          icon={SearchX}
          title="Halaman tidak ditemukan"
          description="Alamat yang kamu buka tidak ada atau sudah dipindahkan."
          actionLabel="Kembali ke beranda"
          actionHref="/"
        />
      </main>
      <Footer />
    </>
  );
}
