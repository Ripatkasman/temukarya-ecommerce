import BrandLogo from "@/components/brand/BrandLogo";

/** Kerangka halaman login/register: panel merek di kiri (layar lebar), form di kanan. */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-cream lg:flex">
        <BrandLogo light />
        <div className="max-w-md">
          <p className="font-heading text-3xl font-bold leading-tight text-white">
            Tempat karya lokal bertemu kepercayaan.
          </p>
          <p className="mt-4 text-cream/90">
            Penjual ditinjau admin sebelum berjualan, dan pembeli bisa melihat informasi toko serta ulasan sebelum memutuskan.
          </p>
        </div>
        <p className="text-caption text-cream/80">Where Local Dreams Meet Opportunities.</p>
      </aside>
      <div className="flex flex-col">
        <div className="border-b border-line px-4 py-4 sm:px-6 lg:hidden">
          <BrandLogo />
        </div>
        <main id="konten" className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 lg:items-center">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
