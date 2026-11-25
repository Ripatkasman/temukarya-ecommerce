import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Store, Tag } from "lucide-react";
import ProductImage from "@/components/commerce/ProductImage";
import PriceDisplay from "@/components/commerce/PriceDisplay";
import Rating from "@/components/commerce/Rating";
import ReviewCard from "@/components/commerce/ReviewCard";
import AddToCart from "@/components/commerce/AddToCart";
import WishlistToggle from "@/components/commerce/WishlistToggle";
import { getWishlistIds } from "@/lib/repositories/wishlist";
import Badge from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { getCurrentUser } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { getProduct, listReviews } from "@/lib/repositories/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const id = parseId((await params).id);
  const product = id ? await getProduct(id) : null;
  return { title: product ? product.name : "Produk tidak ditemukan" };
}

export default async function ProductDetailPage({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  const viewer = await getCurrentUser();
  const [reviews, wished] = await Promise.all([
    listReviews(id),
    viewer?.role === "buyer" ? getWishlistIds(viewer.id) : Promise.resolve(new Set()),
  ]);

  const stockBadge =
    product.stock <= 0 ? <Badge tone="error">Stok habis</Badge>
    : product.stock <= 5 ? <Badge tone="warning">Sisa {product.stock}</Badge>
    : <Badge tone="success">Tersedia ({product.stock})</Badge>;

  return (
    <div className="container-page py-8 md:py-12">
      <nav aria-label="Jejak halaman" className="mb-6 text-sm text-muted-strong">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-primary hover:underline">Beranda</Link></li>
          <li aria-hidden="true"><ChevronRight className="size-4" /></li>
          <li><Link href="/products" className="hover:text-primary hover:underline">Produk</Link></li>
          <li aria-hidden="true"><ChevronRight className="size-4" /></li>
          <li aria-current="page" className="line-clamp-1 font-medium text-charcoal">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <ProductImage src={product.image_url} alt={product.name} className="size-full" />
        </div>

        <div>
          <Link href={`/products?category=${product.category_id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Tag className="size-4" aria-hidden="true" />
            {product.category_name}
          </Link>
          <h1 className="text-page-title mt-2">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating value={product.rating_avg} count={product.rating_count} size="lg" />
            {stockBadge}
          </div>
          <p className="mt-4"><PriceDisplay value={product.price} size="lg" /></p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <AddToCart product={product} viewer={viewer} withQuantity />
            <WishlistToggle product={product} viewer={viewer} wishlisted={wished.has(product.id)} withLabel className="border border-line" />
          </div>

          <section aria-labelledby="deskripsi" className="mt-8">
            <h2 id="deskripsi" className="text-card-title">Deskripsi</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-charcoal">{product.description}</p>
          </section>

          <section aria-labelledby="penjual" className="mt-8 rounded-card border border-line bg-surface p-4">
            <h2 id="penjual" className="sr-only">Penjual</h2>
            <Link href={`/stores/${product.store_id}`} className="flex items-center gap-4">
              <span className="size-14 shrink-0 overflow-hidden rounded-btn border border-line">
                <ProductImage src={product.store_image} alt={`Logo ${product.store_name}`} className="size-full" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-card-title">
                  <Store className="size-4 text-primary" aria-hidden="true" />
                  <span className="truncate">{product.store_name}</span>
                </span>
                <span className="block text-caption text-muted-strong">{product.store_product_count} produk aktif. Lihat toko.</span>
              </span>
            </Link>
            {product.store_description && (
              <p className="mt-3 line-clamp-3 text-sm text-muted-strong">{product.store_description}</p>
            )}
          </section>
        </div>
      </div>

      <section aria-labelledby="ulasan" className="mt-12 md:mt-16">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="ulasan" className="text-section-title">Ulasan pembeli</h2>
          <Rating value={product.rating_avg} count={product.rating_count} />
        </div>
        {reviews.length === 0 ? (
          <EmptyState title="Belum ada ulasan" description="Ulasan muncul setelah pembeli menyelesaikan pesanan produk ini." />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id}>
                <ReviewCard
                  review={r}
                  canDelete={viewer?.role === "admin"}
                  productId={product.id}
                />
              </li>
            ))}
          </ul>
        )}
        {product.rating_count > reviews.length && (
          <p className="mt-4 text-caption text-muted-strong">Menampilkan {reviews.length} ulasan terbaru dari {product.rating_count} ulasan.</p>
        )}
      </section>
    </div>
  );
}