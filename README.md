# TemuKarya

> Tempat karya lokal bertemu kepercayaan.

Marketplace multi-seller untuk **Tugas Final Praktikum Pemrograman Web 2026 (Proyek 1: E-Commerce)**.
Peran: **Admin, Seller, Buyer, dan Guest**.

**Stack:** Next.js 16 (App Router, JSX), Tailwind CSS v4, PostgreSQL dengan **raw SQL** (`pg`, tanpa ORM),
Server Actions **dan** Route Handler REST.

## Menjalankan (untuk penilai)

Prasyarat: **Node.js 20.9+** (disarankan 22 LTS) dan **PostgreSQL 13+**.

```bash
git clone <url-repository> && cd <folder>
npm install
```

**1. Siapkan database (pgAdmin)**

1. Buat database kosong bernama `temukarya`.
2. Buka *Query Tool* pada database itu, jalankan isi `database/schema.sql` (F5), lalu `database/seed.sql` (F5).
   Urutannya harus begitu. `schema.sql` menghapus tabel lama sebelum membuatnya ulang, jadi jalankan ulang hanya jika ingin mereset data.

   Alternatif tanpa pgAdmin, setelah langkah 3: `npm run db:reset -- --yes` (menjalankan kedua file yang sama).

**2. Atur environment**

Salin `.env.example` menjadi `.env.local`, lalu isi:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/temukarya
SESSION_SECRET=<string acak minimal 32 karakter>
```

Contoh membuat `SESSION_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**3. Jalankan**

```bash
npm run dev                 # http://localhost:3000  (mode pengembangan)
# atau mode produksi:
npm run build && npm start
```

Folder `uploads/` (gambar unggahan penjual) dibuat otomatis dan harus bisa ditulis.

### Akun demo (dari `seed.sql`)

| Peran | Email | Password |
|---|---|---|
| Admin | admin@temukarya.id | Admin123! |
| Seller aktif | seller@temukarya.id | Seller123! |
| Seller aktif 2 | seller2@temukarya.id | Seller123! |
| Seller aktif 3 | seller3@temukarya.id | Seller123! |
| Seller pending | pending@temukarya.id | Seller123! |
| Seller ditolak | rejected@temukarya.id | Seller123! |
| Buyer | buyer@temukarya.id | Buyer123! |

Seed juga berisi 6 kategori, 12 produk dari 3 toko, 1 pesanan selesai, dan 3 ulasan (data demo).
Password ini hanya untuk demo.

## Fitur per peran

| Peran | Yang bisa dilakukan |
|---|---|
| **Guest** | Melihat beranda, daftar produk (cari, filter, urutkan), detail produk + ulasan, halaman toko. Add to Cart dan favorit mengarah ke login. |
| **Buyer** | Beranda dengan rekomendasi acak; keranjang (ubah jumlah, hapus); checkout atomik; riwayat dan pelacakan pesanan; rating dan ulasan setelah pesanan Selesai; profil dan kata sandi; buku alamat; wishlist. |
| **Seller** | Mendaftar (status *Pending*), halaman "Akun Anda sedang ditinjau", tombol Hapus Akun jika ditolak. Setelah disetujui: kelola toko (nama, deskripsi, gambar), CRUD produk (stok, kategori, gambar), pesanan masuk khusus tokonya, ubah status pesanan. |
| **Admin** | Ringkasan platform; lihat, ubah, hapus pengguna (kecuali diri sendiri); verifikasi seller (Approve/Reject); hapus produk yang melanggar; CRUD kategori. |

Kesesuaian butir demi butir dengan PDF tugas ada di [`docs/KESESUAIAN_TUGAS.md`](docs/KESESUAIAN_TUGAS.md).

## Arsitektur

```
Browser ── halaman/form ──► Server Action ─┐
        └─ fetch /api/** ─► Route Handler ─┴─► lib/services  (validasi + aturan bisnis)
                                                  └─► lib/repositories  (raw SQL berparameter) ──► PostgreSQL
```

Server Action dan Route Handler hanyalah **adapter tipis** di atas satu lapisan logika, sehingga aturan bisnis tidak
bisa berbeda antar jalur dan hanya ditulis satu kali.

```
app/                 halaman (App Router)
  (public)/          beranda, /products, /products/[id], /stores/[id], /about
  (auth)/            /login, /register
  admin/             ringkasan, pengguna, verifikasi seller, produk, kategori
  seller/(dashboard) ringkasan, toko, produk (CRUD + upload), pesanan masuk
  seller/pending     status seller pending/ditolak
  buyer/             ringkasan, profil, alamat, favorit, keranjang + checkout, pesanan, ulasan
  api/               Route Handler REST
  uploads/[name]     menyajikan gambar unggahan
components/          ui/ (komponen dasar), layout/, commerce/, dashboard/, auth/, brand/
lib/                 db.js, session.js, auth.js, api.js, validation.js, uploads.js, rateLimit.js
  repositories/      SQL mentah per domain
  services/          logika bisnis per peran
  actions/           Server Actions
database/            schema.sql, seed.sql      (di luar /app, sesuai aturan tugas)
scripts/db-reset.mjs
tests/               uji otomatis (lihat tests/README.md)
docs/                KESESUAIAN_TUGAS.md, PRESENTASI.md
proxy.js             penjaga awal route dashboard (pengganti middleware di Next.js 16)
```

## API (Route Handler)

Autentikasi: cookie sesi `tk_session` (httpOnly, SameSite=Lax) dari `POST /api/auth/login`. Body JSON, atau
`multipart/form-data` untuk endpoint dengan gambar. Respons selalu `{ ok, message?, data?, errors? }` dengan kode status:
200/201 sukses, 401 belum login, 403 role salah / seller belum disetujui, 404 tidak ada atau bukan milik Anda,
409 konflik (duplikat, stok, transisi status), 415 tipe body salah, 422 validasi per field, 429 terlalu banyak percobaan login,
500 kesalahan server. Request pengubah data dengan header `Origin` dari host lain ditolak (403).

| Metode dan path | Akses | Fungsi |
|---|---|---|
| POST `/api/auth/login`, `/register`, `/logout` | publik | masuk, daftar (buyer/seller), keluar |
| GET `/api/auth/me` | login | user saat ini |
| DELETE `/api/auth/account` | seller ditolak | hapus akun sendiri |
| GET `/api/products` | publik | daftar: `q` (nama produk, toko, atau kategori), `category`, `min`, `max`, `rating` (3 atau 4), `stok=1`, `sort` (newest, popular, rating, price_asc, price_desc), `page` |
| GET `/api/products/:id` | publik | detail + ulasan |
| POST `/api/products` | seller | tambah produk (multipart, gambar wajib) |
| PATCH `/api/products/:id` | seller pemilik | ubah produk |
| DELETE `/api/products/:id` | seller pemilik / admin | hapus produk (admin: moderasi) |
| GET `/api/categories` | publik | daftar kategori |
| POST, PATCH, DELETE `/api/categories[/:id]` | admin | CRUD kategori (409 jika dipakai produk) |
| GET, POST `/api/cart` | buyer | lihat / tambah ke keranjang |
| PATCH, DELETE `/api/cart/items/:id` | buyer pemilik | ubah jumlah / hapus item |
| GET, POST `/api/orders` | buyer | riwayat / checkout atomik |
| GET `/api/orders/:id` | buyer pemilik | detail + pelacakan |
| POST `/api/order-items/:id/review` | buyer pemilik | ulasan (hanya sub-order Selesai) |
| GET, PATCH `/api/profile`, PATCH `/api/profile/password` | buyer | profil dan kata sandi |
| GET, POST `/api/wishlist`, DELETE `/api/wishlist/:productId` | buyer | daftar favorit |
| GET, POST `/api/addresses`, PATCH, DELETE `/api/addresses/:id`, POST `/api/addresses/:id/default` | buyer | buku alamat (maks. 10) |
| GET, PATCH `/api/seller/store` | seller | informasi toko (+ gambar) |
| GET `/api/seller/orders` | seller | pesanan masuk (hanya item tokonya) |
| PATCH `/api/seller/orders/:id/status` | seller pemilik | ubah status sub-order |
| GET `/api/admin/users`, PATCH/DELETE `/api/admin/users/:id` | admin | kelola pengguna |
| GET `/api/admin/sellers`, POST `/api/admin/sellers/:id/decision` | admin | verifikasi seller (`approve`/`reject`) |

```bash
curl -c jar.txt -H "Content-Type: application/json" \
  -d '{"email":"buyer@temukarya.id","password":"Buyer123!"}' http://localhost:3000/api/auth/login
curl -b jar.txt -H "Content-Type: application/json" \
  -d '{"productId":"1","quantity":2}' http://localhost:3000/api/cart
```

## Keamanan dan integritas data

| Lapisan | Perlindungan |
|---|---|
| Autentikasi | Password di-hash bcrypt. Sesi = cookie `httpOnly`, `SameSite=Lax`, bertanda tangan HMAC. Role dan status seller dibaca ulang dari database di setiap request. Perbandingan password tetap dijalankan (hash tiruan) saat email tidak ada agar waktu respons tidak membocorkan email terdaftar. |
| Pembatas login | 5 kegagalan per kombinasi IP + email dalam 15 menit menghasilkan HTTP 429; login berhasil mereset hitungan. |
| Proxy (`proxy.js`) | Request ke `/admin`, `/seller`, `/buyer` tanpa cookie sesi dialihkan ke `/login?next=`. Hanya penjagaan awal; otorisasi sebenarnya di server. |
| Otorisasi server | `requireRole()` (halaman dan Server Action) serta `route({ roles })` (Route Handler). Seller hanya lolos jika `approved`. Semua query baca/ubah/hapus dibatasi pemilik (`WHERE seller_id = $sesi` atau `buyer_id = $sesi`). Kepemilikan yang salah dijawab 404, bukan 403, agar keberadaan data orang lain tidak bocor. |
| Database | `CHECK` (harga > 0, stok >= 0, jumlah >= 1, rating 1-5), `UNIQUE`, FK dengan aturan hapus terdokumentasi, serta trigger: transisi status sub-order, kelayakan ulasan, **role tidak bisa diubah**, dan **status seller hanya `pending` -> `approved`/`rejected`**. |
| Header HTTP | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. |
| Upload | Tipe dicek dari isi file (JPG/PNG/WebP, bukan SVG), maksimal 2 MB, nama acak, disajikan dengan `nosniff`. |
| SQL | Selalu berparameter. `ORDER BY` hanya dari daftar yang diizinkan, `LIKE` di-escape. |

## Keputusan desain penting

- **Checkout atomik:** satu transaksi PostgreSQL. Stok dikurangi dengan `UPDATE ... WHERE stock >= jumlah`, sehingga pembeli yang berebut stok terakhir tidak bisa sama-sama berhasil. Gagal di langkah mana pun berarti rollback total dan keranjang tidak dikosongkan. Produk diproses berurutan menurut id agar dua checkout serentak tidak deadlock.
- **Pesanan multi-toko:** satu `orders` (induk) berisi beberapa `store_orders` (satu per toko). Status induk **tidak disimpan**, melainkan diturunkan dari sub-order (`deriveOrderStatus` di `lib/repositories/buyer.js`). Seller hanya melihat dan mengubah sub-order miliknya.
- **Alur status oleh seller:** Menunggu Pembayaran → Diproses → Dikirim → Selesai; Dibatalkan hanya dari Menunggu Pembayaran atau Diproses dan mengembalikan stok. Pembayaran hanya simulasi: "Proses pesanan" berarti seller menganggap pembayaran sudah diterima.
- **Ulasan:** hanya untuk item dari sub-order berstatus Selesai milik pembeli itu sendiri. `product_id` dan `buyer_id` diturunkan di SQL, bukan dari form.
- **Aturan hapus pengguna:** pengguna yang masih punya pesanan berjalan (menunggu, diproses, atau dikirim), sebagai pembeli maupun penjual, tidak bisa dihapus (409). Setelah selesai atau dibatalkan, pengguna boleh dihapus dan riwayat order tetap tersimpan lengkap dengan nama dan harga saat pembelian.
- **Menghapus produk** (oleh seller atau admin) menghapusnya permanen beserta ulasannya dan item di keranjang pembeli. Riwayat pesanan tetap aman karena item pesanan menyimpan salinan nama dan harga.
- **Alamat disalin ke pesanan:** mengubah atau menghapus alamat di buku alamat tidak mengubah pesanan yang sudah dibuat.
- **Admin** boleh mengubah nama, email, dan telepon pengguna, tetapi tidak role atau status seller.
- **Upload** disimpan di `uploads/` (di luar `public/`) dan disajikan oleh `app/uploads/[name]/route.js`, karena file yang ditambahkan ke `public/` setelah build tidak disajikan oleh `next start`.

## Pengujian

Skrip uji ada di `tests/` (lihat [`tests/README.md`](tests/README.md)). Semuanya berjalan terhadap aplikasi dan database nyata.

| Suite | Skenario | Fokus |
|---|---|---|
| `npm run test:api` | 82 | semua endpoint, status HTTP, kepemilikan data |
| `npm run test:hardening` | 35 | trigger DB, aturan hapus user, pembatas login, proxy, 12 checkout serentak |
| `npm run test:e2e:auth` | 64 | halaman publik, login/register, status seller |
| `npm run test:e2e:dashboards` | 96 | dashboard 3 peran, upload, request yang dipalsukan, checkout, ulasan |
| `npm run test:e2e:features` | 67 | wishlist, alamat, filter, aksesibilitas dialog |
| `npm run test:e2e:journey` | 26 | alur lengkap lintas peran dari akun baru |
| `npm run test:e2e:audit` | 124 kombinasi | axe-core WCAG 2 A/AA: **0 pelanggaran**; **0 overflow horizontal** di 360/768/1280/1536 px; **0 gambar rusak** |
| `npm run test:e2e:keyboard` | 315 fokus, 99 tautan | semua elemen fokus punya indikator; dialog mengunci fokus; **0 tautan rusak** |

Uji browser memerlukan `npm i -D playwright axe-core` dan `npx playwright install chromium`.
Setiap perintah mereset database terlebih dahulu (`npm run db:reset`), jadi jalankan di database uji.

## Mengubah tampilan

Tampilan dipisahkan dari logika, sehingga aman diubah:

- **Warna, font, radius:** blok `@theme` di `app/globals.css` (`bg-primary`, `bg-cream`, `text-charcoal`, `border-line`, ...). Pakai nama token, bukan hex mentah.
- **Komponen:** `components/ui`, `components/commerce`, `components/layout`, `components/dashboard`.
- **Jangan ubah:** atribut `name` pada field form (dibaca validasi server), serta peran `ServerForm`, `ConfirmAction`, dan `DialogForm`.
- Cek kontras saat mengganti warna: `muted` (4,1:1) hanya untuk teks besar; teks kecil memakai `muted-strong` (5,8:1); tombol aksen memakai teks `charcoal`.
- Setelah mengubah, jalankan `npm run lint`, `npm run build`, dan `npm run test:e2e:audit`.

Halaman rujukan komponen (hanya mode pengembangan): `/design-system` dan `/design-system/dashboard`.

## Batasan yang diketahui

- Satu produk hanya punya satu gambar (sesuai skema), jadi "galeri" di halaman detail berisi satu gambar. Gambar di seed adalah placeholder lokal.
- Pembatas login disimpan di memori server: hilang saat restart dan tidak dibagi antar instance.
- Sesi berupa cookie bertanda tangan tanpa daftar sesi di server: cookie yang sudah dicuri tetap berlaku sampai kedaluwarsa (7 hari), dan mengganti kata sandi tidak mengakhiri sesi di perangkat lain.
- Admin belum bisa mengubah informasi toko (hanya moderasi produk). Buyer belum bisa membatalkan pesanan sendiri; pembatalan dilakukan penjual.
- Setelah form registrasi/login gagal divalidasi, kolom kata sandi dikosongkan (perilaku bawaan form React).
- Tidak ada pembersihan terjadwal untuk file gambar yatim akibat kegagalan di tengah proses.
- Pembayaran hanya simulasi (tanpa payment gateway), sesuai tugas.
- Logo adalah logo sementara (`components/brand/BrandLogo.jsx`, `public/brand/logo-mark.svg`).
