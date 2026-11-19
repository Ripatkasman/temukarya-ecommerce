import { query } from "@/lib/db";

/**
 * Query katalog publik. Semua fungsi hanya mengembalikan produk yang:
 *  - aktif (is_active), dan
 *  - milik seller berstatus 'approved'.
 * Produk seller pending/rejected tidak pernah tampil ke publik.
 */
export const PAGE_SIZE = 12;

const PUBLIC_PRODUCT_FROM = `
  FROM products p
  JOIN users u      ON u.id = p.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
  JOIN stores s     ON s.seller_id = p.seller_id
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN (
    SELECT product_id, AVG(rating)::float AS rating_avg, COUNT(*)::int AS rating_count
    FROM reviews GROUP BY product_id
  ) rv ON rv.product_id = p.id`;

const PRODUCT_COLUMNS = `
  p.id, p.name, p.price, p.stock, p.image_url, p.created_at,
  p.category_id, c.name AS category_name,
  s.id AS store_id, s.name AS store_name,
  rv.rating_avg, COALESCE(rv.rating_count, 0) AS rating_count`;

/** Nilai ORDER BY hanya dari daftar ini (tidak pernah dari input mentah). */
const SORTS = {
  newest: "p.created_at DESC, p.id DESC",
  price_asc: "p.price ASC, p.id DESC",
  price_desc: "p.price DESC, p.id DESC",
  popular: "COALESCE(rv.rating_count, 0) DESC, rv.rating_avg DESC NULLS LAST, p.created_at DESC",
};
export const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga terendah" },
  { value: "price_desc", label: "Harga tertinggi" },
];

function mapProduct(r) {
  return { ...r, id: String(r.id), price: Number(r.price), store_id: String(r.store_id), category_id: String(r.category_id) };
}

/** Escape karakter khusus LIKE agar pencarian "50%" tidak dianggap wildcard. */
function escapeLike(value) {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/**
 * Daftar produk publik dengan pencarian, filter, urutan, dan pagination.
 * @param {{ q?: string, categoryId?: string|null, minPrice?: number|null, maxPrice?: number|null,
 *           sort?: keyof typeof SORTS, page?: number, storeId?: string|null }} filters
 */
export async function listProducts({ q = "", categoryId = null, minPrice = null, maxPrice = null, sort = "newest", page = 1, storeId = null } = {}) {
  const where = ["p.is_active = TRUE"];
  const params = [];
  const add = (value) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (q) where.push(`p.name ILIKE ${add(`%${escapeLike(q)}%`)}`);
  if (categoryId) where.push(`p.category_id = ${add(categoryId)}`);
  if (storeId) where.push(`s.id = ${add(storeId)}`);
  if (minPrice !== null) where.push(`p.price >= ${add(minPrice)}`);
  if (maxPrice !== null) where.push(`p.price <= ${add(maxPrice)}`);
  const whereSql = `WHERE ${where.join(" AND ")}`;

  const { rows: countRows } = await query(`SELECT COUNT(*)::int AS total ${PUBLIC_PRODUCT_FROM} ${whereSql}`, params);
  const total = countRows[0].total;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const orderBy = SORTS[sort] ?? SORTS.newest;
  const { rows } = await query(
    `SELECT ${PRODUCT_COLUMNS} ${PUBLIC_PRODUCT_FROM} ${whereSql}
     ORDER BY ${orderBy}
     LIMIT ${PAGE_SIZE} OFFSET ${(currentPage - 1) * PAGE_SIZE}`,
    params
  );
  return { products: rows.map(mapProduct), total, page: currentPage, totalPages };
}

/** Produk terbaru atau terpopuler untuk beranda. */
export async function listHomeProducts({ sort = "newest", limit = 8 } = {}) {
  const orderBy = SORTS[sort] ?? SORTS.newest;
  const { rows } = await query(
    `SELECT ${PRODUCT_COLUMNS} ${PUBLIC_PRODUCT_FROM}
     WHERE p.is_active = TRUE AND p.stock > 0
     ORDER BY ${orderBy}
     LIMIT $1`,
    [limit]
  );
  return rows.map(mapProduct);
}

/** Satu produk publik beserta data toko, atau null jika tidak ada / tidak publik. */
export async function getProduct(id) {
  const { rows } = await query(
    `SELECT ${PRODUCT_COLUMNS}, p.description,
            s.description AS store_description, s.image_url AS store_image,
            (SELECT COUNT(*)::int FROM products sp
               WHERE sp.seller_id = s.seller_id AND sp.is_active) AS store_product_count
     ${PUBLIC_PRODUCT_FROM}
     WHERE p.id = $1 AND p.is_active = TRUE`,
    [id]
  );
  return rows[0] ? mapProduct(rows[0]) : null;
}

/** Kategori beserta jumlah produk publik. */
export async function listCategories({ popularFirst = false, limit = null, onlyWithProducts = false } = {}) {
  const { rows } = await query(
    `SELECT c.id, c.name, c.description, COUNT(p.id)::int AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.is_active
       AND EXISTS (SELECT 1 FROM users u WHERE u.id = p.seller_id AND u.role = 'seller' AND u.seller_status = 'approved')
     GROUP BY c.id
     ${onlyWithProducts ? "HAVING COUNT(p.id) > 0" : ""}
     ORDER BY ${popularFirst ? "COUNT(p.id) DESC, c.name" : "c.name"}
     ${limit ? "LIMIT $1" : ""}`,
    limit ? [limit] : []
  );
  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/** Toko dengan seller disetujui, diurutkan dari yang paling banyak produk aktif. */
export async function listRecommendedStores(limit = 3) {
  const { rows } = await query(
    `SELECT s.id, s.name AS store_name, s.description, s.image_url AS store_image,
            COUNT(p.id)::int AS product_count
     FROM stores s
     JOIN users u ON u.id = s.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
     JOIN products p ON p.seller_id = s.seller_id AND p.is_active
     GROUP BY s.id
     ORDER BY COUNT(p.id) DESC, s.name
     LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/** Toko publik (seller disetujui) atau null. */
export async function getStore(id) {
  const { rows } = await query(
    `SELECT s.id, s.name AS store_name, s.description, s.image_url AS store_image, s.created_at,
            (SELECT COUNT(*)::int FROM products p WHERE p.seller_id = s.seller_id AND p.is_active) AS product_count
     FROM stores s
     JOIN users u ON u.id = s.seller_id AND u.role = 'seller' AND u.seller_status = 'approved'
     WHERE s.id = $1`,
    [id]
  );
  return rows[0] ? { ...rows[0], id: String(rows[0].id) } : null;
}

/**
 * Ulasan yang terbit untuk sebuah produk. Nama pembeli disamarkan (nama depan + inisial belakang).
 * @returns {Promise<Array<{ id: string, buyer_name: string, rating: number, comment: string, created_at: Date }>>}
 */
export async function listReviews(productId, limit = 10) {
  const { rows } = await query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.full_name
     FROM reviews r
     JOIN users u ON u.id = r.buyer_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC, r.id DESC
     LIMIT $2`,
    [productId, limit]
  );
  return rows.map((r) => {
    const parts = r.full_name.trim().split(/\s+/);
    const buyer_name = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
    return { id: String(r.id), buyer_name, rating: r.rating, comment: r.comment, created_at: r.created_at };
  });
}
