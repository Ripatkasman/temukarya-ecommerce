import { query } from "@/lib/db";

/**
 * Menambah produk ke keranjang milik buyer.
 * Seluruh pengecekan (produk aktif, seller disetujui, stok cukup termasuk jumlah yang sudah ada di keranjang)
 * dilakukan di SQL dalam satu statement, jadi tidak bisa dilewati lewat request palsu.
 * @param {string} buyerId id dari sesi (bukan dari client)
 * @param {string} productId
 * @param {number} quantity bilangan bulat >= 1
 * @returns {Promise<{ status: "added", quantity: number } | { status: "unavailable" } | { status: "exceeds_stock", stock: number }>}
 */
export async function addToCart(buyerId, productId, quantity) {
  const { rows: prod } = await query(
    `SELECT p.stock
     FROM products p
     JOIN users u ON u.id = p.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
     WHERE p.id = $1 AND p.is_active = TRUE`,
    [productId]
  );
  if (!prod[0] || prod[0].stock <= 0) return { status: "unavailable" };

  const { rows: cart } = await query(
    `INSERT INTO carts (buyer_id) VALUES ($1)
     ON CONFLICT (buyer_id) DO UPDATE SET updated_at = NOW()
     RETURNING id`,
    [buyerId]
  );

  const { rows } = await query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     SELECT $1, p.id, $3
     FROM products p
     JOIN users u ON u.id = p.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
     WHERE p.id = $2 AND p.is_active = TRUE AND p.stock >= $3
     ON CONFLICT (cart_id, product_id) DO UPDATE
       SET quantity = cart_items.quantity + EXCLUDED.quantity
       WHERE cart_items.quantity + EXCLUDED.quantity <= (SELECT stock FROM products WHERE id = $2)
     RETURNING quantity`,
    [cart[0].id, productId, quantity]
  );
  if (!rows[0]) return { status: "exceeds_stock", stock: prod[0].stock };
  return { status: "added", quantity: rows[0].quantity };
}
