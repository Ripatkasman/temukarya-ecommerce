import { ShoppingCart, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import CartCheckoutClient from "@/components/dashboard/CartCheckoutClient";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { requireRole } from "@/lib/auth";
import { getCart, getProfile } from "@/lib/repositories/buyer";
import { listAddresses } from "@/lib/repositories/addresses";

export const metadata = { title: "Keranjang" };

export default async function BuyerCartPage({ searchParams }) {
  const me = await requireRole(["buyer"]);
  const resolvedParams = await searchParams;
  const directProductId = resolvedParams?.direct ? Number(resolvedParams.direct) : null;

  const [cart, profile, addresses] = await Promise.all([
    getCart(me.id),
    getProfile(me.id),
    listAddresses(me.id),
  ]);

  if (cart.items.length === 0) {
    return (
      <>
        <PageHeader title="Keranjang" />
        <EmptyState
          icon={ShoppingCart}
          title="Keranjangmu masih kosong"
          description="Tambahkan produk dari katalog, lalu kembali ke sini untuk checkout."
          actionLabel="Jelajahi produk"
          actionHref="/products"
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Keranjang"
          description={`${cart.count} barang dari ${new Set(cart.items.map((i) => i.storeName)).size} toko.`}
        />
        
      </div>

      <CartCheckoutClient
        items={cart.items}
        addresses={addresses}
        profile={{ name: profile.full_name, phone: profile.phone ?? "" }}
        directProductId={directProductId}
      />
    </>
  );
}