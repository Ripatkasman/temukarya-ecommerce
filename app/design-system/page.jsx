import { notFound } from "next/navigation";
import { Package, Inbox } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrandLogo from "@/components/brand/BrandLogo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Badge from "@/components/ui/Badge";
import { OrderStatusBadge, SellerStatusBadge } from "@/components/ui/StatusBadges";
import { EmptyState, ErrorState, LoadingState, ProductCardSkeleton } from "@/components/ui/States";
import Pagination from "@/components/ui/Pagination";
import ProductGrid from "@/components/commerce/ProductGrid";
import CategoryCard from "@/components/commerce/CategoryCard";
import StoreCard from "@/components/commerce/StoreCard";
import ReviewCard from "@/components/commerce/ReviewCard";
import Rating from "@/components/commerce/Rating";
import DesignDemos from "@/components/dashboard/DesignDemos";

export const metadata = { title: "Design system" };

// DATA CONTOH (demo) khusus halaman ini, bukan data produksi.
const DEMO_PRODUCTS = [
  { id: 1, name: "Tas Anyaman Lontar", price: 185000, stock: 12, store_name: "Kriya Sari Makassar", rating_avg: 4.6, rating_count: 18 },
  { id: 2, name: "Tenun Sutra Sengkang motif klasik ukuran besar", price: 450000, stock: 3, store_name: "Kriya Sari Makassar", rating_avg: 5, rating_count: 4 },
  { id: 3, name: "Hiasan Dinding Rotan", price: 95000, stock: 0, store_name: "Toko Demo", rating_avg: null, rating_count: 0 },
  { id: 4, name: "Lukisan Pantai Losari", price: 650000, stock: 8, store_name: "Toko Demo", rating_avg: 4.2, rating_count: 9 },
];

const COLORS = [
  ["primary", "bg-primary", "text-white"],
  ["primary-hover", "bg-primary-hover", "text-white"],
  ["primary-soft", "bg-primary-soft", "text-charcoal"],
  ["cream", "bg-cream", "text-charcoal"],
  ["accent", "bg-accent", "text-charcoal"],
  ["accent-soft", "bg-accent-soft", "text-charcoal"],
  ["charcoal", "bg-charcoal", "text-white"],
  ["canvas", "bg-canvas border border-line", "text-charcoal"],
  ["line", "bg-line", "text-charcoal"],
  ["muted-strong", "bg-muted-strong", "text-white"],
  ["success", "bg-success", "text-white"],
  ["warning", "bg-warning", "text-charcoal"],
  ["error", "bg-error", "text-white"],
];

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-section-title mb-4 border-b border-line pb-2">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Navbar />
      <main id="konten" className="container-page py-10">
        <h1 className="text-page-title">Design system TemuKarya</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-strong">
          Halaman rujukan komponen (hanya tampil saat development, otomatis 404 di production).
          Data di halaman ini adalah contoh.
        </p>
        <p className="mt-2 text-sm">
          <a className="font-semibold text-primary underline underline-offset-4" href="/design-system/dashboard">
            Lihat kerangka dashboard
          </a>
        </p>

        <Section title="Logo (sementara)">
          <div className="flex flex-wrap items-center gap-8">
            <BrandLogo href={null} markClassName="size-12" />
            <div className="rounded-card bg-primary p-4"><BrandLogo href={null} light /></div>
            <BrandLogo href={null} showWordmark={false} markClassName="size-10" />
          </div>
        </Section>

        <Section title="Warna (token)">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {COLORS.map(([name, bg, text]) => (
              <li key={name} className={`${bg} ${text} flex h-20 items-end rounded-card p-3 text-caption font-semibold`}>
                {name}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Tipografi">
          <div className="space-y-3">
            <p className="text-display">Display heading</p>
            <p className="text-page-title">Page heading</p>
            <p className="text-section-title">Section heading</p>
            <p className="text-card-title">Card title</p>
            <p>Teks isi (Inter). Karya lokal layak dilihat lebih banyak orang.</p>
            <p className="text-caption text-muted-strong">Caption / teks bantu</p>
          </div>
        </Section>

        <Section title="Tombol">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Utama</Button>
            <Button variant="accent">Aksen</Button>
            <Button variant="secondary">Sekunder</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Hapus</Button>
            <Button loading>Menyimpan</Button>
            <Button disabled>Nonaktif</Button>
            <Button size="sm">Kecil</Button>
            <Button size="lg">Besar</Button>
          </div>
        </Section>

        <Section title="Form">
          <form className="grid max-w-3xl gap-4 sm:grid-cols-2" noValidate>
            <Input id="f-name" label="Nama lengkap" required placeholder="Nama kamu" />
            <Input id="f-email" label="Email" type="email" required hint="Dipakai untuk masuk." />
            <PasswordInput id="f-pass" required />
            <Input id="f-err" label="Harga" defaultValue="0" error="Harga harus lebih dari 0." />
            <Select id="f-cat" label="Kategori" placeholder="Pilih kategori" options={[{ value: "1", label: "Kerajinan Tangan" }, { value: "2", label: "Seni Lukis" }]} />
            <Input id="f-dis" label="Dinonaktifkan" disabled defaultValue="Tidak bisa diubah" />
            <Textarea id="f-desc" label="Deskripsi" className="sm:col-span-2" />
            <Checkbox id="f-ok" label="Saya setuju dengan ketentuan TemuKarya" className="sm:col-span-2" />
          </form>
        </Section>

        <Section title="Badge & status">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Netral</Badge><Badge tone="brand">Brand</Badge><Badge tone="accent">Aksen</Badge>
            <Badge tone="success">Berhasil</Badge><Badge tone="warning">Peringatan</Badge><Badge tone="error">Galat</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["awaiting_payment", "processing", "shipped", "completed", "cancelled"].map((s) => <OrderStatusBadge key={s} status={s} />)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["pending", "approved", "rejected"].map((s) => <SellerStatusBadge key={s} status={s} />)}
          </div>
        </Section>

        <Section title="Produk">
          <ProductGrid products={DEMO_PRODUCTS} />
          <h3 className="text-card-title mb-3 mt-8">Skeleton loading</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton />
          </div>
        </Section>

        <Section title="Kategori, toko, ulasan">
          <div className="grid gap-4 md:grid-cols-3">
            <CategoryCard category={{ id: 1, name: "Kerajinan Tangan", description: "Produk handmade dan kriya" }} />
            <StoreCard store={{ id: 1, store_name: "Kriya Sari Makassar", description: "Kerajinan tangan dan anyaman khas Sulawesi Selatan.", product_count: 4 }} />
            <ReviewCard review={{ buyer_name: "Andi Pembeli", rating: 5, comment: "Anyamannya rapi dan kuat. Pengiriman cepat.", created_at: "2026-11-10T08:00:00Z" }} />
          </div>
          <div className="mt-4 flex gap-6"><Rating value={4.5} count={12} size="lg" /><Rating value={null} count={0} /></div>
        </Section>

        <Section title="Keadaan kosong, error, loading">
          <div className="grid gap-4 md:grid-cols-3">
            <EmptyState icon={Inbox} title="Belum ada karya yang kamu simpan" description="Yuk, temukan sesuatu yang menarik!" actionLabel="Jelajahi produk" actionHref="/products" />
            <ErrorState />
            <LoadingState />
          </div>
        </Section>

        <Section title="Pagination">
          <Pagination page={3} totalPages={9} basePath="/design-system" params={{ q: "tas" }} />
        </Section>

        <Section title="Interaksi (modal, konfirmasi, toast, dropdown)">
          <DesignDemos />
        </Section>
      </main>
      <Footer />
    </>
  );
}
