"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { loginAction } from "@/lib/actions/auth";

export default function LoginForm({ next = "" }) {
  const [state, formAction] = useActionState(loginAction, null);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.message && (
        <div role="alert" className="flex items-start gap-2.5 rounded-btn border border-error/30 bg-error-soft px-4 py-3 text-sm font-medium text-error-strong">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}
      <input type="hidden" name="next" value={next} />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email ?? ""}
        error={errors.email}
        placeholder="nama@email.com"
      />
      <div className="space-y-1.5">
        <PasswordInput
          id="password"
          name="password"
          label="Kata sandi"
          autoComplete="current-password"
          required
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>
      </div>
      <SubmitButton size="lg" loadingLabel="Memeriksa…" className="w-full">Masuk</SubmitButton>
      <p className="text-center text-sm text-muted-strong">
        Belum punya akun?{" "}
        <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="font-semibold text-primary underline-offset-4 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}