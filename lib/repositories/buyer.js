import { query, withTransaction } from "@/lib/db";

/** Query khusus Buyer. Semua dibatasi oleh buyer_id dari sesi, bukan dari input. */
export const ORDER_PAGE_SIZE = 8;

/** Error bisnis yang aman ditampilkan ke pengguna (rollback otomatis). */
export class CheckoutError extends Error {}

const RANK = { awaiting_payment: 0, processing: 1, shipped: 2, completed: 3 };

/**
 * Status induk order diturunkan dari sub-order (tidak disimpan):
 * semua dibatalkan -> cancelled; selain itu sub-order yang dibatalkan diabaikan dan
 * diambil tahap paling awal di antara sisanya (order selesai hanya jika semua sub-order selesai).
 * @param {string[]} statuses
 */
export function deriveOrderStatus(statuses) {
  const live = statuses.filter((s) => s !== "cancelled");
  if (statuses.length === 0) return "awaiting_payment";
  if (live.length === 0) return "cancelled";
  return live.reduce((a, b) => (RANK[a] <= RANK[b] ? a : b));
}

/* ---------- Profil ---------- */

export async function getProfile(userId) {
  const { rows } = await query(`SELECT id, full_name, email, phone, created_at FROM users WHERE id=$1`, [userId]);
  return rows[0] ?? null;
}

export async function updateProfile(userId, { fullName, phone }) {
  const { rowCount } = await query(`UPDATE users SET full_name=$2, phone=$3 WHERE id=$1`, [userId, fullName, phone || null]);
  return rowCount === 1;
}

export async function getPasswordHash(userId) {
  const { rows } = await query(`SELECT password_hash FROM users WHERE id=$1`, [userId]);
  return rows[0]?.password_hash ?? null;
}

export async function setPasswordHash(userId, hash) {
  await query(`UPDATE users SET password_hash=$2 WHERE id=$1`, [userId, hash]);
}

/* ---------- Keranjang ---------- */

/** Isi keranjang dengan harga dan stok TERKINI dari tabel produk. */
export async function getCart(buyerId) {
  const { rows } = await query(
    `SELECT ci.id AS item_id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock, p.image_url, p.is_active,
            s.name AS store_name, (u.seller_status = 'approved') AS seller_ok
     FROM carts c
     JOIN cart_items ci ON ci.cart_id = c.id
     JOIN products p ON p.id = ci.product_id
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN stores s ON s.seller_id = p.seller_id
     WHERE c.buyer_id = $1
     ORDER BY ci.created_at, ci.id`,
    [buyerId]
  );
  const items = rows.map((r) => {
    const price = Number(r.price);
    const available = r.is_active && r.seller_ok && r.stock > 0;
    return {
      itemId: String(r.item_id), productId: String(r.product_id), name: r.name, price, stock: r.stock,
      imageUrl: r.image_url, storeName: r.store_name, quantity: r.quantity,
      available, enough: available && r.quantity <= r.stock, subtotal: price * r.quantity,
    };
  });
  return { items, total: items.reduce((s, i) => s + i.subtotal, 0), count: items.reduce((s, i) => s + i.quantity, 0) };
}

export async function getCartCount(buyerId) {
  const { rows } = await query(
    `SELECT COALESCE(SUM(ci.quantity),0)::int AS n FROM carts c JOIN cart_items ci ON ci.cart_id=c.id WHERE c.buyer_id=$1`,
    [buyerId]
  );
  return rows[0].n;
}

/** Mengubah jumlah item milik buyer. Tidak boleh melebihi stok. @returns {"ok"|"not_found"|"exceeds_stock"} */
export async function setCartQuantity(buyerId, itemId, quantity) {
  const { rows } = await query(
    `UPDATE cart_items ci SET quantity = $3
     FROM carts c, products p
     WHERE ci.id = $2 AND c.id = ci.cart_id AND c.buyer_id = $1 AND p.id = ci.product_id AND p.stock >= $3
     RETURNING ci.id`,
    [buyerId, itemId, quantity]
  );
  if (rows[0]) return "ok";
  const { rows: ex } = await query(
    `SELECT 1 FROM cart_items ci JOIN carts c ON c.id=ci.cart_id WHERE ci.id=$2 AND c.buyer_id=$1`,
    [buyerId, itemId]
  );
  return ex[0] ? "exceeds_stock" : "not_found";
}

export async function removeCartItem(buyerId, itemId) {
  const { rowCount } = await query(
    `DELETE FROM cart_items ci USING carts c WHERE ci.id=$2 AND c.id=ci.cart_id AND c.buyer_id=$1`,
    [buyerId, itemId]
  );
  return rowCount === 1;
}

/* ---------- Checkout (atomik) ---------- */

/**
 * Checkout dalam satu transaksi:
 * baca keranjang dari database -> kurangi stok dengan UPDATE bersyarat (stok >= jumlah) -> buat order,
 * sub-order per toko, dan item dengan harga saat pembelian -> kosongkan keranjang.
 * Gagal di langkah mana pun = ROLLBACK seluruhnya. Harga dan stok tidak pernah dipercaya dari client.
 * Produk diproses berurutan menurut id agar dua checkout bersamaan tidak saling deadlock.
 * @returns {Promise<string>} id order baru
 * @throws {CheckoutError}
 */
export async function checkout(buyerId, { recipientName, recipientPhone, shippingAddress, notes }) {
  return withTransaction(async (client) => {
    const { rows: items } = await client.query(
      `SELECT ci.product_id, ci.quantity
       FROM carts c JOIN cart_items ci ON ci.cart_id = c.id
       WHERE c.buyer_id = $1 ORDER BY ci.product_id`,
      [buyerId]
    );
    if (items.length === 0) throw new CheckoutError("Keranjang kosong.");

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (buyer_id, recipient_name, recipient_phone, shipping_address, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [buyerId, recipientName, recipientPhone, shippingAddress, notes || null]
    );
    const orderId = orderRows[0].id;
    const storeOrderIds = new Map(); // seller_id -> store_orders.id

    for (const it of items) {
      const { rows } = await client.query(
        `UPDATE products p SET stock = p.stock - $2
         FROM users u, stores s
         WHERE p.id = $1 AND p.is_active = TRUE AND p.stock >= $2
           AND u.id = p.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
           AND s.seller_id = p.seller_id
         RETURNING p.id, p.name, p.price, p.seller_id, s.name AS store_name`,
        [it.product_id, it.quantity]
      );
      if (!rows[0]) {
        const { rows: nm } = await client.query(`SELECT name FROM products WHERE id=$1`, [it.product_id]);
        throw new CheckoutError(`Stok "${nm[0]?.name ?? "produk"}" tidak mencukupi atau produk sudah tidak tersedia. Perbarui keranjang Anda.`);
      }
      const p = rows[0];
      let storeOrderId = storeOrderIds.get(String(p.seller_id));
      if (!storeOrderId) {
        const so = await client.query(
          `INSERT INTO store_orders (order_id, seller_id, store_name) VALUES ($1,$2,$3) RETURNING id`,
          [orderId, p.seller_id, p.store_name]
        );
        storeOrderId = so.rows[0].id;
        storeOrderIds.set(String(p.seller_id), storeOrderId);
      }
      await client.query(
        `INSERT INTO order_items (store_order_id, product_id, product_name, unit_price, quantity) VALUES ($1,$2,$3,$4,$5)`,
        [storeOrderId, p.id, p.name, p.price, it.quantity]
      );
    }

    // Keranjang baru dikosongkan setelah semua langkah di atas berhasil.
    await client.query(`DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE buyer_id = $1)`, [buyerId]);
    return String(orderId);
  });
}

/* ---------- Pesanan ---------- */

export async function listOrders(buyerId, { page = 1 } = {}) {
  const { rows: c } = await query(`SELECT COUNT(*)::int AS total FROM orders WHERE buyer_id=$1`, [buyerId]);
  const totalPages = Math.max(1, Math.ceil(c[0].total / ORDER_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const { rows } = await query(
    `SELECT o.id, o.created_at,
            COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS total,
            COALESCE(SUM(oi.quantity), 0)::int AS item_count,
            COALESCE(array_agg(DISTINCT so.fulfillment_status) FILTER (WHERE so.id IS NOT NULL), '{}') AS statuses
     FROM orders o
     LEFT JOIN store_orders so ON so.order_id = o.id
     LEFT JOIN order_items oi ON oi.store_order_id = so.id
     WHERE o.buyer_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC, o.id DESC
     LIMIT ${ORDER_PAGE_SIZE} OFFSET ${(current - 1) * ORDER_PAGE_SIZE}`,
    [buyerId]
  );
  const orders = rows.map((r) => ({
    id: String(r.id), created_at: r.created_at, total: Number(r.total), item_count: r.item_count,
    status: deriveOrderStatus(r.statuses),
  }));
  return { orders, total: c[0].total, page: current, totalPages };
}

/** Detail order milik buyer: sub-order per toko, item, dan status ulasan. Null jika bukan miliknya. */
export async function getOrderDetail(buyerId, orderId) {
  const { rows: o } = await query(
    `SELECT id, created_at, recipient_name, recipient_phone, shipping_address, notes
     FROM orders WHERE id=$1 AND buyer_id=$2`,
    [orderId, buyerId]
  );
  if (!o[0]) return null;
  const { rows } = await query(
    `SELECT so.id AS store_order_id, so.store_name, so.fulfillment_status, so.seller_id,
            oi.id AS item_id, oi.product_id, oi.product_name, oi.unit_price, oi.quantity,
            r.id AS review_id, r.rating AS review_rating, r.comment AS review_comment
     FROM store_orders so
     JOIN order_items oi ON oi.store_order_id = so.id
     LEFT JOIN reviews r ON r.order_item_id = oi.id
     WHERE so.order_id = $1
     ORDER BY so.id, oi.id`,
    [orderId]
  );
  const stores = [];
  for (const r of rows) {
    let s = stores.find((x) => x.id === String(r.store_order_id));
    if (!s) {
      s = { id: String(r.store_order_id), store_name: r.store_name, status: r.fulfillment_status, items: [] };
      stores.push(s);
    }
    s.items.push({
      id: String(r.item_id), productId: r.product_id ? String(r.product_id) : null, name: r.product_name,
      unit_price: Number(r.unit_price), quantity: r.quantity,
      review: r.review_id ? { rating: r.review_rating, comment: r.review_comment } : null,
    });
  }
  const total = stores.reduce((a, s) => a + s.items.reduce((b, i) => b + i.unit_price * i.quantity, 0), 0);
  return { ...o[0], id: String(o[0].id), stores, total, status: deriveOrderStatus(stores.map((s) => s.status)) };
}

export async function getBuyerOverview(buyerId) {
  const { rows } = await query(
    `SELECT so.fulfillment_status AS s, COUNT(*)::int AS n
     FROM orders o JOIN store_orders so ON so.order_id = o.id
     WHERE o.buyer_id = $1 GROUP BY so.fulfillment_status`,
    [buyerId]
  );
  const by = Object.fromEntries(rows.map((r) => [r.s, r.n]));
  const { rows: t } = await query(`SELECT COUNT(*)::int AS n FROM orders WHERE buyer_id=$1`, [buyerId]);
  return {
    totalOrders: t[0].n,
    awaiting: by.awaiting_payment ?? 0,
    inProgress: (by.processing ?? 0) + (by.shipped ?? 0),
    completed: by.completed ?? 0,
  };
}

/* ---------- Ulasan ---------- */

/**
 * Menyimpan ulasan. product_id dan buyer_id TIDAK diterima dari client: keduanya diturunkan dari order item
 * milik buyer yang sub-ordernya berstatus 'completed'. Trigger database menjadi pengaman terakhir.
 * @returns {Promise<"created"|"not_eligible"|"duplicate">}
 */
export async function createReview(buyerId, orderItemId, rating, comment) {
  try {
    const { rows } = await query(
      `INSERT INTO reviews (product_id, buyer_id, order_item_id, rating, comment)
       SELECT oi.product_id, o.buyer_id, oi.id, $3, $4
       FROM order_items oi
       JOIN store_orders so ON so.id = oi.store_order_id
       JOIN orders o ON o.id = so.order_id
       WHERE oi.id = $1 AND o.buyer_id = $2 AND so.fulfillment_status = 'completed' AND oi.product_id IS NOT NULL
       RETURNING id`,
      [orderItemId, buyerId, rating, comment]
    );
    return rows[0] ? "created" : "not_eligible";
  } catch (err) {
    if (err?.code === "23505") return "duplicate";
    throw err;
  }
}
