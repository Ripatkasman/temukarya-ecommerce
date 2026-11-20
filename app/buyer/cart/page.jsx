import { ShoppingCart } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import CartItemRow from "@/components/dashboard/CartItemRow";
import CheckoutForm from "@/components/dashboard/CheckoutForm";
import { EmptyState } from "@/components/ui/States";
import { requireRole } from "@/lib/auth";
import { getCart, getProfile } from "@/lib/repositories/buyer";
import { listAddresses } from "@/lib/repositories/addresses";
import { formatRupiah } from "@/lib/format";

export const metadata = { title: "Keranjang" };

export default async function BuyerCartPage() {
  const me = await requireRole(["buyer"]);
  const [cart, profile, addresses] = await Promise.all([getCart(me.id), getProfile(me.id), listAddresses(me.id)]);
  const blocked = cart.items.some((i) => !i.available || !i.enough);

  if (cart.items.length === 0) {
    return (
      <>
        <PageHeader title="Keranjang" />
        <EmptyState icon={ShoppingCart} title="Keranjangmu masih kosong" description="Tambahkan produk dari katalog, lalu kembali ke sini untuk checkout." actionLabel="Jelajahi produk" actionHref="/products" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Keranjang" description={`${cart.count} barang dari ${new Set(cart.items.map((i) => i.storeName)).size} toko.`} />
      <div className="grid items-start gap-8 xl:grid-cols-[1.4fr_1fr]">
        <ul className="space-y-3">
          {cart.items.map((i) => <CartItemRow key={i.itemId} item={i} />)}
        </ul>

        <section aria-labelledby="checkout" className="rounded-card border border-line bg-surface p-5 xl:sticky xl:top-6">
          <h2 id="checkout" className="text-section-title">Checkout</h2>
          <p className="mt-1 text-caption text-muted-strong">
            Pembayaran hanya simulasi (tanpa payment gateway). Pesanan dibuat dengan status Menunggu Pembayaran dan diproses oleh penjual.
          </p>
          <dl className="my-4 flex items-center justify-between border-y border-line py-3">
            <dt className="font-medium">Total</dt>
            <dd className="font-heading text-xl font-bold text-primary">{formatRupiah(cart.total)}</dd>
          </dl>
          {blocked && <p role="alert" className="mb-4 rounded-btn bg-warning-soft px-3 py-2 text-sm font-medium text-warning-strong">Ada produk yang stoknya kurang atau tidak tersedia. Perbarui keranjang sebelum checkout.</p>}
          <CheckoutForm addresses={addresses} profile={{ name: profile.full_name, phone: profile.phone ?? "" }} />
        </section>
      </div>
    </>
  );
}
