/**
 * Pembatas percobaan login gagal (in-memory).
 * 5 kegagalan per kombinasi IP + email dalam 15 menit; login berhasil mereset hitungan.
 * Keterbatasan (didokumentasikan): hitungan hilang saat server restart dan tidak dibagi antar instance.
 * Untuk produksi multi-instance, pindahkan ke penyimpanan bersama (mis. tabel PostgreSQL atau Redis).
 */
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

/** @type {Map<string, { count: number, resetAt: number }>} */
const store = (globalThis.__temukaryaLoginAttempts ??= new Map());

function prune(now) {
  if (store.size < 5000) return;
  for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
}

/** @returns {{ limited: boolean, retryAfterSeconds: number }} */
export function checkLoginLimit(key) {
  const now = Date.now();
  const e = store.get(key);
  if (!e || e.resetAt <= now) return { limited: false, retryAfterSeconds: 0 };
  return e.count >= MAX_FAILURES
    ? { limited: true, retryAfterSeconds: Math.ceil((e.resetAt - now) / 1000) }
    : { limited: false, retryAfterSeconds: 0 };
}

export function recordLoginFailure(key) {
  const now = Date.now();
  prune(now);
  const e = store.get(key);
  if (!e || e.resetAt <= now) store.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else e.count += 1;
}

export function clearLoginFailures(key) {
  store.delete(key);
}
