"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { deleteRejectedAccountAction } from "@/lib/actions/auth";

/** Tombol hapus akun untuk seller yang ditolak, dengan dialog konfirmasi. */
export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        <Trash2 className="size-4" aria-hidden="true" />
        Hapus akun
      </Button>
      <ConfirmationDialog
        open={open}
        onClose={() => !pending && setOpen(false)}
        onConfirm={() => startTransition(() => deleteRejectedAccountAction())}
        title="Hapus akun ini?"
        description="Akun dan data toko yang kamu daftarkan akan dihapus permanen dan tidak bisa dikembalikan. Kamu tetap bisa mendaftar lagi dengan email yang sama di kemudian hari."
        confirmLabel="Ya, hapus akun"
        destructive
        loading={pending}
      />
    </>
  );
}
