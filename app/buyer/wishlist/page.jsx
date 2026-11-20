import { Heart } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import ProductGrid from "@/components/commerce/ProductGrid";
import WishlistButton from "@/components/commerce/WishlistButton";
import AddToCart from "@/components/commerce/AddToCart";
import Badge from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { requireRole } from "@/lib/auth";
import { listWishlist } from "@/lib/repositories/wishlist";

export const metadata = { title: "Favorit" };

export default async function BuyerWishlistPage() {
  const me = await requireRole(["buyer"]);
  const items = await listWishlist(me.id);

  return (
    <>
      <PageHeader title="Favorit" description={items.length ? `${items.length} produk tersimpan. Daftar ini terpisah dari keranjang.` : "Simpan produk yang kamu suka untuk dilihat lagi nanti."} />
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Belum ada produk favorit" description="Tekan ikon hati pada produk untuk menyimpannya di sini." actionLabel="Jelajahi produk" actionHref="/products" />
      ) : (
        <ProductGrid
          products={items}
          renderOverlay={(p) => <WishlistButton productId={p.id} productName={p.name} initial />}
          renderActions={(p) =>
            p.available ? <AddToCart product={p} viewer={me} /> : <Badge tone="neutral">Tidak tersedia lagi</Badge>
          }
        />
      )}
    </>
  );
}
