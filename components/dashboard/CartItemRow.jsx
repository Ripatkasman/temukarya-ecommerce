"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, TriangleAlert } from "lucide-react";
import ProductImage from "@/components/commerce/ProductImage";
import PriceDisplay from "@/components/commerce/PriceDisplay";
import { useToast } from "@/components/ui/Toast";
import { setCartQuantityAction, removeCartItemAction } from "@/lib/actions/buyer";
import { formatRupiah } from "@/lib/format";

/** Satu baris keranjang: ubah jumlah dan hapus. Perubahan disimpan ke database; toast hanya untuk hasil nyata. */
export default function CartItemRow({ item }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [qty, setQty] = useState(item.quantity);

  function change(next) {
    if (next < 1 || next > item.stock || pending) return;
    const previous = qty;
    setQty(next);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("itemId", item.itemId);
      fd.set("quantity", String(next));
      const res = await setCartQuantityAction(null, fd);
      if (!res?.ok) {
        setQty(previous); // kembalikan jika server menolak
        toast.error(res?.message ?? "Jumlah belum bisa diubah.");
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("itemId", item.itemId);
      const res = await removeCartItemAction(null, fd);
      if (res?.ok) toast.success(res.message);
      else toast.error(res?.message ?? "Produk belum bisa dihapus.");
    });
  }

  return (
    <li className="flex gap-4 rounded-card border border-line bg-surface p-3 sm:p-4">
      <Link href={`/products/${item.productId}`} className="size-20 shrink-0 overflow-hidden rounded-btn border border-line sm:size-24" tabIndex={-1}>
        <ProductImage src={item.imageUrl} alt={item.name} className="size-full" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/products/${item.productId}`} className="text-card-title line-clamp-2 hover:text-primary">{item.name}</Link>
        <p className="text-caption text-muted-strong">{item.storeName}</p>
        <PriceDisplay value={item.price} size="sm" />
        {!item.available && (
          <p className="mt-1 flex items-center gap-1.5 text-caption font-medium text-error-strong"><TriangleAlert className="size-3.5" aria-hidden="true" />Produk sudah tidak tersedia. Hapus dari keranjang.</p>
        )}
        {item.available && !item.enough && (
          <p className="mt-1 flex items-center gap-1.5 text-caption font-medium text-warning-strong"><TriangleAlert className="size-3.5" aria-hidden="true" />Stok tinggal {item.stock}. Kurangi jumlahnya.</p>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex h-11 items-center rounded-btn border border-line">
            <button type="button" onClick={() => change(qty - 1)} disabled={pending || qty <= 1} aria-label={`Kurangi jumlah ${item.name}`} className="flex size-11 items-center justify-center rounded-l-btn hover:bg-cream disabled:opacity-40">
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-10 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => change(qty + 1)} disabled={pending || qty >= item.stock} aria-label={`Tambah jumlah ${item.name}`} className="flex size-11 items-center justify-center rounded-r-btn hover:bg-cream disabled:opacity-40">
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="font-heading font-bold">{formatRupiah(item.price * qty)}</p>
          <button type="button" onClick={remove} disabled={pending} className="inline-flex min-h-11 items-center gap-1.5 rounded-btn px-2 text-sm font-medium text-error-strong hover:bg-error-soft disabled:opacity-50">
            <Trash2 className="size-4" aria-hidden="true" />Hapus
          </button>
        </div>
      </div>
    </li>
  );
}
