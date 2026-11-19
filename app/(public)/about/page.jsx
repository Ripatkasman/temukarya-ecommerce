import Button from "@/components/ui/Button";

export const metadata = { title: "Tentang TemuKarya" };

const VALUES = [
  ["Kepercayaan", "Status penjual, informasi toko, dan aturan ulasan dibuat jelas."],
  ["Pertumbuhan", "Alat untuk membantu penjual menampilkan dan mengelola usahanya."],
  ["Koneksi", "Jembatan yang berguna antara penjual, kreator, dan pembeli."],
  ["Kreativitas", "Menghargai produk yang khas dan karya independen."],
  ["Inklusivitas", "Pasar yang ramah untuk usaha di berbagai tahap."],
];

export default function AboutPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <header className="max-w-3xl">
        <h1 className="text-display">Tempat karya lokal bertemu kepercayaan.</h1>
        <p className="mt-4 text-lg text-muted-strong">Where Local Dreams Meet Opportunities.</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="max-w-2xl space-y-4 leading-relaxed">
          <p>
            Setiap produk punya cerita. Di baliknya ada kreativitas, kerja keras, dan cita-cita seseorang yang membangun usahanya.
            Tetapi banyak pelaku usaha lokal dan kreator independen kesulitan menjangkau pasar yang lebih luas dan mendapat kepercayaan pembeli baru.
          </p>
          <p>
            Di sisi lain, pembeli butuh informasi yang jelas sebelum membeli dari toko yang belum mereka kenal.
          </p>
          <p>
            TemuKarya mempertemukan keduanya. Penjual mendaftar dan menunggu persetujuan administrator sebelum mengakses alat penjual.
            Penjual yang disetujui dapat menampilkan toko dan produknya. Pembeli dapat menjelajah produk, melihat informasi toko, memantau pesanan,
            dan berbagi pengalaman setelah pesanan selesai.
          </p>
          <p className="rounded-card border border-line bg-cream/60 p-4 text-sm text-muted-strong">
            Persetujuan penjual mendukung kredibilitas akun, bukan jaminan kualitas produk. Informasi produk, akurasi stok, dan ulasan pembeli
            tetap penting untuk keputusan belanja. Pembayaran pada proyek ini hanya simulasi.
          </p>
        </div>

        <section aria-labelledby="nilai">
          <h2 id="nilai" className="text-section-title">Nilai yang kami pegang</h2>
          <dl className="mt-4 divide-y divide-line rounded-card border border-line bg-surface">
            {VALUES.map(([title, text]) => (
              <div key={title} className="px-4 py-3">
                <dt className="text-card-title">{title}</dt>
                <dd className="text-sm text-muted-strong">{text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/products" size="lg">Jelajahi produk</Button>
        <Button href="/register?type=seller" variant="secondary" size="lg">Daftar sebagai penjual</Button>
      </div>
    </div>
  );
}
