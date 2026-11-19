import { Pool } from "pg";

/**
 * Koneksi PostgreSQL (hanya dipakai di server).
 * Pool disimpan di `globalThis` agar tidak dibuat ulang saat hot reload di development.
 * Semua query memakai parameter ($1, $2, ...); jangan menyusun SQL dengan string concatenation.
 */
function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur. Salin .env.example menjadi .env.local lalu isi nilainya.");
  }
  return new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
}

/** @returns {Pool} */
function getPool() {
  if (!globalThis.__temukaryaPool) globalThis.__temukaryaPool = createPool();
  return globalThis.__temukaryaPool;
}

/**
 * Menjalankan satu query berparameter.
 * @param {string} text SQL dengan placeholder $1, $2, ...
 * @param {Array<unknown>} [params]
 * @returns {Promise<import("pg").QueryResult>}
 */
export function query(text, params = []) {
  return getPool().query(text, params);
}

/**
 * Menjalankan beberapa query dalam satu transaksi. ROLLBACK otomatis jika callback melempar error.
 * @template T
 * @param {(client: import("pg").PoolClient) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
