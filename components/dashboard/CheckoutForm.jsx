"use client";

import { useState } from "react";
import Link from "next/link";
import { ServerForm, TextField, AreaField, SubmitBtn } from "./ServerForm";
import Select from "@/components/ui/Select";
import { checkoutAction } from "@/lib/actions/buyer";

/**
 * Form checkout dengan pilihan alamat tersimpan. Memilih alamat hanya MENGISI kolom di bawahnya;
 * yang dikirim dan divalidasi server tetap isi kolom-kolom itu, lalu disimpan sebagai salinan di pesanan
 * (jadi mengubah/menghapus alamat nanti tidak mengubah pesanan yang sudah dibuat).
 */
export default function CheckoutForm({ addresses, profile }) {
  const initial = addresses.find((a) => a.is_default) ?? null;
  const [choice, setChoice] = useState(initial ? initial.id : "");
  const [name, setName] = useState(initial?.recipient_name ?? profile.name);
  const [phone, setPhone] = useState(initial?.phone ?? profile.phone);
  const [address, setAddress] = useState(initial?.full_address ?? "");

  function pick(id) {
    setChoice(id);
    const a = addresses.find((x) => x.id === id);
    if (a) {
      setName(a.recipient_name);
      setPhone(a.phone);
      setAddress(a.full_address);
    }
  }

  return (
    <ServerForm action={checkoutAction}>
      {addresses.length > 0 ? (
        <Select
          id="addressChoice"
          name="addressChoice"
          label="Alamat tersimpan"
          value={choice}
          onChange={(e) => pick(e.target.value)}
          placeholder="Isi manual"
          options={addresses.map((a) => ({ value: a.id, label: `${a.label}${a.is_default ? " (utama)" : ""} - ${a.recipient_name}` }))}
          hint="Memilih alamat akan mengisi kolom di bawah. Anda tetap bisa mengubahnya."
        />
      ) : (
        <p className="rounded-btn bg-cream px-3 py-2 text-sm text-muted-strong">
          Belum punya alamat tersimpan. <Link href="/buyer/addresses" className="font-semibold text-primary underline">Tambah alamat</Link> agar checkout berikutnya lebih cepat.
        </p>
      )}
      <TextField name="recipientName" label="Nama penerima" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField name="recipientPhone" label="Nomor telepon" required value={phone} onChange={(e) => setPhone(e.target.value)} />
      <AreaField name="shippingAddress" label="Alamat pengiriman" required rows={3} maxLength={500} value={address} onChange={(e) => setAddress(e.target.value)} hint="Tulis alamat lengkap: jalan, kelurahan, kota, kode pos." />
      <AreaField name="notes" label="Catatan untuk penjual (opsional)" rows={2} maxLength={300} />
      <SubmitBtn size="lg" loadingLabel="Memproses…" className="w-full">Buat pesanan</SubmitBtn>
    </ServerForm>
  );
}
