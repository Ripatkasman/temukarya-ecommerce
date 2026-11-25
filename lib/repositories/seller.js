import { query, withTransaction } from "@/lib/db";

/**
 * Query khusus Seller. Setiap query baca/ubah/hapus memakai kondisi kepemilikan
 * (`seller_id = $sesi`), jadi mengganti ID di URL atau payload tidak bisa menyentuh data seller lain.
 */
export const SELLER_PAGE_SIZE = 10;
const likeEscape = (v) => v.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Alur status yang boleh dijalankan seller. Dijaga juga oleh trigger di database. */
export const SELLER_TRANSITIONS = {
  awaiting_payment: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};

export async function getStoreBySeller(sellerId) {
  const { rows } = await query(`SELECT id, name, description, image_url FROM stores WHERE seller_id=$1`, [sellerId]);
  return rows[0] ? { ...rows[0], id: String(rows[0].id) } : null;
}

export async function updateStore(sellerId, { name, description, imageUrl }) {
  const { rows } = await query(
    `UPDATE stores SET name=$2, description=$3, image_url=COALESCE($4, image_url)
     WHERE seller_id=$1 RETURNING id`,
    [sellerId, name, description || null, imageUrl ?? null]
  );
  return rows.length === 1;
}

export async function getSellerOverview(sellerId) {
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM products WHERE seller_id=$1) AS product_count,
       (SELECT COUNT(*)::int FROM products WHERE seller_id=$1 AND stock = 0) AS out_of_stock,
       (SELECT COUNT(*)::int FROM products WHERE seller_id=$1 AND stock BETWEEN 1 AND 5) AS low_stock,
       (SELECT COUNT(*)::int FROM store_orders WHERE seller_id=$1 AND fulfillment_status='awaiting_payment') AS awaiting,
       (SELECT COUNT(*)::int FROM store_orders WHERE seller_id=$1 AND fulfillment_status IN ('processing','shipped')) AS in_progress,
       (SELECT COUNT(*)::int FROM store_orders WHERE seller_id=$1 AND fulfillment_status='completed') AS completed`,
    [sellerId]
  );
  return rows[0];
}

export async function listSellerProducts(sellerId, { q = "", page = 1 } = {}) {
  const params = [sellerId];
  let w = "WHERE p.seller_id = $1";
  if (q) {
    params.push(`%${likeEscape(q)}%`);
    w += " AND p.name ILIKE $2";
  }
  const { rows: c } = await query(`SELECT COUNT(*)::int AS total FROM products p ${w}`, params);
  const totalPages = Math.max(1, Math.ceil(c[0].total / SELLER_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const { rows } = await query(
    `SELECT p.id, p.name, p.price, p.stock, p.is_active, p.image_url, cat.name AS category_name
     FROM products p JOIN categories cat ON cat.id = p.category_id
     ${w} ORDER BY p.created_at DESC, p.id DESC
     LIMIT ${SELLER_PAGE_SIZE} OFFSET ${(current - 1) * SELLER_PAGE_SIZE}`,
    params
  );
  return { products: rows.map((r) => ({ ...r, id: String(r.id), price: Number(r.price) })), total: c[0].total, page: current, totalPages };
}

/** Satu produk milik seller ini; null jika bukan miliknya (sama seperti tidak ada). */
export async function getSellerProduct(sellerId, productId) {
  const { rows } = await query(
    `SELECT id, name, description, price, stock, image_url, is_active, category_id
     FROM products WHERE id=$1 AND seller_id=$2`,
    [productId, sellerId]
  );
  return rows[0] ? { ...rows[0], id: String(rows[0].id), category_id: String(rows[0].category_id), price: Number(rows[0].price) } : null;
}

export async function createProduct(sellerId, p) {
  const { rows } = await query(
    `INSERT INTO products (seller_id, category_id, name, description, price, stock, image_url, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [sellerId, p.categoryId, p.name, p.description, p.price, p.stock, p.imageUrl, p.isActive]
  );
  return String(rows[0].id);
}

/** @returns {Promise<{ updated: boolean, oldImage: string|null }>} */
export async function updateProduct(sellerId, productId, p) {
  const { rows } = await query(
    `UPDATE products SET category_id=$3, name=$4, description=$5, price=$6, stock=$7, is_active=$8,
            image_url = COALESCE($9, image_url)
     WHERE id=$1 AND seller_id=$2
     RETURNING (SELECT image_url FROM products WHERE id=$1) AS old_image`,
    [productId, sellerId, p.categoryId, p.name, p.description, p.price, p.stock, p.isActive, p.imageUrl ?? null]
  );
  return { updated: rows.length === 1, oldImage: rows[0]?.old_image ?? null };
}

export async function deleteProduct(sellerId, productId) {
  const { rows } = await query(`DELETE FROM products WHERE id=$1 AND seller_id=$2 RETURNING image_url`, [productId, sellerId]);
  return rows[0] ? rows[0].image_url : null;
}

export async function categoryExists(id) {
  const { rows } = await query(`SELECT 1 FROM categories WHERE id=$1`, [id]);
  return rows.length === 1;
}

/**
 * Pesanan masuk untuk toko seller ini: hanya sub-order (store_orders) miliknya beserta item-itemnya.
 * Data penerima ditampilkan karena seller perlu mengirim barang.
 */
export async function listIncomingOrders(sellerId, { status = "", page = 1 } = {}) {
  const params = [sellerId];
  let w = "WHERE so.seller_id = $1";
  if (["awaiting_payment", "processing", "shipped", "completed", "cancelled"].includes(status)) {
    params.push(status);
    w += " AND so.fulfillment_status = $2";
  }
  const { rows: c } = await query(`SELECT COUNT(*)::int AS total FROM store_orders so ${w}`, params);
  const totalPages = Math.max(1, Math.ceil(c[0].total / SELLER_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);

  const { rows } = await query(
    `SELECT so.id, so.order_id, so.fulfillment_status, so.created_at,
            o.recipient_name, o.recipient_phone, o.shipping_address, o.notes,
            COALESCE(json_agg(json_build_object(
              'id', oi.id, 'name', oi.product_name, 'unit_price', oi.unit_price, 'quantity', oi.quantity
            ) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items,
            COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS total
     FROM store_orders so
     JOIN orders o ON o.id = so.order_id
     LEFT JOIN order_items oi ON oi.store_order_id = so.id
     ${w}
     GROUP BY so.id, o.id
     ORDER BY so.created_at DESC, so.id DESC
     LIMIT ${SELLER_PAGE_SIZE} OFFSET ${(current - 1) * SELLER_PAGE_SIZE}`,
    params
  );
  const orders = rows.map((r) => ({
    ...r,
    id: String(r.id),
    order_id: String(r.order_id),
    total: Number(r.total),
    items: r.items.map((i) => ({ ...i, unit_price: Number(i.unit_price) })),
  }));
  return { orders, total: c[0].total, page: current, totalPages };
}

/**
 * Mengubah status sub-order milik seller. Transisi divalidasi di sini dan oleh trigger database.
 * Jika dibatalkan, stok barang dikembalikan dalam transaksi yang sama.
 * @returns {Promise<{ status: "ok" } | { status: "not_found" } | { status: "invalid", from: string }>}
 */
export async function updateStoreOrderStatus(sellerId, storeOrderId, next) {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT fulfillment_status FROM store_orders WHERE id=$1 AND seller_id=$2 FOR UPDATE`,
      [storeOrderId, sellerId]
    );
    if (!rows[0]) return { status: "not_found" };
    const from = rows[0].fulfillment_status;
    if (!SELLER_TRANSITIONS[from]?.includes(next)) return { status: "invalid", from };

    await client.query(`UPDATE store_orders SET fulfillment_status=$2 WHERE id=$1`, [storeOrderId, next]);
    if (next === "cancelled") {
      await client.query(
        `UPDATE products p SET stock = p.stock + oi.quantity
         FROM order_items oi
         WHERE oi.store_order_id = $1 AND oi.product_id = p.id`,
        [storeOrderId]
      );
    }
    return { status: "ok" };
  });
}

/**
 * Riwayat ulasan pembeli untuk produk milik seller ini, beserta statistik distribusi bintang.
 * @param {string} sellerId
 * @param {{ rating?: number|null, page?: number }} [opts]
 */
export async function listStoreReviews(sellerId, { rating = null, page = 1 } = {}) {
  const params = [sellerId];
  let w = "WHERE p.seller_id = $1";
  if (rating && rating >= 1 && rating <= 5) {
    params.push(rating);
    w += " AND r.rating = $2";
  }

  const [countRes, statsRes] = await Promise.all([
    query(
      `SELECT COUNT(*)::int AS total
       FROM reviews r
       JOIN products p ON p.id = r.product_id
       ${w}`,
      params
    ),
    query(
      `SELECT COUNT(*)::int AS total_count,
              COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
              COUNT(*) FILTER (WHERE r.rating = 5)::int AS star_5,
              COUNT(*) FILTER (WHERE r.rating = 4)::int AS star_4,
              COUNT(*) FILTER (WHERE r.rating = 3)::int AS star_3,
              COUNT(*) FILTER (WHERE r.rating = 2)::int AS star_2,
              COUNT(*) FILTER (WHERE r.rating = 1)::int AS star_1
       FROM reviews r
       JOIN products p ON p.id = r.product_id
       WHERE p.seller_id = $1`,
      [sellerId]
    ),
  ]);

  const total = countRes.rows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / SELLER_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);

  const { rows } = await query(
    `SELECT r.id,
            r.rating,
            r.comment,
            r.created_at,
            p.id        AS product_id,
            p.name      AS product_name,
            p.image_url AS product_image,
            u.full_name AS buyer_name
     FROM reviews r
     JOIN products p ON p.id = r.product_id
     JOIN users u    ON u.id = r.buyer_id
     ${w}
     ORDER BY r.created_at DESC, r.id DESC
     LIMIT ${SELLER_PAGE_SIZE} OFFSET ${(current - 1) * SELLER_PAGE_SIZE}`,
    params
  );

  const reviews = rows.map((r) => ({
    ...r,
    id: String(r.id),
    product_id: String(r.product_id),
    rating: Number(r.rating),
  }));

  const statsRow = statsRes.rows[0] ?? {};
  return {
    reviews,
    total,
    page: current,
    totalPages,
    stats: {
      total_count: Number(statsRow.total_count ?? 0),
      avg_rating: Number(statsRow.avg_rating ?? 0),
      star_5: Number(statsRow.star_5 ?? 0),
      star_4: Number(statsRow.star_4 ?? 0),
      star_3: Number(statsRow.star_3 ?? 0),
      star_2: Number(statsRow.star_2 ?? 0),
      star_1: Number(statsRow.star_1 ?? 0),
    },
  };
}