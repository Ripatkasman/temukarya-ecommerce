"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ServerForm, SubmitBtn } from "./ServerForm";

/**
 * Tombol yang membuka dialog berisi form (tambah/ubah data).
 * `children` = field (TextField, AreaField, ...). Form di-reset setiap dialog dibuka ulang.
 */
export default function DialogForm({ triggerLabel, triggerVariant = "primary", triggerSize = "md", triggerClassName, title, description, action, submitLabel = "Simpan", children }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  return (
    <>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName}
        onClick={() => {
          setSession((n) => n + 1);
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} description={description}>
        <ServerForm key={session} action={action} onSuccess={() => setOpen(false)}>
          {children}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <SubmitBtn>{submitLabel}</SubmitBtn>
          </div>
        </ServerForm>
      </Modal>
    </>
  );
}
