import Link from "next/link";
import { ShieldCheck, Store, MessageSquareText } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/layout/SectionHeader";
import SearchBox from "@/components/commerce/SearchBox";
import ProductGrid from "@/components/commerce/ProductGrid";
import ProductImage from "@/components/commerce/ProductImage";
import PriceDisplay from "@/components/commerce/PriceDisplay";
import CategoryCard from "@/components/commerce/CategoryCard";
import StoreCard from "@/components/commerce/StoreCard";
import AddToCart from "@/components/commerce/AddToCart";
import WishlistToggle from "@/components/commerce/WishlistToggle";
import { getWishlistIds } from "@/lib/repositories/wishlist";
import { getCurrentUser } from "@/lib/auth";
import { listHomeProducts, listCategories, listRecommendedStores } from "@/lib/repositories/catalog";

export const metadata = {
  title: { absolute: "TemuKarya | Tempat Karya Lokal Bertemu Kepercayaan" },
};

// Beranda bergantung pada sesi dan data terbaru, jadi tidak di-cache statis.
export const dynamic = "force-dynamic";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Penjual ditinjau lebih dulu",
    text: "Setiap penjual mendaftar dan menunggu persetujuan admin sebelum bisa berjualan.",
  },
  {
    icon: Store,
    title: "Informasi toko yang jelas",
    text: "Lihat siapa penjualnya, apa saja produknya, dan berapa stok yang tersedia sebelum membeli.",
  },
  {
    icon: MessageSquareText,
    title: "Ulasan dari pesanan selesai",
    text: "Hanya pembeli yang pesanannya sudah selesai yang bisa memberi rating dan ulasan.",
  },
];

export default async function HomePage() {
  const viewer = await getCurrentUser();
  const isBuyer = viewer?.role === "buyer";

  const [popular, newest, recommended, categories, stores] = await Promise.all([
    listHomeProducts({ sort: "popular", limit: 8 }),
    isBuyer ? listHomeProducts({ sort: "newest", limit: 8 }) : Promise.resolve([]),
    isBuyer ? listHomeProducts({ sort: "random", limit: 8 }) : Promise.resolve([]),
    listCategories({ popularFirst: true, limit: 6, onlyWithProducts: true }),
    listRecommendedStores(3),
  ]);
  const heroTiles = (isBuyer ? newest : popular).slice(0, 6);
  const wished = isBuyer ? await getWishlistIds(viewer.id) : new Set();
  const renderActions = (p) => <AddToCart product={p} viewer={viewer} />;
  const renderOverlay = (p) => <WishlistToggle product={p} viewer={viewer} wishlisted={wished.has(p.id)} />;

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="judul-hero" className="border-b border-line bg-cream/50">
        <div className="container-page grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            {isBuyer ? (
              <>
                <p className="text-sm font-semibold text-primary">Halo, {viewer.fullName.split(" ")[0]}!</p>
                <h1 id="judul-hero" className="text-display mt-2 max-w-2xl">Karya apa yang ingin kamu temukan hari ini?</h1>
              </>
            ) : (
              <>
                <h1 id="judul-hero" className="text-display max-w-2xl">Temukan Karya, Dukung Cerita di Baliknya.</h1>
                <p className="mt-4 max-w-xl text-lg text-muted-strong">
                  Jelajahi produk unik dari pelaku usaha lokal dan kreator independen. Temukan sesuatu yang bermakna,
                  sekaligus dukung mereka untuk terus berkembang.
                </p>
              </>
            )}
            <SearchBox className="mt-7 max-w-xl" />
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/products" variant="outline">Jelajahi semua produk</Button>
              {!viewer && <Button href="/register?type=seller" variant="secondary">Mulai ceritakan karyamu</Button>}
            </div>
          </div>

          {heroTiles.length > 0 && (
            <div aria-label="Produk pilihan" className="grid grid-cols-3 items-center gap-3 sm:gap-4">
              {/* Kolom 1: 2 Foto Produk (Offset sedikit ke bawah untuk kesan editorial) */}
              <ul className="space-y-3 pt-6 sm:space-y-4">
                {heroTiles.slice(0, 2).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      aria-label={`Lihat produk ${p.name}`}
                      className="group block overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <ProductImage
                        src={p.image_url}
                        alt={p.name}
                        ratio="aspect-[3/4]"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Kolom 2: 2 Foto Produk (Posisi paling atas sebagai fokus utama) */}
              <ul className="space-y-3 sm:space-y-4">
                {heroTiles.slice(2, 4).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      aria-label={`Lihat produk ${p.name}`}
                      className="group block overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <ProductImage
                        src={p.image_url}
                        alt={p.name}
                        ratio="aspect-[3/4]"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Kolom 3: 2 Foto Produk (Offset sedikit lebih rendah untuk ritme visual) */}
              <ul className="space-y-3 pt-10 sm:space-y-4">
                {heroTiles.slice(4, 6).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      aria-label={`Lihat produk ${p.name}`}
                      className="group block overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <ProductImage
                        src={p.image_url}
                        alt={p.name}
                        ratio="aspect-[3/4]"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Produk */}
      {isBuyer && recommended.length > 0 && (
        <section aria-labelledby="rekomendasi" className="container-page pt-12 md:pt-16">
          <SectionHeader id="rekomendasi" title="Rekomendasi produk" description="Dipilih acak dari katalog. Muat ulang halaman untuk melihat pilihan lain." href="/products" />
          <ProductGrid products={recommended} renderActions={renderActions}
            renderOverlay={renderOverlay} />
        </section>
      )}

      {isBuyer && newest.length > 0 && (
        <section aria-labelledby="produk-baru" className="container-page pt-12 md:pt-16">
          <SectionHeader id="produk-baru" title="Baru di TemuKarya" description="Karya yang baru saja ditambahkan penjual." href="/products?sort=newest" />
          <ProductGrid products={newest} renderActions={renderActions}
            renderOverlay={renderOverlay} />
        </section>
      )}

      <section aria-labelledby="produk-pilihan" className="container-page pt-12 md:pt-16">
        <SectionHeader
          id="produk-pilihan"
          title={isBuyer ? "Paling banyak diulas" : "Produk pilihan"}
          description="Diurutkan dari produk dengan ulasan terbanyak, lalu yang terbaru."
          href="/products"
        />
        <ProductGrid
          products={popular}
          renderActions={renderActions}
            renderOverlay={renderOverlay}
          empty={{ title: "Belum ada produk", description: "Produk dari penjual terverifikasi akan tampil di sini.", actionLabel: "Lihat semua produk", actionHref: "/products" }}
        />
      </section>

      {/* Kategori */}
      {categories.length > 0 && (
        <section aria-labelledby="kategori" className="container-page pt-12 md:pt-16">
          <SectionHeader id="kategori" title="Kategori populer" description="Dipilih dari kategori dengan produk terbanyak." href="/products" linkLabel="Semua produk" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li key={c.id}><CategoryCard category={c} /></li>
            ))}
          </ul>
        </section>
      )}

      {/* Toko */}
      {stores.length > 0 && (
        <section aria-labelledby="toko" className="container-page pt-12 md:pt-16">
          <SectionHeader id="toko" title="Toko yang bisa kamu kunjungi" description="Toko dengan penjual yang sudah disetujui admin." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => (
              <li key={s.id}><StoreCard store={s} /></li>
            ))}
          </ul>
        </section>
      )}

      {/* Mengapa TemuKarya */}
      <section aria-labelledby="mengapa" className="container-page pt-12 md:pt-16">
        <SectionHeader id="mengapa" title="Mengapa TemuKarya" />
        <ul className="grid gap-4 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-card border border-line bg-surface p-5">
              <span className="flex size-11 items-center justify-center rounded-btn bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-card-title mt-4">{title}</h3>
              <p className="mt-1 text-sm text-muted-strong">{text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-caption text-muted-strong">
          Persetujuan admin memverifikasi akun penjual, bukan menjamin kualitas produk. Baca deskripsi, stok, dan ulasan sebelum membeli.
        </p>
      </section>

      {/* Cerita */}
      <section aria-labelledby="cerita" className="mt-12 bg-cream md:mt-16">
        <div className="container-page grid gap-8 py-12 md:grid-cols-[1fr_1.4fr] md:py-16">
          <h2 id="cerita" className="text-page-title">Setiap produk punya cerita.</h2>
          <div className="space-y-4 text-base leading-relaxed text-charcoal">
            <p>
              Di balik sebuah produk ada kreativitas, kerja keras, dan cita-cita seseorang yang sedang membangun usahanya.
              Namun banyak pelaku usaha lokal dan kreator independen sulit menjangkau pasar yang lebih luas dan mendapat kepercayaan pembeli baru.
            </p>
            <p>
              TemuKarya mempertemukan keduanya. Penjual mendaftar dan menunggu persetujuan admin, lalu menampilkan toko dan produknya.
              Pembeli bisa menjelajah, memantau pesanan, dan berbagi pengalaman lewat ulasan setelah pesanan selesai.
            </p>
            <Link href="/about" className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">
              Baca selengkapnya tentang TemuKarya
            </Link>
          </div>
        </div>
      </section>

      {/* Ajakan penjual */}
      {!viewer && (
        <section aria-labelledby="ajakan-penjual" className="container-page py-12 md:py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-card bg-primary px-6 py-10 text-cream sm:px-10 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 id="ajakan-penjual" className="font-heading text-2xl font-bold text-white sm:text-3xl">Mulai ceritakan karyamu.</h2>
              <p className="mt-2 text-cream/90">
                Daftarkan tokomu, tunggu persetujuan admin, lalu kelola produk dan pesananmu dari satu tempat.
              </p>
            </div>
            <Button href="/register?type=seller" variant="accent" size="lg">Daftar sebagai penjual</Button>
          </div>
        </section>
      )}
    </>
  );
}
