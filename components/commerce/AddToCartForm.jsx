"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { addToCartAction } from "@/lib/actions/cart";

export default function AddToCartForm({ productId, stock, withQuantity = false }) {
  const router = useRouter();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [isPendingCart, startCartTransition] = useTransition();
  const [isPendingBuy, startBuyTransition] = useTransition();

  const isBusy = isPendingCart || isPendingBuy;

  function handleAddToCart() {
    startCartTransition(async () => {
      const fd = new FormData();
      fd.set("productId", String(productId));
      fd.set("quantity", String(qty));

      const res = await addToCartAction(null, fd);
      if (res?.ok) {
        toast.success(res.message ?? "Produk ditambahkan ke keranjang.");
        router.refresh();
      } else {
        toast.error(res?.message ?? "Gagal menambahkan ke keranjang.");
      }
    });
  }

  function handleBuyNow() {
    startBuyTransition(async () => {
      const fd = new FormData();
      fd.set("productId", String(productId));
      fd.set("quantity", String(qty));

      const res = await addToCartAction(null, fd);
      if (res?.ok) {
        router.push(`/buyer/cart?direct=${productId}`);
      } else {
        toast.error(res?.message ?? "Gagal memproses pembelian langsung.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {withQuantity && (
        <div className="inline-flex h-11 items-center rounded-btn border border-line bg-surface">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || isBusy}
            aria-label="Kurangi jumlah"
            className="flex h-full w-10 items-center justify-center rounded-l-btn text-charcoal hover:bg-cream disabled:opacity-40"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            disabled={qty >= stock || isBusy}
            aria-label="Tambah jumlah"
            className="flex h-full w-10 items-center justify-center rounded-r-btn text-charcoal hover:bg-cream disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
      {/* Tombol Beli Langsung (Hijau) */}
      {withQuantity && (
        <Button
          type="button"
          size="lg"
          variant="primary"
          disabled={isBusy}
          onClick={handleBuyNow}
        >
          {isPendingBuy ? "Memproses..." : "Beli Sekarang"}
        </Button>
      )}
      <Button
        type="button"
        size={withQuantity ? "lg" : "sm"}
        disabled={isBusy}
        onClick={handleAddToCart}
        className="!border-amber-600 !bg-amber-600 !text-white hover:!bg-amber-700 focus-visible:!ring-amber-600"
      >
        <ShoppingCart className={withQuantity ? "size-5" : "size-4"} aria-hidden="true" />
        {isPendingCart ? "Menambahkan..." : "Tambah ke Keranjang"}
      </Button>

      
    </div>
  );
}