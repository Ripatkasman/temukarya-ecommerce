"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, LayoutDashboard, User, ShoppingCart, Heart, ClipboardList, MapPin,
  Store, Package, Inbox, Users, BadgeCheck, Tags, Eye, Home, Bell,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import RouteTransition from "@/components/ui/RouteTransition";
import { cn } from "@/lib/cn";

const ICONS = {
  overview: LayoutDashboard, profile: User, cart: ShoppingCart, wishlist: Heart,
  orders: ClipboardList, address: MapPin, store: Store, products: Package,
  incoming: Inbox, notifications: Bell, users: Users, verify: BadgeCheck, categories: Tags, monitor: Eye,
};

function NavList({ items, onNavigate }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? LayoutDashboard;
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center justify-between gap-3 rounded-btn px-3 text-sm font-medium transition-colors",
                active ? "bg-primary text-white" : "text-charcoal hover:bg-cream"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {item.label}
              </span>
              {item.badge > 0 && (
                <span
                  className={cn(
                    "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold",
                    active ? "bg-white text-primary" : "bg-error text-white"
                  )}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardShell({ roleLabel, userName, items, logoutSlot, children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-4 pt-5">
        <BrandLogo />
        <p className="mt-4 text-caption font-semibold text-muted-strong">{roleLabel}</p>
        {userName && <p className="truncate text-sm font-semibold text-charcoal">{userName}</p>}
      </div>
      <nav aria-label={`Menu ${roleLabel}`} className="flex-1 overflow-y-auto px-3 pb-4">
        <NavList items={items} onNavigate={() => setOpen(false)} />
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex min-h-11 items-center gap-3 rounded-btn px-3 text-sm font-medium text-charcoal transition-colors hover:bg-cream"
        >
          <Home className="size-5 shrink-0 text-muted-strong" aria-hidden="true" />
          Ke Beranda
        </Link>
        {logoutSlot}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-surface lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <BrandLogo markClassName="size-8" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu dashboard"
          aria-expanded={open}
          className="flex size-11 items-center justify-center rounded-btn hover:bg-cream"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Menu dashboard"
      >
        <div
          className="absolute inset-0 bg-charcoal/50 backdrop-blur-[1px] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85%] bg-surface shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="absolute right-2 top-3 flex size-11 items-center justify-center rounded-btn hover:bg-cream"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          {sidebar}
        </div>
      </div>

      <main id="konten" className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <RouteTransition>{children}</RouteTransition>
      </main>
    </div>
  );
}