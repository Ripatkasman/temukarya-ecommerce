# TemuKarya

> Tempat Karya Lokal Bertemu Kepercayaan.

Marketplace multi-seller (Admin, Seller, Buyer, Guest) untuk tugas final Praktikum Pemrograman Web 2026.
Stack: Next.js (App Router, JSX), Tailwind CSS v4, Lucide, PostgreSQL (Raw SQL via `pg`).
Spesifikasi lengkap ada di `AGENT.md`.

## Status

| Fase | Isi | Status |
|---|---|---|
| 1 | Inspeksi dan rencana | Selesai |
| 2 | Fondasi desain dan komponen dasar | **Selesai** |
| 3 | Halaman publik dan autentikasi | **Selesai** (sudah memakai database sungguhan) |
| 4 | Dashboard Buyer/Seller/Admin | Belum |
| 5 | Backend, database, checkout, ulasan | Belum |
| 6 | Fitur opsional | Belum |
| 7 | Pengujian dan dokumentasi akhir | Belum |

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Halaman rujukan komponen (hanya saat development): `/design-system` dan `/design-system/dashboard`.

### Database (wajib sejak Fase 3)

1. Buat database `temukarya` di pgAdmin.
2. Jalankan `database/schema.sql`, lalu `database/seed.sql` (Query Tool, F5).
   Catatan: `schema.sql` menghapus tabel lama, jangan dijalankan ulang setelah ada data.
3. Salin `.env.example` menjadi `.env.local` dan isi `DATABASE_URL` serta `SESSION_SECRET` (minimal 32 karakter). Fase 3 sudah membutuhkan database, jadi langkah ini wajib sebelum `npm run dev`.

Seed juga berisi 12 produk dari 3 toko, 1 pesanan selesai, dan 3 ulasan (data demo). Akun demo (dari `seed.sql`):

| Peran | Email | Password |
|---|---|---|
| Admin | admin@temukarya.id | Admin123! |
| Seller aktif | seller@temukarya.id | Seller123! |
| Seller pending | pending@temukarya.id | Seller123! |
| Seller ditolak | rejected@temukarya.id | Seller123! |
| Seller aktif 2 | seller2@temukarya.id | Seller123! |
| Seller aktif 3 | seller3@temukarya.id | Seller123! |
| Buyer | buyer@temukarya.id | Buyer123! |

## Struktur

```
app/                 halaman dan layout (App Router)
  (public)/          beranda, /products, /products/[id], /stores/[id], /about
  (auth)/            /login, /register
  seller/pending     status seller pending/ditolak (+ hapus akun)
  admin/            ringkasan, pengguna, verifikasi seller, produk, kategori
  seller/(dashboard) ringkasan, toko, produk (CRUD + upload gambar), pesanan masuk
  buyer/            ringkasan, profil, keranjang + checkout, riwayat & detail pesanan, ulasan
  uploads/[name]    route yang menyajikan gambar unggahan dari folder uploads/
components/
  brand/             BrandLogo (logo sementara)
  ui/                Button, Input, PasswordInput, Textarea, Select, Checkbox, Badge,
                     StatusBadges, Modal, ConfirmationDialog, FormDialog, Toast,
                     Dropdown, Pagination, States (Empty/Error/Loading/Skeleton)
  layout/            Navbar, Footer
  commerce/          ProductCard, ProductGrid, ProductImage, Rating, PriceDisplay,
                     CategoryCard, StoreCard, ReviewCard
  dashboard/         DashboardShell, PageHeader, StatCard, DataTable
lib/                 cn.js, format.js, db.js (pool pg), session.js (cookie bertanda tangan),
                     auth.js (guard role), validation.js
  repositories/      SQL mentah per domain (users, catalog, cart)
  actions/           Server Actions (auth, cart, admin, seller, buyer)
  uploads.js         validasi (magic bytes, 2 MB) dan penyimpanan gambar ke folder uploads/
database/            schema.sql, seed.sql
public/brand/        logo-mark.svg (sementara)
public/uploads/      gambar unggahan (Fase 5)
```

## Design tokens

Didefinisikan di `app/globals.css` (blok `@theme`). Pakai nama token, bukan hex mentah:
`bg-primary`, `bg-cream`, `bg-accent`, `text-charcoal`, `bg-canvas`, `border-line`,
`text-muted-strong`, `bg-success-soft`, dst.

Catatan kontras (hasil pengecekan WCAG):
- `muted` (#777B75) hanya 4.1:1, jadi dipakai untuk teks besar/dekoratif saja. Teks kecil sekunder memakai `muted-strong` (5.8:1).
- Teks putih di atas `accent` (terakota) hanya 2.7:1, jadi tombol aksen memakai teks `charcoal` (5.2:1).

## Yang perlu diganti sebelum final

- Logo: `public/brand/logo-mark.svg` dan `components/brand/BrandLogo.jsx` (logo sementara buatan sendiri).
- `app/design-system` otomatis 404 pada build production; boleh dihapus sebelum pengumpulan.

## Keputusan desain penting (Fase 4)

- **Checkout atomik:** satu transaksi PostgreSQL. Stok dikurangi dengan `UPDATE ... WHERE stock >= jumlah`, sehingga dua pembeli yang berebut stok terakhir tidak bisa sama-sama berhasil. Gagal di langkah mana pun berarti rollback total dan keranjang tidak dikosongkan.
- **Pesanan multi-toko:** satu `orders` (induk) berisi beberapa `store_orders` (satu per toko). Status induk **tidak disimpan**, melainkan diturunkan dari sub-order (lihat `deriveOrderStatus` di `lib/repositories/buyer.js`). Seller hanya melihat dan mengubah sub-order miliknya.
- **Alur status oleh seller:** Menunggu Pembayaran → Diproses → Dikirim → Selesai; Dibatalkan hanya dari Menunggu Pembayaran atau Diproses dan mengembalikan stok. Pembayaran hanya simulasi: "Proses pesanan" berarti seller menganggap pembayaran sudah diterima.
- **Ulasan:** hanya untuk item dari sub-order berstatus Selesai milik pembeli itu sendiri. `product_id` dan `buyer_id` diturunkan di SQL, bukan dari form.
- **Admin:** boleh mengubah nama/email/telepon, tetapi tidak role atau status seller. Tidak bisa menghapus akun sendiri. Menghapus produk memang menghapus permanen (sesuai tugas); riwayat pesanan tetap aman karena item pesanan menyimpan nama dan harga saat pembelian.
- **Upload gambar:** disimpan di folder `uploads/` (di luar `public/`) dan disajikan oleh `app/uploads/[name]/route.js`, karena file yang ditambahkan ke `public/` setelah build tidak disajikan oleh `next start`. Tipe file dicek dari isi file (JPG/PNG/WebP), maksimal 2 MB.

## Batasan yang diketahui

- Satu produk hanya punya satu gambar (sesuai skema), jadi "galeri" di halaman detail berisi satu gambar.
- Gambar produk di seed adalah placeholder lokal berwarna per kategori, bukan foto asli.
- Bagian "rekomendasi acak" di beranda pembeli belum ada; yang tampil: produk terbaru dan paling banyak diulas.
- Wishlist dan manajemen alamat pengiriman (opsional) belum dibuat; alamat diisi saat checkout.
- Belum ada pembatasan percobaan login (rate limiting).
- Setelah form registrasi/login gagal divalidasi, kolom kata sandi dikosongkan (perilaku bawaan form React). Form di dashboard tidak dikosongkan.
- File gambar lama yang tidak terpakai dihapus saat diganti/dihapus, tetapi tidak ada pembersihan terjadwal untuk file yatim akibat kegagalan di tengah proses.
- Pembayaran hanya simulasi (tanpa payment gateway).
