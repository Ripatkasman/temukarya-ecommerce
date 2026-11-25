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

/** Untuk reset password via kode pemulihan 6 angka. Jangan kirim hash ke client. */
export async function findUserForRecovery(email) {
  const { rows } = await query(
    `SELECT id, full_name, email, recovery_code_hash, role, seller_status
     FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  if (!rows[0]) return null;
  return { ...toAuthUser(rows[0]), recoveryCodeHash: rows[0].recovery_code_hash };
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
 * Mendaftarkan Buyer atau Seller beserta hash kode pemulihan 6 digit.
 */
export async function registerUser({
  fullName,
  email,
  passwordHash,
  recoveryCodeHash,
  accountType,
  storeName,
  storeDescription,
}) {
  const role = accountType === "seller" ? "seller" : "buyer";
  const sellerStatus = role === "seller" ? "pending" : null;

  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO users (full_name, email, password_hash, recovery_code_hash, role, seller_status)
       VALUES ($1, LOWER($2), $3, $4, $5, $6)
       RETURNING id, full_name, email, role, seller_status`,
      [fullName, email, passwordHash, recoveryCodeHash, role, sellerStatus]
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
 * Memperbarui kata sandi baru sekaligus merotasi kode pemulihan 6 angka.
 */
export async function resetPasswordWithRecovery(userId, newPasswordHash, nextRecoveryCodeHash) {
  const { rowCount } = await query(
    `UPDATE users
     SET password_hash = $2, recovery_code_hash = $3
     WHERE id = $1`,
    [userId, newPasswordHash, nextRecoveryCodeHash]
  );
  return rowCount === 1;
}

/**
 * Menghapus akun seller yang DITOLAK milik sendiri.
 */
export async function deleteRejectedSeller(userId) {
  const { rowCount } = await query(
    `DELETE FROM users WHERE id = $1 AND role = 'seller' AND seller_status = 'rejected'`,
    [userId]
  );
  return rowCount === 1;
}