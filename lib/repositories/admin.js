import { query, withTransaction } from "@/lib/db";

/** Query khusus Admin. Semua fungsi dipanggil hanya setelah requireRole(["admin"]) di Server Action / halaman. */
export const ADMIN_PAGE_SIZE = 10;

const likeEscape = (v) => v.replace(/[\\%_]/g, (c) => `\\${c}`);

export async function getOverviewStats() {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM users WHERE role='seller') AS total_sellers,
      (SELECT COUNT(*)::int FROM users WHERE role='seller' AND seller_status='pending') AS pending_sellers,
      (SELECT COUNT(*)::int FROM users WHERE role='buyer') AS total_buyers,
      (SELECT COUNT(*)::int FROM products WHERE is_active) AS active_products,
      (SELECT COUNT(*)::int FROM orders) AS total_orders`);
  return rows[0];
}

/** Daftar user dengan pencarian (nama/email), filter role, dan pagination. */
/** Daftar user dengan pencarian (nama/email), filter role, filter status, dan pagination. */
export async function listUsers({ q = "", role = "", status = "", page = 1 } = {}) {
  const where = [];
  const params = [];
  const add = (v) => (params.push(v), `$${params.length}`);

  if (q) {
    const p = add(`%${likeEscape(q)}%`);
    where.push(`(u.full_name ILIKE ${p} OR u.email ILIKE ${p})`);
  }
  if (["admin", "seller", "buyer"].includes(role)) {
    where.push(`u.role = ${add(role)}`);
  }
  if (status === "active") where.push(`u.is_active = TRUE`);
  if (status === "inactive") where.push(`u.is_active = FALSE`);
  if (status === "deletion_requested") where.push(`u.deletion_requested_at IS NOT NULL`);

  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const { rows: c } = await query(`SELECT COUNT(*)::int AS total FROM users u ${w}`, params);
  const totalPages = Math.max(1, Math.ceil(c[0].total / ADMIN_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.seller_status,
            u.is_active, u.deletion_requested_at, u.deletion_reason, u.created_at
     FROM users u ${w}
     ORDER BY (u.deletion_requested_at IS NOT NULL) DESC, u.created_at DESC, u.id DESC
     LIMIT ${ADMIN_PAGE_SIZE} OFFSET ${(current - 1) * ADMIN_PAGE_SIZE}`,
    params
  );
  return {
    users: rows.map((r) => ({ ...r, id: String(r.id) })),
    total: c[0].total,
    page: current,
    totalPages,
  };
}

export async function setUserActiveStatus(id, currentAdminId, isActive) {
  if (id === currentAdminId) return "self";
  const { rowCount } = await query(
    `UPDATE users SET is_active = $2 WHERE id = $1 AND role <> 'admin'`,
    [id, Boolean(isActive)]
  );
  return rowCount === 1 ? "updated" : "not_found";
}

/**
 * Mengubah data dasar user (nama, email, telepon). Role dan status seller TIDAK bisa diubah di sini.
 * @returns {Promise<boolean>} false jika user tidak ada
 * @throws pg 23505 jika email sudah dipakai
 */
export async function updateUserInfo(id, { fullName, email, phone }) {
  const { rowCount } = await query(
    `UPDATE users SET full_name=$2, email=LOWER($3), phone=$4 WHERE id=$1`,
    [id, fullName, email, phone || null]
  );
  return rowCount === 1;
}

/**
 * Menyetujui (ACC) permintaan penghapusan akun user:
 * - Hanya boleh menghapus user yang mengajukan permintaan hapus (deletion_requested_at IS NOT NULL).
 * - Tidak boleh memiliki pesanan berjalan.
 * @returns {Promise<"deleted"|"not_found"|"self"|"not_requested"|"active_orders">}
 */
export async function deleteUser(id, currentAdminId) {
  if (id === currentAdminId) return "self";
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT id, deletion_requested_at FROM users WHERE id = $1 FOR UPDATE`,
      [id]
    );
    if (!rows[0]) return "not_found";
    if (!rows[0].deletion_requested_at) return "not_requested";

    const { rows: act } = await client.query(
      `SELECT EXISTS (
         SELECT 1 FROM store_orders so JOIN orders o ON o.id = so.order_id
         WHERE (o.buyer_id = $1 OR so.seller_id = $1)
           AND so.fulfillment_status IN ('awaiting_payment', 'processing', 'shipped')
       ) AS active`,
      [id]
    );
    if (act[0].active) return "active_orders";

    await client.query(`DELETE FROM users WHERE id = $1`, [id]);
    return "deleted";
  });
}

/** Pendaftaran seller beserta data toko. status kosong = semua. */
export async function listSellerApplications({ status = "" } = {}) {
  const params = [];
  let w = "WHERE u.role='seller'";
  if (["pending", "approved", "rejected"].includes(status)) {
    params.push(status);
    w += ` AND u.seller_status = $1`;
  }
  const { rows } = await query(
    `SELECT u.id, u.full_name, u.email, u.phone, u.seller_status, u.rejection_reason,
            u.created_at, u.reviewed_at, a.full_name AS reviewed_by_name,
            s.name AS store_name, s.description AS store_description
     FROM users u
     LEFT JOIN stores s ON s.seller_id = u.id
     LEFT JOIN users a ON a.id = u.reviewed_by
     ${w}
     ORDER BY (u.seller_status = 'pending') DESC, u.created_at DESC`,
    params
  );
  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/**
 * Keputusan verifikasi. Hanya transisi pending -> approved/rejected yang diizinkan.
 * @returns {Promise<boolean>} false jika seller tidak ada atau sudah diputuskan
 */
export async function decideSeller(sellerId, adminId, decision, rejectionReason = null) {
  const reason = decision === "rejected" ? (rejectionReason?.trim() || null) : null;
  const { rowCount } = await query(
    `UPDATE users
     SET seller_status = $3,
         rejection_reason = $4,
         reviewed_by = $2,
         reviewed_at = NOW()
     WHERE id = $1 AND role = 'seller' AND seller_status = 'pending'`,
    [sellerId, adminId, decision, reason]
  );
  return rowCount === 1;
}

/** Semua produk platform (termasuk nonaktif) untuk moderasi. */
export async function listAllProducts({ q = "", categoryId = "", page = 1 } = {}) {
  const where = [];
  const params = [];
  const add = (v) => (params.push(v), `$${params.length}`);

  if (q) {
    const p = add(`%${likeEscape(q)}%`);
    where.push(`(p.name ILIKE ${p} OR s.name ILIKE ${p})`);
  }
  if (categoryId) {
    where.push(`p.category_id = ${add(categoryId)}`);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const { rows: c } = await query(
    `SELECT COUNT(*)::int AS total
     FROM products p
     LEFT JOIN stores s ON s.seller_id = p.seller_id
     ${w}`,
    params
  );
  const totalPages = Math.max(1, Math.ceil(c[0].total / ADMIN_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const { rows } = await query(
    `SELECT p.id, p.name, p.price, p.stock, p.is_active, p.image_url, p.created_at,
            cat.name AS category_name, u.full_name AS seller_name, s.name AS store_name
     FROM products p
     JOIN categories cat ON cat.id = p.category_id
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN stores s ON s.seller_id = p.seller_id
     ${w}
     ORDER BY p.created_at DESC, p.id DESC
     LIMIT ${ADMIN_PAGE_SIZE} OFFSET ${(current - 1) * ADMIN_PAGE_SIZE}`,
    params
  );
  return {
    products: rows.map((r) => ({ ...r, id: String(r.id), price: Number(r.price) })),
    total: c[0].total,
    page: current,
    totalPages,
  };
}

/** Menghapus produk yang melanggar aturan. Mengembalikan data produk (image_url, seller_id, name) atau null. */
export async function deleteProductAsAdmin(id) {
  const { rows } = await query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING image_url, seller_id, name`,
    [id]
  );
  return rows[0] ?? null;
}

export async function listCategoriesWithUsage() {
  const { rows } = await query(
    `SELECT c.id, c.name, c.description, COUNT(p.id)::int AS product_count
     FROM categories c LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id ORDER BY c.name`
  );
  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/** @throws pg 23505 jika nama kategori sudah ada */
export async function createCategory({ name, description }) {
  await query(`INSERT INTO categories (name, description) VALUES ($1, $2)`, [name, description || null]);
}

/** @throws pg 23505 */
export async function updateCategory(id, { name, description }) {
  const { rowCount } = await query(`UPDATE categories SET name=$2, description=$3 WHERE id=$1`, [id, name, description || null]);
  return rowCount === 1;
}

/**
 * Menghapus kategori hanya jika tidak dipakai produk. Pengecekan dilakukan di dalam transaksi
 * dan FK ON DELETE RESTRICT di database menjadi pengaman terakhir.
 * @returns {Promise<"deleted"|"in_use"|"not_found">}
 */
export async function deleteCategory(id) {
  return withTransaction(async (client) => {
    const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM products WHERE category_id=$1`, [id]);
    if (rows[0].n > 0) return "in_use";
    const r = await client.query(`DELETE FROM categories WHERE id=$1`, [id]);
    return r.rowCount === 1 ? "deleted" : "not_found";
  });
}

/**
 * Daftar pengguna terbaru yang mendaftarkan diri (untuk ringkasan dashboard admin).
 * @param {{ role?: string, limit?: number }} [opts]
 */
export async function listRecentRegistrations({ role = "", limit = 10 } = {}) {
  const params = [];
  let w = "WHERE u.role IN ('buyer', 'seller')";
  if (["buyer", "seller"].includes(role)) {
    params.push(role);
    w = `WHERE u.role = $1`;
  }
  params.push(limit);

  const { rows } = await query(
    `SELECT u.id,
            u.full_name,
            u.email,
            u.role,
            u.seller_status,
            u.created_at,
            s.name AS store_name
     FROM users u
     LEFT JOIN stores s ON s.seller_id = u.id
     ${w}
     ORDER BY u.created_at DESC, u.id DESC
     LIMIT $${params.length}`,
    params
  );

  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/** Menghapus ulasan pembeli yang melanggar regulasi (moderasi Admin). */
export async function deleteReviewAsAdmin(id) {
  const { rowCount } = await query(`DELETE FROM reviews WHERE id = $1`, [id]);
  return rowCount === 1;
}