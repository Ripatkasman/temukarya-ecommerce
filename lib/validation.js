/**
 * Validasi input di server. Validasi di client hanya untuk kenyamanan, bukan keamanan.
 * Setiap fungsi mengembalikan { values, errors }; `errors` kosong berarti valid.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Ambil string dari FormData dan rapikan spasi. */
export function text(formData, key) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Password diambil apa adanya (spasi di ujung boleh menjadi bagian dari password). */
function rawText(formData, key) {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

/** @param {FormData} formData */
export function validateLogin(formData) {
  const values = { email: text(formData, "email").toLowerCase() };
  const password = rawText(formData, "password");
  const errors = {};

  if (!values.email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Format email belum benar.";

  if (!password) errors.password = "Kata sandi wajib diisi.";

  return { values, password, errors };
}

/** @param {FormData} formData */
export function validateRegister(formData) {
  const values = {
    accountType: text(formData, "accountType"),
    fullName: text(formData, "fullName"),
    email: text(formData, "email").toLowerCase(),
    storeName: text(formData, "storeName"),
    storeDescription: text(formData, "storeDescription"),
  };
  const password = rawText(formData, "password");
  const confirmPassword = rawText(formData, "confirmPassword");
  const errors = {};

  // Hanya buyer dan seller yang boleh dipilih. Nilai lain (termasuk "admin") ditolak.
  if (values.accountType !== "buyer" && values.accountType !== "seller") {
    errors.accountType = "Pilih jenis akun: Pembeli atau Penjual.";
  }

  if (!values.fullName) errors.fullName = "Nama lengkap wajib diisi.";
  else if (values.fullName.length < 2) errors.fullName = "Nama lengkap minimal 2 karakter.";
  else if (values.fullName.length > 100) errors.fullName = "Nama lengkap maksimal 100 karakter.";

  if (!values.email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Format email belum benar.";
  else if (values.email.length > 255) errors.email = "Email maksimal 255 karakter.";

  if (!password) errors.password = "Kata sandi wajib diisi.";
  else if (password.length < 8) errors.password = "Kata sandi minimal 8 karakter.";
  else if (password.length > 72) errors.password = "Kata sandi maksimal 72 karakter.";
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Kata sandi harus mengandung huruf dan angka.";
  }

  if (!confirmPassword) errors.confirmPassword = "Ulangi kata sandi Anda.";
  else if (password && confirmPassword !== password) errors.confirmPassword = "Kata sandi tidak sama.";

  if (values.accountType === "seller") {
    if (!values.storeName) errors.storeName = "Nama toko wajib diisi untuk akun penjual.";
    else if (values.storeName.length > 100) errors.storeName = "Nama toko maksimal 100 karakter.";
    if (values.storeDescription.length > 500) errors.storeDescription = "Deskripsi toko maksimal 500 karakter.";
  }

  return { values, password, errors };
}

/**
 * Id dari URL ("/products/12"). Hanya angka, panjang dibatasi agar tidak melewati batas BIGINT.
 * @param {unknown} value
 * @returns {string|null}
 */
export function parseId(value) {
  return typeof value === "string" && /^[1-9]\d{0,17}$/.test(value) ? value : null;
}
