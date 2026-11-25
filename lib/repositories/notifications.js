import { query } from "@/lib/db";

/** Membuat notifikasi baru untuk user tertentu. */
export async function createNotification({ userId, title, message, type = "info" }) {
  if (!userId) return;
  await query(
    `INSERT INTO notifications (user_id, title, message, type)
     VALUES ($1, $2, $3, $4)`,
    [userId, title, message, type]
  );
}

/** Daftar notifikasi milik user (terbaru di atas). */
export async function listNotifications(userId) {
  const { rows } = await query(
    `SELECT id, title, message, type, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC
     LIMIT 50`,
    [userId]
  );
  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/** Hitung notifikasi yang belum dibaca. */
export async function getUnreadNotificationCount(userId) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS total
     FROM notifications
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );
  return rows[0]?.total ?? 0;
}

/** Tandai satu notifikasi sebagai sudah dibaca. */
export async function markNotificationAsRead(userId, notificationId) {
  await query(
    `UPDATE notifications SET is_read = TRUE
     WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
}

/** Tandai semua notifikasi user sebagai sudah dibaca. */
export async function markAllNotificationsAsRead(userId) {
  await query(
    `UPDATE notifications SET is_read = TRUE
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );
}