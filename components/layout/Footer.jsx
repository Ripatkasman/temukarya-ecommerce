import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";

const COLUMNS = [
  {
    title: "Jelajahi",
    links: [
      { href: "/products", label: "Semua produk" },
      { href: "/about", label: "Tentang TemuKarya" },
    ],
  },
  {
    title: "Penjual",
    links: [
      { href: "/register", label: "Mulai ceritakan karyamu" },
      { href: "/login", label: "Masuk ke dashboard toko" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-primary text-cream">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <BrandLogo light href="/" />
          <p className="mt-4 text-sm leading-relaxed text-cream/85">
            Tempat Karya Lokal Bertemu Kepercayaan. Temukan produk dari pelaku usaha lokal dan kreator independen.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-heading text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center text-sm text-cream/85 underline-offset-4 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-1 py-5 text-caption text-cream/80 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} TemuKarya. Proyek praktikum Pemrograman Web.</p>
          <p>Pembayaran pada proyek ini hanya simulasi (tanpa payment gateway).</p>
        </div>
      </div>
    </footer>
  );
}
