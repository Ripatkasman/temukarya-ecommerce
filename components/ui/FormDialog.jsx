"use client";

import Modal from "./Modal";
import Button from "./Button";

/** Modal berisi form. Tombol simpan men-submit form dengan id `formId`. */
export default function FormDialog({ open, onClose, title, description, formId, submitLabel = "Simpan", loading = false, children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
          <Button type="submit" form={formId} loading={loading}>{submitLabel}</Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
