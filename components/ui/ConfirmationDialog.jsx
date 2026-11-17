"use client";

import Modal from "./Modal";
import Button from "./Button";

/**
 * Konfirmasi untuk aksi berbahaya (hapus, tolak, dll).
 * `onConfirm` boleh async; `loading` menonaktifkan tombol selama proses.
 */
export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Yakin ingin melanjutkan?",
  description,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  destructive = false,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description && <p className="text-sm leading-relaxed text-muted-strong">{description}</p>}
    </Modal>
  );
}
