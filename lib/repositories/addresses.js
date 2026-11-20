import { query, withTransaction } from "@/lib/db";

/** Buku alamat buyer. Semua fungsi dibatasi buyer_id dari sesi. Maksimal satu alamat utama (indeks unik parsial). */
export const MAX_ADDRESSES = 10;

const COLS = `id, label, recipient_name, phone, full_address, is_default, created_at`;
const map = (r) => ({ ...r, id: String(r.id) });

export async function listAddresses(buyerId) {
  const { rows } = await query(
    `SELECT ${COLS} FROM addresses WHERE buyer_id = $1 ORDER BY is_default DESC, created_at DESC, id DESC`,
    [buyerId]
  );
  return rows.map(map);
}

export async function getAddress(buyerId, id) {
  const { rows } = await query(`SELECT ${COLS} FROM addresses WHERE id = $1 AND buyer_id = $2`, [id, buyerId]);
  return rows[0] ? map(rows[0]) : null;
}

/**
 * Menambah alamat. Alamat pertama otomatis menjadi alamat utama. Batas jumlah dicek dalam transaksi.
 * @returns {Promise<{ status: "created", id: string } | { status: "limit" }>}
 */
export async function createAddress(buyerId, a) {
  return withTransaction(async (client) => {
    // Kunci baris user agar dua request bersamaan tidak sama-sama lolos batas / sama-sama jadi alamat utama.
    await client.query(`SELECT id FROM users WHERE id = $1 FOR UPDATE`, [buyerId]);
    const { rows: c } = await client.query(`SELECT COUNT(*)::int AS n FROM addresses WHERE buyer_id = $1`, [buyerId]);
    if (c[0].n >= MAX_ADDRESSES) return { status: "limit" };
    const makeDefault = a.isDefault || c[0].n === 0;
    if (makeDefault) await client.query(`UPDATE addresses SET is_default = FALSE WHERE buyer_id = $1 AND is_default`, [buyerId]);
    const { rows } = await client.query(
      `INSERT INTO addresses (buyer_id, label, recipient_name, phone, full_address, is_default)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [buyerId, a.label, a.recipientName, a.phone, a.fullAddress, makeDefault]
    );
    return { status: "created", id: String(rows[0].id) };
  });
}

/** Mengubah alamat milik sendiri. @returns {Promise<boolean>} false jika tidak ditemukan / bukan miliknya */
export async function updateAddress(buyerId, id, a) {
  return withTransaction(async (client) => {
    await client.query(`SELECT id FROM users WHERE id = $1 FOR UPDATE`, [buyerId]);
    if (a.isDefault) await client.query(`UPDATE addresses SET is_default = FALSE WHERE buyer_id = $1 AND is_default AND id <> $2`, [buyerId, id]);
    const { rowCount } = await client.query(
      `UPDATE addresses SET label=$3, recipient_name=$4, phone=$5, full_address=$6, is_default = (is_default OR $7)
       WHERE id = $1 AND buyer_id = $2`,
      [id, buyerId, a.label, a.recipientName, a.phone, a.fullAddress, a.isDefault]
    );
    return rowCount === 1;
  });
}

export async function setDefaultAddress(buyerId, id) {
  return withTransaction(async (client) => {
    await client.query(`SELECT id FROM users WHERE id = $1 FOR UPDATE`, [buyerId]);
    const { rows } = await client.query(`SELECT 1 FROM addresses WHERE id = $1 AND buyer_id = $2`, [id, buyerId]);
    if (!rows[0]) return false;
    await client.query(`UPDATE addresses SET is_default = FALSE WHERE buyer_id = $1 AND is_default`, [buyerId]);
    await client.query(`UPDATE addresses SET is_default = TRUE WHERE id = $1 AND buyer_id = $2`, [id, buyerId]);
    return true;
  });
}

/** Menghapus alamat. Jika yang dihapus adalah alamat utama, alamat terbaru lainnya menjadi alamat utama. */
export async function deleteAddress(buyerId, id) {
  return withTransaction(async (client) => {
    await client.query(`SELECT id FROM users WHERE id = $1 FOR UPDATE`, [buyerId]);
    const { rows } = await client.query(`DELETE FROM addresses WHERE id = $1 AND buyer_id = $2 RETURNING is_default`, [id, buyerId]);
    if (!rows[0]) return false;
    if (rows[0].is_default) {
      await client.query(
        `UPDATE addresses SET is_default = TRUE
         WHERE id = (SELECT id FROM addresses WHERE buyer_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1)`,
        [buyerId]
      );
    }
    return true;
  });
}
