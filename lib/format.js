/** Format angka ke Rupiah, contoh: 185000 -> "Rp185.000" */
export function formatRupiah(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** "19 November 2026" */
export function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(value));
}

/** "19 Nov 2026, 14.30" */
export function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
