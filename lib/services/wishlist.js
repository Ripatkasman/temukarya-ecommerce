import * as wl from "@/lib/repositories/wishlist";

/** Logika wishlist Buyer. `me` = buyer dari sesi. */

export async function add(me, productId) {
  const r = await wl.addToWishlist(me.id, productId);
  if (r === "unavailable") return { ok: false, status: 404, message: "Produk tidak ditemukan atau tidak tersedia." };
  return { ok: true, status: r === "added" ? 201 : 200, message: r === "added" ? "Ditambahkan ke favorit." : "Produk sudah ada di favorit.", data: { wishlisted: true } };
}

export async function remove(me, productId) {
  const removed = await wl.removeFromWishlist(me.id, productId);
  if (!removed) return { ok: false, status: 404, message: "Produk tidak ada di favorit Anda." };
  return { ok: true, message: "Dihapus dari favorit.", data: { wishlisted: false } };
}

/** Untuk tombol hati: tambah jika belum ada, hapus jika sudah ada. */
export async function toggle(me, productId) {
  const ids = await wl.getWishlistIds(me.id);
  return ids.has(productId) ? remove(me, productId) : add(me, productId);
}
