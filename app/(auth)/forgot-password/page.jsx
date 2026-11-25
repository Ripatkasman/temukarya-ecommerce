import { redirect } from "next/navigation";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { getCurrentUser, landingPathFor } from "@/lib/auth";

export const metadata = { title: "Lupa Kata Sandi" };

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect(landingPathFor(user));

  return (
    <>
      <h1 className="text-page-title">Atur ulang kata sandi</h1>
      <p className="mt-1 text-sm text-muted-strong">
        Masukkan email terdaftar beserta kode pemulihan 6 angka untuk membuat kata sandi baru.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </>
  );
}