"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Menu dropdown aksesibel (tombol + daftar aksi).
 * items: [{ label, href? , onClick?, danger? }]
 */
export default function Dropdown({ label, items, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass = (danger) =>
    cn(
      "flex min-h-11 w-full items-center px-4 text-left text-sm hover:bg-cream",
      danger ? "text-error-strong" : "text-charcoal"
    );

  return (
    <div ref={wrapRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-btn border border-line bg-surface px-4 text-sm font-semibold hover:border-primary"
      >
        {label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="menu"
          className={cn(
            "absolute z-30 mt-2 min-w-48 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              {item.href ? (
                <Link role="menuitem" href={item.href} className={itemClass(item.danger)} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <button
                  role="menuitem"
                  type="button"
                  className={itemClass(item.danger)}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
