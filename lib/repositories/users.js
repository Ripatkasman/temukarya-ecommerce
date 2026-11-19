import { query, withTransaction } from "@/lib/db";

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} fullName
 * @property {string} email
 * @property {"admin"|"seller"|"buyer"} role
 * @property {"pending"|"approved"|"rejected"|null} sellerStatus
 */

function toAuthUser(row) {
  return {
    id: String(row.id),
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    sellerStatus: row.seller_status,
  };
}

/** Untuk login: mengembalikan juga password_hash. Jangan kirim hasilnya ke client. */
export async function findUserForLogin(email) {
  const { rows } = await query(
    `SELECT id, full_name, email, password_hash, role, seller_status
     FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  if (!rows[0]) return null;
  return { ...toAuthUser(rows[0]), passwordHash: rows[0].password_hash };
}

/** Dipakai setiap request untuk membaca role/status terbaru dari database. */
export async function findUserById(id) {
  const { rows } = await query(
    `SELECT id, full_name, email, role, seller_status FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] ? toAuthUser(rows[0]) : null;
}

/**
 * Mendaftarkan Buyer atau Seller. Role dibatasi di sini (bukan dipercaya dari client):
 * Admin tidak bisa dibuat lewat fungsi ini, dan Seller SELALU dimulai dengan status 'pending'.
 * @param {{ fullName: string, email: string, passwordHash: string, accountType: "buyer"|"seller",
 *           storeName?: string, storeDescription?: string }} input
 * @returns {Promise<AuthUser>}
 * @throws error pg dengan code 23505 jika email sudah terdaftar
 */
export async function registerUser({ fullName, email, passwordHash, accountType, storeName, storeDescription }) {
  const role = accountType === "seller" ? "seller" : "buyer";
  const sellerStatus = role === "seller" ? "pending" : null;

  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role, seller_status)
       VALUES ($1, LOWER($2), $3, $4, $5)
       RETURNING id, full_name, email, role, seller_status`,
      [fullName, email, passwordHash, role, sellerStatus]
    );
    const user = rows[0];
    if (role === "seller") {
      await client.query(
        `INSERT INTO stores (seller_id, name, description) VALUES ($1, $2, $3)`,
        [user.id, storeName, storeDescription || null]
      );
    }
    return toAuthUser(user);
  });
}

/**
 * Menghapus akun seller yang DITOLAK milik sendiri. Kondisi role dan status ada di SQL,
 * jadi akun lain (buyer, admin, seller pending/approved) tidak akan pernah terhapus lewat fungsi ini.
 * @returns {Promise<boolean>} true jika terhapus
 */
export async function deleteRejectedSeller(userId) {
  const { rowCount } = await query(
    `DELETE FROM users WHERE id = $1 AND role = 'seller' AND seller_status = 'rejected'`,
    [userId]
  );
  return rowCount === 1;
}
