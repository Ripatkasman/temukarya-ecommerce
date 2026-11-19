"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Store, TriangleAlert } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import PasswordInput from "@/components/ui/PasswordInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { registerAction } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const TYPES = [
  { value: "buyer", label: "Pembeli", desc: "Jelajahi dan beli karya lokal.", icon: ShoppingBag },
  { value: "seller", label: "Penjual", desc: "Buka toko. Perlu persetujuan admin.", icon: Store },
];

/** Form registrasi Buyer/Seller. Admin tidak bisa dipilih; validasi final dilakukan di server. */
export default function RegisterForm({ initialType = "buyer" }) {
  const [state, formAction] = useActionState(registerAction, null);
  const [type, setType] = useState(state?.values?.accountType || initialType);
  const errors = state?.errors ?? {};
  const v = state?.values ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.message && (
        <div role="alert" className="flex items-start gap-2.5 rounded-btn border border-error/30 bg-error-soft px-4 py-3 text-sm font-medium text-error-strong">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Daftar sebagai</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map(({ value, label, desc, icon: Icon }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="accountType"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-full items-start gap-3 rounded-card border bg-surface p-4 transition-colors",
                  "peer-checked:border-primary peer-checked:bg-primary-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                  "border-line hover:border-primary/60"
                )}
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-caption text-muted-strong">{desc}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.accountType && <p role="alert" className="mt-1.5 text-caption font-medium text-error-strong">{errors.accountType}</p>}
      </fieldset>

      <Input id="fullName" name="fullName" label="Nama lengkap" autoComplete="name" required maxLength={100} defaultValue={v.fullName ?? ""} error={errors.fullName} />
      <Input id="email" name="email" type="email" label="Email" autoComplete="email" required defaultValue={v.email ?? ""} error={errors.email} placeholder="nama@email.com" />
      <PasswordInput id="password" name="password" label="Kata sandi" autoComplete="new-password" required hint="Minimal 8 karakter, berisi huruf dan angka." error={errors.password} />
      <PasswordInput id="confirmPassword" name="confirmPassword" label="Ulangi kata sandi" autoComplete="new-password" required error={errors.confirmPassword} />

      {type === "seller" && (
        <div className="space-y-5 rounded-card border border-line bg-cream/60 p-4 sm:p-5">
          <div>
            <h2 className="text-card-title">Tentang tokomu</h2>
            <p className="mt-1 text-caption text-muted-strong">
              Admin akan meninjau pendaftaranmu sebelum dashboard toko dibuka. Persetujuan hanya memverifikasi akun penjual, bukan menjamin kualitas produk.
            </p>
          </div>
          <Input id="storeName" name="storeName" label="Nama toko" required maxLength={100} defaultValue={v.storeName ?? ""} error={errors.storeName} />
          <Textarea id="storeDescription" name="storeDescription" label="Deskripsi toko (opsional)" rows={3} maxLength={500} defaultValue={v.storeDescription ?? ""} error={errors.storeDescription} hint="Ceritakan singkat karya dan siapa yang membuatnya." />
        </div>
      )}

      <SubmitButton size="lg" loadingLabel="Mendaftarkan…" className="w-full">
        {type === "seller" ? "Daftarkan toko" : "Buat akun"}
      </SubmitButton>
      <p className="text-center text-sm text-muted-strong">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">Masuk</Link>
      </p>
    </form>
  );
}
