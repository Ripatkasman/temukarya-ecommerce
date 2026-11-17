"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const PUBLIC_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Jelajahi Produk" },
  { href: "/about", label: "Tentang TemuKarya" },
];

/**
 * Navbar publik.
 * `user` (opsional): { fullname, dashboardHref }. Jika ada, tampilkan tautan dashboard
 * dan `logoutSlot` (mis. form dengan Server Action logout) menggantikan tombol Masuk/Daftar.
 */
export default function Navbar({ user = null, logoutSlot = null, className }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur", className)}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <BrandLogo />

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-btn px-3.5 py-2 text-sm font-medium text-charcoal hover:bg-cream hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button href={user.dashboardHref} variant="secondary" size="sm">
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </Button>
              {logoutSlot}
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">Masuk</Button>
              <Button href="/register" size="sm">Daftar</Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-btn text-charcoal hover:bg-cream md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-canvas md:hidden">
          <nav aria-label="Navigasi seluler" className="container-page flex flex-col gap-1 py-3">
            {PUBLIC_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-btn px-3 text-base font-medium hover:bg-cream">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
              {user ? (
                <>
                  <Button href={user.dashboardHref} variant="secondary">Dashboard</Button>
                  {logoutSlot}
                </>
              ) : (
                <>
                  <Button href="/login" variant="outline">Masuk</Button>
                  <Button href="/register">Daftar</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
