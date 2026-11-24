"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CartItemRow from "./CartItemRow";
import CheckoutForm from "./CheckoutForm";
import { formatRupiah } from "@/lib/format";

export default function CartCheckoutClient({ items, addresses, profile, directProductId = null }) {
  // Jika datang dari tombol "Beli Langsung", otomatis centang produk tersebut; jika tidak, default kosong (Rp 0)
  const [selectedIds, setSelectedIds] = useState(() => {
    if (!directProductId) return [];
    const found = items.find((i) => Number(i.productId) === Number(directProductId));
    return found ? [found.itemId] : [];
  });

  // Pastikan ID yang tersimpan selalu valid dengan daftar item terkini
  const validSelectedIds = useMemo(
    () => selectedIds.filter((id) => items.some((i) => i.itemId === id)),
    [selectedIds, items]
  );

  const allSelected = items.length > 0 && validSelectedIds.length === items.length;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.itemId));
    }
  }

  function toggleOne(itemId) {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }

  const selectedItems = useMemo(
    () => items.filter((i) => validSelectedIds.includes(i.itemId)),
    [items, validSelectedIds]
  );

  const totalSelected = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [selectedItems]
  );

  const blocked = selectedItems.some((i) => !i.available || !i.enough);

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3">
        {/* Bar Pilih Semua */}
        <div className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="size-5 cursor-pointer rounded border-line text-primary accent-primary focus:ring-primary"
            />
            <span>Pilih Semua ({items.length} barang)</span>
          </label>
          <span className="text-caption text-muted-strong">
            Terpilih: <strong>{validSelectedIds.length}</strong> barang
          </span>
        </div>

        {/* Daftar Produk di Keranjang */}
        <ul className="space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.itemId}
              item={item}
              checked={validSelectedIds.includes(item.itemId)}
              onToggle={toggleOne}
            />
          ))}
        </ul>

        {/* Tautan Teks di Bawah Daftar Produk */}
        <div className="pt-1 text-center text-sm text-muted-strong">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            + Jelajahi produk
          </Link>
        </div>
      </div>

      <section aria-labelledby="checkout" className="rounded-card border border-line bg-surface p-5 xl:sticky xl:top-6">
        <h2 id="checkout" className="text-section-title">Checkout</h2>
        <p className="mt-1 text-caption text-muted-strong">
          Pembayaran hanya simulasi (tanpa payment gateway). Hanya barang yang dicentang yang akan diproses menjadi pesanan.
        </p>

        <dl className="my-4 space-y-2 border-y border-line py-3">
          <div className="flex items-center justify-between text-sm text-muted-strong">
            <dt>Barang dipilih</dt>
            <dd>{selectedItems.reduce((sum, i) => sum + i.quantity, 0)} item</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium">Total</dt>
            <dd className="font-heading text-xl font-bold text-primary">{formatRupiah(totalSelected)}</dd>
          </div>
        </dl>

        {blocked && (
          <p role="alert" className="mb-4 rounded-btn bg-warning-soft px-3 py-2 text-sm font-medium text-warning-strong">
            Ada produk yang dipilih stoknya kurang atau tidak tersedia. Perbarui keranjang sebelum checkout.
          </p>
        )}

        <CheckoutForm
          addresses={addresses}
          profile={profile}
          selectedIds={validSelectedIds}
          blocked={blocked}
        />
      </section>
    </div>
  );
}