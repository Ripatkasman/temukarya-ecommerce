import Link from "next/link";
import {
  Package,
  TriangleAlert,
  Inbox,
  Truck,
  CheckCircle2,
  PackageX,
  Star,
  ExternalLink,
  MessageSquareText,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ProductImage from "@/components/commerce/ProductImage";
import Pagination from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { requireRole } from "@/lib/auth";
import { getSellerOverview, listStoreReviews } from "@/lib/repositories/seller";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata = { title: "Ringkasan Penjual" };
export const dynamic = "force-dynamic";

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "size-4",
            n <= rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-stone-300"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default async function SellerOverviewPage({ searchParams }) {
  const me = await requireRole(["seller"]);
  const sp = await searchParams;

  const ratingRaw = Array.isArray(sp.rating) ? sp.rating[0] : sp.rating;
  const parsedRating = Number(ratingRaw);
  const activeRating =
    Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
      ? parsedRating
      : null;

  const pageRaw = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, Number(pageRaw) || 1);

  const [s, reviewData] = await Promise.all([
    getSellerOverview(me.id),
    listStoreReviews(me.id, { rating: activeRating, page }),
  ]);

  const { reviews, totalPages, stats } = reviewData;

  const FILTERS = [
    { value: null, label: "Semua", count: stats.total_count },
    { value: 5, label: "5 Bintang", count: stats.star_5 },
    { value: 4, label: "4 Bintang", count: stats.star_4 },
    { value: 3, label: "3 Bintang", count: stats.star_3 },
    { value: 2, label: "2 Bintang", count: stats.star_2 },
    { value: 1, label: "1 Bintang", count: stats.star_1 },
  ];

  const baseQuery = activeRating ? { rating: String(activeRating) } : {};

  return (
    <>
      <PageHeader title={`Halo, ${me.fullName.split(" ")[0]}`} description="Ringkasan toko dan pesanan Anda." />
      {s.awaiting > 0 && (
        <Link href="/seller/orders?status=awaiting_payment" className="mb-6 flex items-center justify-between gap-3 rounded-card border border-warning/40 bg-warning-soft px-4 py-3 text-sm font-medium text-warning-strong hover:brightness-95">
          <span>{s.awaiting} pesanan baru menunggu Anda proses.</span>
          <span className="underline">Lihat pesanan</span>
        </Link>
      )}

      <h2 className="text-section-title mb-3">Produk</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total produk" value={s.product_count} icon={Package} />
        <StatCard label="Stok menipis (1-5)" value={s.low_stock} icon={TriangleAlert} tone="warning" />
        <StatCard label="Stok habis" value={s.out_of_stock} icon={PackageX} tone="accent" />
      </div>

      <h2 className="text-section-title mb-3 mt-8">Pesanan</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Menunggu diproses" value={s.awaiting} icon={Inbox} tone="warning" />
        <StatCard label="Sedang diproses/dikirim" value={s.in_progress} icon={Truck} />
        <StatCard label="Selesai" value={s.completed} icon={CheckCircle2} tone="success" />
      </div>

      {/* Section Riwayat Ulasan Pembeli di bawah Ringkasan Pesanan */}
      <section aria-labelledby="ulasan-pembeli" className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="ulasan-pembeli" className="text-section-title">Ulasan Pembeli</h2>
            <p className="mt-0.5 text-sm text-muted-strong">
              Penilaian pembeli untuk produk di toko Anda.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-card border border-line bg-surface px-3.5 py-2 text-sm">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="font-bold text-charcoal">
              {stats.total_count > 0 ? stats.avg_rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-muted-strong">/ 5.0 ({stats.total_count} ulasan)</span>
          </div>
        </div>

        {/* Filter Berdasarkan Bintang */}
        <nav aria-label="Filter ulasan berdasarkan bintang" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isSelected = activeRating === f.value;
            const href = f.value ? `/seller?rating=${f.value}` : "/seller";
            return (
              <Link
                key={String(f.value)}
                href={href}
                scroll={false}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-btn border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface text-charcoal hover:bg-cream"
                )}
              >
                {f.value && (
                  <Star
                    className={cn(
                      "size-3.5",
                      isSelected ? "fill-white text-white" : "fill-amber-400 text-amber-400"
                    )}
                    aria-hidden="true"
                  />
                )}
                <span>{f.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs",
                    isSelected ? "bg-white/20 text-white" : "bg-cream text-muted-strong"
                  )}
                >
                  {f.count}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* List Ulasan */}
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title={activeRating ? `Belum ada ulasan bintang ${activeRating}` : "Belum ada ulasan pembeli"}
            description={
              activeRating
                ? "Coba pilih filter bintang lain atau tampilkan semua ulasan."
                : "Ulasan akan muncul setelah pembeli menyelesaikan pesanan dan memberikan penilaian."
            }
          />
        ) : (
          <>
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-card border border-line bg-surface p-4 transition-colors hover:border-primary/40 sm:p-5"
                >
                  {/* Info Produk yang bisa diklik menuju halaman produk */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
                    <Link
                      href={`/products/${r.product_id}`}
                      className="group flex min-w-0 items-center gap-3"
                    >
                      <span className="size-11 shrink-0 overflow-hidden rounded-btn border border-line bg-cream">
                        <ProductImage
                          src={r.product_image}
                          alt={r.product_name}
                          className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-charcoal group-hover:text-primary group-hover:underline">
                          <span className="truncate">{r.product_name}</span>
                          <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
                        </span>
                        <span className="block text-xs text-muted-strong">
                          Lihat halaman produk
                        </span>
                      </span>
                    </Link>

                    <div className="text-right">
                      <StarRow rating={r.rating} />
                      <p className="mt-1 text-xs text-muted-strong">{formatDate(r.created_at)}</p>
                    </div>
                  </div>

                  {/* Ulasan Pembeli */}
                  <div className="pt-3">
                    <p className="text-xs font-medium text-muted-strong">
                      Oleh <span className="font-semibold text-charcoal">{r.buyer_name}</span>
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-charcoal">
                      {r.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/seller"
                query={baseQuery}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}