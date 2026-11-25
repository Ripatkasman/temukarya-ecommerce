"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { TriangleAlert, CircleCheck, KeyRound, Copy, Check } from "lucide-react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";
import { resetPasswordAction } from "@/lib/actions/auth";

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, null);
  const [copied, setCopied] = useState(false);

  const errors = state?.errors ?? {};
  const v = state?.values ?? {};

  async function handleCopy() {
    if (!state?.nextRecoveryCode) return;
    try {
      await navigator.clipboard.writeText(state.nextRecoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Abaikan jika clipboard tidak tersedia
    }
  }

  if (state?.ok) {
    return (
      <div className="space-y-5">
        <div role="status" className="flex items-start gap-2.5 rounded-btn border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success-strong">
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>Kata sandi berhasil diperbarui! Silakan masuk menggunakan kata sandi barumu.</p>
        </div>

        {/* Tampilkan kode pemulihan 6 angka yang baru dirotasi */}
        <div className="rounded-card border-2 border-dashed border-primary/40 bg-cream px-4 py-5 text-center">
          <div className="mb-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <KeyRound className="size-4" aria-hidden="true" />
            Kode Pemulihan Baru (6 Angka)
          </div>
          <p className="font-mono text-3xl font-bold tracking-[0.35em] text-charcoal select-all">
            {state.nextRecoveryCode}
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
                Salin kode baru
              </>
            )}
          </button>
          <p className="mt-2.5 text-xs text-muted-strong">
            Demi keamanan, kode pemulihan lamamu sudah diganti dengan kode baru di atas. Catat sebelum melanjutkan.
          </p>
        </div>

        <Button href="/login" size="lg" className="w-full">
          Lanjut ke Halaman Masuk
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.message && (
        <div role="alert" className="flex items-start gap-2.5 rounded-btn border border-error/30 bg-error-soft px-4 py-3 text-sm font-medium text-error-strong">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}

      <Input
        id="email"
        name="email"
        type="email"
        label="Email terdaftar"
        autoComplete="email"
        required
        defaultValue={v.email ?? ""}
        error={errors.email}
        placeholder="nama@email.com"
      />

      <Input
        id="recoveryCode"
        name="recoveryCode"
        type="text"
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        label="Kode pemulihan (6 angka)"
        required
        placeholder="Contoh: 482910"
        hint="Masukkan 6 digit angka yang kamu dapatkan saat mendaftar."
        error={errors.recoveryCode}
      />

      <PasswordInput
        id="newPassword"
        name="newPassword"
        label="Kata sandi baru"
        autoComplete="new-password"
        required
        hint="Minimal 8 karakter, berisi huruf dan angka."
        error={errors.newPassword}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Ulangi kata sandi baru"
        autoComplete="new-password"
        required
        error={errors.confirmPassword}
      />

      <SubmitButton size="lg" loadingLabel="Memproses…" className="w-full">
        Atur Ulang Kata Sandi
      </SubmitButton>

      <p className="text-center text-sm text-muted-strong">
        Ingat kata sandimu?{" "}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Kembali ke Masuk
        </Link>
      </p>
    </form>
  );
}