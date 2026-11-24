"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/ui/SubmitButton";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

export default function LogoutConfirmButton({
  variant = "ghost",
  size = "sm",
  iconClassName = "size-4",
  className,
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn(fullWidth && "w-full justify-start", className)}
      >
        <LogOut className={cn("shrink-0", iconClassName)} aria-hidden="true" />
        Keluar
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari akun TemuKarya?"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <form action={logoutAction}>
              <SubmitButton variant="danger" className="w-full sm:w-auto">
                Ya, Keluar
              </SubmitButton>
            </form>
          </>
        }
      >
        <p className="text-sm text-muted-strong">
          Anda perlu masuk kembali menggunakan email dan kata sandi untuk mengakses dashboard, keranjang, serta riwayat transaksi Anda.
        </p>
      </Modal>
    </>
  );
}