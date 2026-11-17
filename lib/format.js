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
