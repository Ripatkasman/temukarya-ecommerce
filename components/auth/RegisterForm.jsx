"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Store, TriangleAlert, KeyRound, Copy, Check, ArrowRight } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import PasswordInput from "@/components/ui/PasswordInput";
import SubmitButton from "@/components/ui/SubmitButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { registerAction, completeRegisterSessionAction } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

const TYPES = [
  { value: "buyer", label: "Pembeli", desc: "Jelajahi dan beli karya lokal.", icon: ShoppingBag },
  { value: "seller", label: "Penjual", desc: "Buka toko. Perlu persetujuan admin.", icon: Store },
];

export default function RegisterForm({ initialType = "buyer" }) {
  const [state, formAction] = useActionState(registerAction, null);
  const [type, setType] = useState(state?.values?.accountType || initialType);
  const [copied, setCopied] = useState(false);
  const [continuing, setContinuing] = useState(false);

  const errors = state?.errors ?? {};
  const v = state?.values ?? {};
  const showRecoveryModal = Boolean(state?.ok && state?.recoveryCode);

  async function handleCopy() {
    if (!state?.recoveryCode) return;
    try {
      await navigator.clipboard.writeText(state.recoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback jika clipboard diblokir browser
    }
  }

  async function handleContinue() {
    if (continuing) return;
    setContinuing(true);
    await completeRegisterSessionAction(state?.userId, state?.redirectTo);
  }

  return (
    <>
      <form action={formAction} noValidate className="space-y-5">
        {state?.message && !state?.ok && (
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

      {/* Popup Kode Pemulihan 6 Angka setelah pendaftaran berhasil */}
      <Modal
        open={showRecoveryModal}
        onClose={handleContinue}
        title="Simpan Kode Pemulihan Akunmu"
        description="Gunakan kode 6 angka ini jika suatu saat kamu lupa kata sandi. Kode hanya ditampilkan sekali."
        footer={
          <Button
            type="button"
            onClick={handleContinue}
            disabled={continuing}
            className="w-full sm:w-auto"
          >
            {continuing ? "Mengalihkan…" : "Saya Sudah Mencatat, Lanjutkan"}
            {!continuing && <ArrowRight className="size-4" aria-hidden="true" />}
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/40 bg-cream px-4 py-5 text-center">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <KeyRound className="size-4" aria-hidden="true" />
              Kode Pemulihan 6 Angka
            </div>
            <p className="font-mono text-3xl font-bold tracking-[0.35em] text-charcoal select-all">
              {state?.recoveryCode}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 inline-flex items-center gap-1.5 rounded-btn border border-line bg-surface px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-cream"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" />
                  Salin kode
                </>
              )}
            </button>
          </div>

          <p className="text-xs leading-relaxed text-muted-strong">
            Catat atau simpan di tempat aman. Jangan bagikan kode ini kepada siapa pun karena dapat digunakan untuk mengatur ulang kata sandi akunmu.
          </p>
        </div>
      </Modal>
    </>
  );
}