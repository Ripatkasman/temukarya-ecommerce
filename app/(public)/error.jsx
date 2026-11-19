"use client";

import { ErrorState } from "@/components/ui/States";

export default function PublicError({ reset }) {
  return (
    <div className="container-page py-16">
      <ErrorState
        title="Halaman belum bisa dimuat"
        description="Terjadi gangguan saat mengambil data. Periksa koneksi lalu coba lagi."
        onRetry={reset}
      />
    </div>
  );
}
