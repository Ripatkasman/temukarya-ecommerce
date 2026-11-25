"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";

/**
 * Tombol aksi yang dijalankan lewat Server Action, dengan dialog konfirmasi opsional.
 * `fields`: nilai yang dikirim ({ id: "12" }). Toast muncul sesuai hasil sebenarnya dari server.
 * Tanpa `confirmTitle`, aksi langsung dijalankan.
 */
export default function ConfirmAction({
  action,
  fields = {},
  label,
  variant,
  size = "sm",
  className,
  confirmTitle,
  confirmDescription,
  confirmLabel,
  destructive = false,
  ariaLabel,
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  // Jika aksi bersifat destructive (hapus/nonaktifkan) dan tidak ada variant eksplisit selain outline,
  // otomatis gunakan tombol merah ("danger") agar seragam di seluruh halaman.
  const resolvedVariant =
    variant && variant !== "outline"
      ? variant
      : destructive
      ? "danger"
      : variant ?? "outline";

  function run() {
    startTransition(async () => {
      const fd = new FormData();
      for (const [k, v] of Object.entries(fields)) fd.set(k, String(v));
      const res = await action(null, fd);
      if (res?.ok) {
        if (res.message) toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res?.message ?? "Aksi belum berhasil.");
        setOpen(false);
      }
    });
  }

  return (
    <>
      <Button
        variant={resolvedVariant}
        size={size}
        className={className}
        aria-label={ariaLabel}
        loading={!confirmTitle && pending}
        onClick={() => (confirmTitle ? setOpen(true) : run())}
      >
        {label}
      </Button>
      {confirmTitle && (
        <ConfirmationDialog
          open={open}
          onClose={() => !pending && setOpen(false)}
          onConfirm={run}
          title={confirmTitle}
          description={confirmDescription}
          confirmLabel={confirmLabel}
          destructive={destructive}
          loading={pending}
        />
      )}
    </>
  );
} 