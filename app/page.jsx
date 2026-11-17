import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

/**
 * SEMENTARA (Fase 2). Beranda publik yang sebenarnya dibuat di Fase 3.
 * Halaman ini hanya memastikan fondasi desain berjalan.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="konten" className="container-page py-20">
        <p className="text-sm font-semibold text-primary">Fase 2: fondasi desain</p>
        <h1 className="text-display mt-3 max-w-3xl">Temukan Karya, Dukung Cerita di Baliknya.</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-strong">
          Jelajahi produk unik dari pelaku usaha lokal dan kreator independen. Temukan sesuatu yang bermakna,
          sekaligus dukung mereka untuk terus berkembang.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/design-system" size="lg">Lihat design system</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
