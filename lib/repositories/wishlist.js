import { query } from "@/lib/db";

/** Wishlist buyer (terpisah dari keranjang). Semua fungsi dibatasi buyer_id dari sesi. */

/** Id produk favorit sebagai Set (untuk menandai ikon hati di kartu produk). */
export async function getWishlistIds(buyerId) {
  const { rows } = await query(`SELECT product_id FROM wishlist_items WHERE buyer_id = $1`, [buyerId]);
  return new Set(rows.map((r) => String(r.product_id)));
}

/**
 * Daftar favorit dengan data produk terkini. Produk yang sudah tidak publik (nonaktif / seller tidak lagi
 * disetujui) tetap dikembalikan dengan `available = false` supaya buyer bisa menghapusnya.
 */
export async function listWishlist(buyerId) {
  const { rows } = await query(
    `SELECT p.id, p.name, p.price, p.stock, p.image_url, s.name AS store_name,
            w.created_at,
            (p.is_active AND u.seller_status = 'approved') AS available,
            rv.rating_avg, COALESCE(rv.rating_count, 0) AS rating_count
     FROM wishlist_items w
     JOIN products p ON p.id = w.product_id
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN stores s ON s.seller_id = p.seller_id
     LEFT JOIN (
       SELECT product_id, AVG(rating)::float AS rating_avg, COUNT(*)::int AS rating_count
       FROM reviews GROUP BY product_id
     ) rv ON rv.product_id = p.id
     WHERE w.buyer_id = $1
     ORDER BY w.created_at DESC, p.id DESC`,
    [buyerId]
  );
  return rows.map((r) => ({ ...r, id: String(r.id), price: Number(r.price) }));
}

/** Menambah favorit. Hanya produk publik yang bisa ditambahkan. Idempotent. @returns {"added"|"exists"|"unavailable"} */
export async function addToWishlist(buyerId, productId) {
  const { rows } = await query(
    `INSERT INTO wishlist_items (buyer_id, product_id)
     SELECT $1, p.id FROM products p
     JOIN users u ON u.id = p.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
     WHERE p.id = $2 AND p.is_active = TRUE
     ON CONFLICT (buyer_id, product_id) DO NOTHING
     RETURNING product_id`,
    [buyerId, productId]
  );
  if (rows[0]) return "added";
  const { rows: ex } = await query(`SELECT 1 FROM wishlist_items WHERE buyer_id = $1 AND product_id = $2`, [buyerId, productId]);
  return ex[0] ? "exists" : "unavailable";
}

/** Menghapus favorit milik sendiri. @returns {Promise<boolean>} true jika ada yang terhapus */
export async function removeFromWishlist(buyerId, productId) {
  const { rowCount } = await query(`DELETE FROM wishlist_items WHERE buyer_id = $1 AND product_id = $2`, [buyerId, productId]);
  return rowCount === 1;
}
