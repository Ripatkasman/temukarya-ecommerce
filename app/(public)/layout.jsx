import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";

/** Kerangka halaman publik: navbar sadar sesi, konten utama, footer. */
export default function PublicLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <main id="konten">{children}</main>
      <Footer />
    </>
  );
}
