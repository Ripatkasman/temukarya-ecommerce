import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser, landingPathFor } from "@/lib/auth";

export const metadata = { title: "Daftar" };

export default async function RegisterPage({ searchParams }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(landingPathFor(user));

  const typeRaw = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const initialType = typeRaw === "seller" ? "seller" : "buyer";

  return (
    <>
      <h1 className="text-page-title">Buat akun TemuKarya</h1>
      <p className="mt-1 text-sm text-muted-strong">Pilih jenis akun, lalu isi data dirimu.</p>
      <div className="mt-6">
        <RegisterForm initialType={initialType} />
      </div>
    </>
  );
}
