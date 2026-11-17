"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import FormDialog from "@/components/ui/FormDialog";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

/** Demo interaksi komponen klien (hanya untuk halaman /design-system). */
export default function DesignDemos() {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => setModal(true)}>Buka modal</Button>
      <Button variant="danger" onClick={() => setConfirm(true)}>Hapus (konfirmasi)</Button>
      <Button variant="secondary" onClick={() => setForm(true)}>Buka form dialog</Button>
      <Button variant="ghost" onClick={() => toast.success("Perubahan disimpan.")}>Toast sukses</Button>
      <Button variant="ghost" onClick={() => toast.error("Gagal menyimpan. Coba lagi.")}>Toast error</Button>
      <Dropdown
        label="Aksi"
        items={[
          { label: "Lihat detail", href: "/design-system" },
          { label: "Ubah", onClick: () => toast.info("Aksi ubah dipilih.") },
          { label: "Hapus", danger: true, onClick: () => setConfirm(true) },
        ]}
      />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Contoh modal"
        description="Esc, klik di luar, atau tombol Tutup untuk menutup."
        footer={<Button onClick={() => setModal(false)}>Mengerti</Button>}
      >
        <p className="text-sm">Fokus terkunci di dalam modal selama terbuka.</p>
      </Modal>

      <ConfirmationDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); toast.success("Data dihapus."); }}
        title="Hapus produk ini?"
        description="Produk akan dihapus dari toko. Riwayat pesanan yang sudah ada tidak ikut hilang."
        confirmLabel="Ya, hapus"
        destructive
      />

      <FormDialog
        open={form}
        onClose={() => setForm(false)}
        title="Ubah nama kategori"
        formId="demo-form"
      >
        <form
          id="demo-form"
          onSubmit={(e) => { e.preventDefault(); setForm(false); toast.success("Kategori diperbarui."); }}
        >
          <Input id="demo-name" label="Nama kategori" required defaultValue="Kerajinan Tangan" />
        </form>
      </FormDialog>
    </div>
  );
}
