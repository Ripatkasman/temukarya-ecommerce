"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { toggleWishlistAction } from "@/lib/actions/wishlist";
import { cn } from "@/lib/cn";

/**
 * Tombol hati untuk buyer. Status awal dari server; setelah klik, tampilan mengikuti hasil NYATA
 * dari server (bukan tebakan), dan dikembalikan jika gagal.
 */
export default function WishlistButton({ productId, productName, initial = false, className, withLabel = false }) {
  const toast = useToast();
  const [on, setOn] = useState(initial);
  const [pending, startTransition] = useTransition();

  function click(e) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("productId", productId);
      const res = await toggleWishlistAction(null, fd);
      if (res?.ok) {
        setOn(Boolean(res.data?.wishlisted));
        toast.success(res.message);
      } else {
        toast.error(res?.message ?? "Favorit belum bisa diubah.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={click}
      aria-pressed={on}
      aria-label={on ? `Hapus ${productName} dari favorit` : `Tambahkan ${productName} ke favorit`}
      disabled={pending}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full bg-surface/95 text-charcoal shadow-sm ring-1 ring-line transition-colors hover:text-error disabled:opacity-60",
        withLabel ? "min-h-11 px-4 text-sm font-semibold" : "size-11",
        className
      )}
    >
      <Heart className={cn("size-5", on && "fill-error text-error")} aria-hidden="true" />
      {withLabel && <span>{on ? "Di favorit" : "Simpan ke favorit"}</span>}
    </button>
  );
}
