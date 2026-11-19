"use client";

import { useActionState, useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/components/ui/Toast";
import { addToCartAction } from "@/lib/actions/cart";

/**
 * Form Tambah ke Keranjang untuk buyer yang sudah login.
 * Toast sukses hanya muncul setelah Server Action benar-benar menyimpan ke database.
 * `withQuantity`: tampilkan pemilih jumlah (halaman detail). Tanpa itu, jumlah selalu 1 (kartu produk).
 */
export default function AddToCartForm({ productId, stock, withQuantity = false, className }) {
  const toast = useToast();
  const [state, formAction] = useActionState(addToCartAction, null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!state?.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state, toast]);

  if (stock <= 0) {
    return <Button disabled className={className}>Stok habis</Button>;
  }

  const clamp = (n) => Math.min(Math.max(1, n), stock);

  return (
    <form action={formAction} className={withQuantity ? "flex flex-wrap items-end gap-3" : "w-full"}>
      <input type="hidden" name="productId" value={productId} />
      {withQuantity ? (
        <>
          <div>
            <label htmlFor={`qty-${productId}`} className="mb-1.5 block text-sm font-medium">Jumlah</label>
            <div className="flex h-12 items-center rounded-btn border border-line bg-surface">
              <button
                type="button"
                onClick={() => setQty((q) => clamp(q - 1))}
                disabled={qty <= 1}
                aria-label="Kurangi jumlah"
                className="flex size-11 items-center justify-center rounded-l-btn text-charcoal hover:bg-cream disabled:opacity-40"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <input
                id={`qty-${productId}`}
                name="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={stock}
                value={qty}
                onChange={(e) => setQty(clamp(Math.floor(Number(e.target.value)) || 1))}
                className="h-full w-14 border-x border-line bg-transparent text-center text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQty((q) => clamp(q + 1))}
                disabled={qty >= stock}
                aria-label="Tambah jumlah"
                className="flex size-11 items-center justify-center rounded-r-btn text-charcoal hover:bg-cream disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <SubmitButton size="lg" loadingLabel="Menambahkan…" className={className}>
            <ShoppingCart className="size-5" aria-hidden="true" />
            Tambah ke Keranjang
          </SubmitButton>
        </>
      ) : (
        <>
          <input type="hidden" name="quantity" value="1" />
          <SubmitButton size="sm" loadingLabel="Menambahkan…" className="w-full">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Tambah ke Keranjang
          </SubmitButton>
        </>
      )}
    </form>
  );
}
