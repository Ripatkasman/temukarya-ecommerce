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

/* ===== Fase 4: validasi dashboard ===== */

/** Bilangan bulat dari string; null jika bukan bilangan bulat murni. */
function toInt(v) {
  return typeof v === "string" && /^-?\d{1,12}$/.test(v.trim()) ? Number(v.trim()) : null;
}

/** @param {FormData} fd */
export function validateUserInfo(fd) {
  const values = { fullName: text(fd, "fullName"), email: text(fd, "email").toLowerCase(), phone: text(fd, "phone") };
  const errors = {};
  if (!values.fullName) errors.fullName = "Nama lengkap wajib diisi.";
  else if (values.fullName.length < 2 || values.fullName.length > 100) errors.fullName = "Nama lengkap 2 sampai 100 karakter.";
  if (!values.email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_RE.test(values.email) || values.email.length > 255) errors.email = "Format email belum benar.";
  if (values.phone && !/^[0-9+\-\s()]{6,20}$/.test(values.phone)) errors.phone = "Nomor telepon 6 sampai 20 karakter (angka, +, -, spasi).";
  return { values, errors };
}

/** Profil sendiri: email tidak bisa diubah. */
export function validateProfile(fd) {
  const { values, errors } = validateUserInfo(fd);
  delete errors.email;
  return { values: { fullName: values.fullName, phone: values.phone }, errors };
}

export function validatePasswordChange(fd) {
  const current = rawText(fd, "currentPassword");
  const next = rawText(fd, "newPassword");
  const confirm = rawText(fd, "confirmPassword");
  const errors = {};
  if (!current) errors.currentPassword = "Kata sandi saat ini wajib diisi.";
  if (!next) errors.newPassword = "Kata sandi baru wajib diisi.";
  else if (next.length < 8 || next.length > 72) errors.newPassword = "Kata sandi baru 8 sampai 72 karakter.";
  else if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) errors.newPassword = "Kata sandi harus mengandung huruf dan angka.";
  if (!confirm) errors.confirmPassword = "Ulangi kata sandi baru.";
  else if (next && confirm !== next) errors.confirmPassword = "Kata sandi tidak sama.";
  return { current, next, errors };
}

export function validateCategory(fd) {
  const values = { name: text(fd, "name"), description: text(fd, "description") };
  const errors = {};
  if (!values.name) errors.name = "Nama kategori wajib diisi.";
  else if (values.name.length > 80) errors.name = "Nama kategori maksimal 80 karakter.";
  if (values.description.length > 300) errors.description = "Deskripsi maksimal 300 karakter.";
  return { values, errors };
}

export function validateStore(fd) {
  const values = { name: text(fd, "name"), description: text(fd, "description") };
  const errors = {};
  if (!values.name) errors.name = "Nama toko wajib diisi.";
  else if (values.name.length > 100) errors.name = "Nama toko maksimal 100 karakter.";
  if (values.description.length > 500) errors.description = "Deskripsi maksimal 500 karakter.";
  return { values, errors };
}

/** Semua field produk wajib (nama, deskripsi, harga, stok, kategori); gambar divalidasi terpisah. */
export function validateProduct(fd) {
  const values = {
    name: text(fd, "name"), description: text(fd, "description"),
    price: text(fd, "price"), stock: text(fd, "stock"), categoryId: text(fd, "categoryId"),
    isActive: fd.get("isActive") === "on",
  };
  const errors = {};
  if (!values.name) errors.name = "Nama produk wajib diisi.";
  else if (values.name.length > 150) errors.name = "Nama produk maksimal 150 karakter.";
  if (!values.description) errors.description = "Deskripsi wajib diisi.";
  else if (values.description.length > 5000) errors.description = "Deskripsi maksimal 5000 karakter.";
  const price = toInt(values.price);
  if (price === null) errors.price = "Harga harus berupa angka bulat (rupiah).";
  else if (price <= 0) errors.price = "Harga harus lebih dari 0.";
  else if (price > 9_999_999_999) errors.price = "Harga terlalu besar.";
  const stock = toInt(values.stock);
  if (stock === null) errors.stock = "Stok harus berupa angka bulat.";
  else if (stock < 0) errors.stock = "Stok tidak boleh negatif.";
  else if (stock > 1_000_000) errors.stock = "Stok maksimal 1.000.000.";
  const categoryId = parseId(values.categoryId);
  if (!categoryId) errors.categoryId = "Pilih kategori.";
  return { values, parsed: { price, stock, categoryId }, errors };
}

export function validateCheckout(fd) {
  const values = { recipientName: text(fd, "recipientName"), recipientPhone: text(fd, "recipientPhone"), shippingAddress: text(fd, "shippingAddress"), notes: text(fd, "notes") };
  const errors = {};
  if (!values.recipientName) errors.recipientName = "Nama penerima wajib diisi.";
  else if (values.recipientName.length > 100) errors.recipientName = "Nama penerima maksimal 100 karakter.";
  if (!values.recipientPhone) errors.recipientPhone = "Nomor telepon wajib diisi.";
  else if (!/^[0-9+\-\s()]{6,20}$/.test(values.recipientPhone)) errors.recipientPhone = "Nomor telepon 6 sampai 20 karakter (angka, +, -, spasi).";
  if (!values.shippingAddress) errors.shippingAddress = "Alamat pengiriman wajib diisi.";
  else if (values.shippingAddress.length < 10) errors.shippingAddress = "Alamat terlalu singkat. Tulis alamat lengkap.";
  else if (values.shippingAddress.length > 500) errors.shippingAddress = "Alamat maksimal 500 karakter.";
  if (values.notes.length > 300) errors.notes = "Catatan maksimal 300 karakter.";
  return { values, errors };
}

export function validateReview(fd) {
  const rating = toInt(text(fd, "rating"));
  const comment = text(fd, "comment");
  const errors = {};
  if (rating === null || rating < 1 || rating > 5) errors.rating = "Pilih rating 1 sampai 5.";
  if (!comment) errors.comment = "Ulasan wajib diisi.";
  else if (comment.length > 1000) errors.comment = "Ulasan maksimal 1000 karakter.";
  return { rating, comment, errors };
}

/** Jumlah item keranjang: bilangan bulat 1..999. */
export function parseQuantity(v) {
  const n = toInt(typeof v === "string" ? v : "");
  return n !== null && n >= 1 && n <= 999 ? n : null;
}

/** Alamat pengiriman buyer. */
export function validateAddress(fd) {
  const values = {
    label: text(fd, "label"), recipientName: text(fd, "recipientName"), phone: text(fd, "phone"),
    fullAddress: text(fd, "fullAddress"), isDefault: fd.get("isDefault") === "on",
  };
  const errors = {};
  if (!values.label) errors.label = "Label wajib diisi (mis. Rumah, Kantor).";
  else if (values.label.length > 50) errors.label = "Label maksimal 50 karakter.";
  if (!values.recipientName) errors.recipientName = "Nama penerima wajib diisi.";
  else if (values.recipientName.length > 100) errors.recipientName = "Nama penerima maksimal 100 karakter.";
  if (!values.phone) errors.phone = "Nomor telepon wajib diisi.";
  else if (!/^[0-9+\-\s()]{6,20}$/.test(values.phone)) errors.phone = "Nomor telepon 6 sampai 20 karakter (angka, +, -, spasi).";
  if (!values.fullAddress) errors.fullAddress = "Alamat lengkap wajib diisi.";
  else if (values.fullAddress.length < 10) errors.fullAddress = "Alamat terlalu singkat. Tulis alamat lengkap.";
  else if (values.fullAddress.length > 500) errors.fullAddress = "Alamat maksimal 500 karakter.";
  return { values, errors };
}
