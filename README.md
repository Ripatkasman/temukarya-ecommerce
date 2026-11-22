<p align="center">
  <img src="docs/img/banner.svg" alt="TemuKarya: tempat karya lokal bertemu kepercayaan" width="100%">
</p>

<p align="center">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="PostgreSQL 13+" src="https://img.shields.io/badge/PostgreSQL-13%2B-4169E1?logo=postgresql&logoColor=white">
  <img alt="Node.js 20.9+" src="https://img.shields.io/badge/Node.js-20.9%2B-339933?logo=nodedotjs&logoColor=white">
  <br>
  <img alt="370 skenario uji lulus" src="https://img.shields.io/badge/uji_otomatis-370_lulus-2EA44F">
  <img alt="axe-core 0 pelanggaran" src="https://img.shields.io/badge/aksesibilitas_axe-0_pelanggaran-2EA44F">
  <img alt="Tanpa ORM" src="https://img.shields.io/badge/query-raw_SQL_tanpa_ORM-174B3A">
</p>

<p align="center">
  <b>Marketplace multi-seller</b> untuk produk pelaku usaha lokal dan kreator independen.<br>
  Tugas Final Praktikum Pemrograman Web 2026 &middot; Proyek 1: E-Commerce
</p>

<p align="center">
  <a href="#-tampilan">Tampilan</a> &middot;
  <a href="#-mulai-cepat">Mulai cepat</a> &middot;
  <a href="#-fitur-per-peran">Fitur</a> &middot;
  <a href="#-cara-kerjanya">Cara kerjanya</a> &middot;
  <a href="#-api">API</a> &middot;
  <a href="#-keamanan">Keamanan</a> &middot;
  <a href="#-pengujian">Pengujian</a>
</p>

---

## ✨ Sekilas

- **Empat peran** dengan hak akses terpisah: Guest, Buyer, Seller, dan Admin. Seller baru harus disetujui Admin dulu.
- **Satu checkout, banyak toko.** Satu pesanan otomatis dipecah per toko, dan tiap penjual hanya melihat dan memproses bagiannya sendiri.
- **Stok aman.** Checkout berjalan dalam satu transaksi database; 12 pembeli berebut 3 stok menghasilkan tepat 3 pesanan.
- **Dua jalur akses, satu logika.** Form memakai *Server Actions*, klien lain memakai *Route Handler* REST, dan keduanya berbagi satu lapisan aturan bisnis.
- **Fitur tambahan:** wishlist, buku alamat, filter dan urutan lanjutan, serta ulasan yang hanya bisa ditulis setelah pesanan selesai.
- **Rapi di semua layar.** Responsif dari 360 px, 0 pelanggaran aksesibilitas (axe-core), dan bisa dioperasikan penuh dengan keyboard.

## 📸 Tampilan

### Untuk pengunjung

<table>
  <tr>
    <td width="50%"><img src="docs/img/home.jpg" alt="Beranda"><br><sub><b>Beranda</b>: pencarian, produk pilihan, kategori, dan toko</sub></td>
    <td width="50%"><img src="docs/img/catalog.jpg" alt="Katalog produk dengan filter"><br><sub><b>Katalog</b>: cari, filter kategori, harga, rating, dan stok</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/img/product-detail.jpg" alt="Detail produk"><br><sub><b>Detail produk</b>: toko, rating, ulasan, dan tombol favorit</sub></td>
    <td width="50%"><img src="docs/img/register.jpg" alt="Halaman daftar"><br><sub><b>Daftar</b> sebagai pembeli atau penjual (penjual menunggu persetujuan)</sub></td>
  </tr>
</table>

### Pembeli

<table>
  <tr>
    <td width="50%"><img src="docs/img/buyer-cart.jpg" alt="Keranjang dan checkout"><br><sub><b>Keranjang</b> dan checkout dengan alamat tersimpan</sub></td>
    <td width="50%"><img src="docs/img/buyer-order.jpg" alt="Pelacakan pesanan per toko"><br><sub><b>Pelacakan pesanan</b>: tiap toko punya status sendiri</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/img/wishlist.jpg" alt="Daftar favorit"><br><sub><b>Favorit</b>, terpisah dari keranjang</sub></td>
    <td width="50%"><img src="docs/img/buyer-overview.jpg" alt="Ringkasan pembeli"><br><sub><b>Ringkasan</b> pesanan dan keranjang</sub></td>
  </tr>
</table>

### Penjual dan Admin

<table>
  <tr>
    <td width="50%"><img src="docs/img/seller-orders.jpg" alt="Pesanan masuk penjual"><br><sub><b>Pesanan masuk</b>: hanya item toko sendiri, dengan aksi status</sub></td>
    <td width="50%"><img src="docs/img/seller-products.jpg" alt="Daftar produk penjual"><br><sub><b>Produk saya</b>: CRUD, stok, dan upload gambar</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/img/admin-sellers.jpg" alt="Verifikasi seller"><br><sub><b>Verifikasi seller</b> oleh Admin (Setujui atau Tolak)</sub></td>
    <td width="50%"><img src="docs/img/admin-overview.jpg" alt="Ringkasan admin"><br><sub><b>Ringkasan platform</b> untuk Admin</sub></td>
  </tr>
</table>

### Di ponsel

<p align="center">
  <img src="docs/img/m-home.jpg" alt="Beranda di ponsel" width="23%">
  <img src="docs/img/m-product.jpg" alt="Detail produk di ponsel" width="23%">
  <img src="docs/img/m-cart.jpg" alt="Keranjang di ponsel" width="23%">
  <img src="docs/img/m-order.jpg" alt="Pelacakan pesanan di ponsel" width="23%">
</p>

## 🚀 Mulai cepat

> **Prasyarat:** Node.js 20.9 atau lebih baru (disarankan 22 LTS) dan PostgreSQL 13 atau lebih baru.

**1. Ambil kode dan pasang dependency**

```bash
git clone <url-repository>
cd <folder-proyek>
npm install
```

**2. Siapkan database.** Buat database kosong bernama `temukarya`, lalu jalankan dua file ini **berurutan**:

1. `database/schema.sql`
2. `database/seed.sql`

<details>
<summary><b>Cara menjalankannya di pgAdmin</b> (klik untuk membuka)</summary>

1. Klik kanan *Databases* → *Create* → *Database…*, isi nama `temukarya`, simpan.
2. Klik kanan database `temukarya` → *Query Tool*.
3. Buka `database/schema.sql` (ikon folder), tekan **F5**. Tunggu sampai muncul *Query returned successfully*.
4. Ulangi untuk `database/seed.sql`.

`schema.sql` menghapus tabel lama sebelum membuatnya ulang, jadi menjalankannya lagi sama dengan **mereset semua data**.
Alternatif tanpa pgAdmin (setelah langkah 3): `npm run db:reset -- --yes`.

</details>

**3. Atur environment.** Salin `.env.example` menjadi `.env.local`, lalu isi dua baris ini:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/temukarya
SESSION_SECRET=<string acak minimal 32 karakter>
```

<details>
<summary>Cara membuat <code>SESSION_SECRET</code></summary>

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Salin hasilnya ke `.env.local`. Jangan pernah meng-commit file `.env.local`.

</details>

**4. Jalankan**

```bash
npm run dev                    # http://localhost:3000
# atau, mode produksi:
npm run build && npm start
```

Folder `uploads/` (gambar unggahan penjual) dibuat otomatis dan harus bisa ditulis.

### 🔑 Akun demo

| Peran | Email | Password | Cocok untuk mencoba |
|---|---|---|---|
| **Admin** | `admin@temukarya.id` | `Admin123!` | verifikasi seller, kelola pengguna dan kategori |
| **Buyer** | `buyer@temukarya.id` | `Buyer123!` | keranjang, checkout, ulasan, favorit, alamat |
| **Seller** (aktif) | `seller@temukarya.id` | `Seller123!` | produk, toko, pesanan masuk |
| Seller aktif 2 dan 3 | `seller2@…`, `seller3@temukarya.id` | `Seller123!` | pesanan dari beberapa toko |
| Seller **pending** | `pending@temukarya.id` | `Seller123!` | halaman "Akun Anda sedang ditinjau." |
| Seller **ditolak** | `rejected@temukarya.id` | `Seller123!` | tombol Hapus Akun |

Seed berisi 6 kategori, 12 produk dari 3 toko, 1 pesanan selesai, dan 3 ulasan. Password ini hanya untuk demo.

> **Jalur coba 5 menit:** login sebagai Buyer, tambahkan produk dari dua toko berbeda lalu checkout → login sebagai
> `seller@temukarya.id` dan proses pesanannya → kembali sebagai Buyer, lihat pelacakan dan tulis ulasan setelah status *Selesai*.

## 👥 Fitur per peran

| Peran | Yang bisa dilakukan |
|---|---|
| 👤 **Guest** | Melihat beranda, katalog (cari, filter, urutkan), detail produk dan ulasan, serta halaman toko. Tombol *Add to Cart* dan favorit mengarahkan ke login. |
| 🛒 **Buyer** | Rekomendasi produk acak; keranjang (ubah jumlah, hapus); checkout; riwayat dan pelacakan pesanan; rating dan ulasan setelah pesanan **Selesai**; profil dan kata sandi; buku alamat; wishlist. |
| 🏪 **Seller** | Mendaftar dengan status *Pending*, menunggu persetujuan (jika ditolak: tombol Hapus Akun). Setelah disetujui: kelola toko (nama, deskripsi, gambar), CRUD produk (stok, kategori, gambar), pesanan masuk khusus tokonya, dan ubah status pesanan. |
| 🛡️ **Admin** | Ringkasan platform; lihat, ubah, dan hapus pengguna (kecuali diri sendiri); verifikasi seller (Approve atau Reject); hapus produk yang melanggar; CRUD kategori. |

Kesesuaian butir demi butir dengan PDF tugas: [`docs/KESESUAIAN_TUGAS.md`](docs/KESESUAIAN_TUGAS.md).

## 🧩 Cara kerjanya

### Arsitektur

```mermaid
flowchart LR
  B["Browser"] -->|"form di UI"| SA["Server Actions"]
  B -->|"fetch /api/**"| RH["Route Handlers"]
  SA --> SV["lib/services<br/>validasi + aturan bisnis"]
  RH --> SV
  SV --> RP["lib/repositories<br/>raw SQL berparameter"]
  RP --> DB[("PostgreSQL<br/>trigger + CHECK + transaksi")]
```

Server Action dan Route Handler hanyalah **adapter tipis**. Aturan bisnis hanya ditulis satu kali di `lib/services`,
jadi kedua jalur tidak mungkin berperilaku berbeda.

### Alur status pesanan

Setiap toko dalam satu pesanan punya status sendiri. Status pesanan induk **tidak disimpan**, melainkan dihitung dari status tiap toko.

```mermaid
stateDiagram-v2
  direction LR
  state "Menunggu Pembayaran" as awaiting
  state "Diproses" as processing
  state "Dikirim" as shipped
  state "Selesai" as completed
  state "Dibatalkan" as cancelled
  [*] --> awaiting: checkout
  awaiting --> processing: seller memproses
  awaiting --> cancelled: dibatalkan (stok kembali)
  processing --> shipped
  processing --> cancelled: dibatalkan (stok kembali)
  shipped --> completed
  completed --> [*]: buyer boleh mengulas
  cancelled --> [*]
```

> Pembayaran hanya **simulasi** (sesuai tugas): tombol "Proses pesanan" berarti penjual menganggap pembayaran sudah diterima.

### Skema database

```mermaid
erDiagram
  USERS {
    bigint id PK
    varchar role "admin, seller, buyer"
    varchar seller_status "pending, approved, rejected"
  }
  PRODUCTS {
    bigint id PK
    numeric price
    int stock
    bool is_active
  }
  STORE_ORDERS {
    bigint id PK
    varchar fulfillment_status
  }
  ORDER_ITEMS {
    bigint id PK
    varchar product_name "salinan saat beli"
    numeric unit_price "salinan saat beli"
    int quantity
  }
  USERS ||--o| STORES : "seller punya toko"
  USERS ||--o{ PRODUCTS : "seller menjual"
  CATEGORIES ||--o{ PRODUCTS : "mengelompokkan"
  USERS ||--o| CARTS : "buyer punya keranjang"
  CARTS ||--o{ CART_ITEMS : "berisi"
  PRODUCTS ||--o{ CART_ITEMS : "dimasukkan ke"
  USERS ||--o{ ADDRESSES : "buku alamat"
  USERS ||--o{ WISHLIST_ITEMS : "menyimpan"
  PRODUCTS ||--o{ WISHLIST_ITEMS : "difavoritkan"
  USERS ||--o{ ORDERS : "buyer membuat"
  ORDERS ||--|{ STORE_ORDERS : "dipecah per toko"
  USERS ||--o{ STORE_ORDERS : "seller memproses"
  STORE_ORDERS ||--|{ ORDER_ITEMS : "berisi"
  PRODUCTS ||--o{ ORDER_ITEMS : "disalin saat checkout"
  ORDER_ITEMS ||--o| REVIEWS : "diulas"
  PRODUCTS ||--o{ REVIEWS : "menerima"
  USERS ||--o{ REVIEWS : "buyer menulis"
```

Item pesanan menyimpan **salinan** nama dan harga saat pembelian, sehingga riwayat pesanan tetap benar walau produknya kemudian diubah atau dihapus.

<details>
<summary><b>Struktur folder</b></summary>

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
scripts/db-reset.mjs reset database dari terminal
tests/               uji otomatis (lihat tests/README.md)
docs/                KESESUAIAN_TUGAS.md, PRESENTASI.md, img/
proxy.js             penjaga awal route dashboard (pengganti middleware di Next.js 16)
```

</details>

<details>
<summary><b>Keputusan desain penting</b></summary>

- **Checkout atomik:** satu transaksi. Stok dikurangi dengan `UPDATE … WHERE stock >= jumlah`, sehingga pembeli yang berebut stok terakhir tidak bisa sama-sama berhasil. Gagal di langkah mana pun berarti rollback total dan keranjang tidak dikosongkan. Produk diproses berurutan menurut id agar dua checkout serentak tidak deadlock.
- **Harga tidak pernah dipercaya dari client.** Harga dan stok dibaca dari tabel `products` saat checkout, lalu disalin ke `order_items`.
- **Ulasan** hanya untuk item dari pesanan toko yang berstatus *Selesai* milik pembeli itu sendiri. `product_id` dan `buyer_id` diturunkan di SQL, bukan dari form.
- **Aturan hapus pengguna:** pengguna yang masih punya pesanan berjalan (menunggu, diproses, atau dikirim) tidak bisa dihapus (409). Setelah selesai atau dibatalkan, pengguna boleh dihapus dan riwayat pesanan tetap utuh.
- **Menghapus produk** menghapusnya permanen beserta ulasan dan item di keranjang pembeli; riwayat pesanan tetap aman karena sudah berisi salinan.
- **Alamat disalin ke pesanan:** mengubah atau menghapus alamat tidak mengubah pesanan yang sudah dibuat.
- **Admin** boleh mengubah nama, email, dan telepon pengguna, tetapi tidak role atau status seller.
- **Upload** disimpan di `uploads/` (di luar `public/`) dan disajikan lewat route handler, karena file yang ditambahkan ke `public/` setelah build tidak disajikan oleh `next start`.

</details>

## 🔌 API

Aplikasi punya Route Handler REST di `app/api/**` yang memakai logika yang sama dengan Server Actions.
Autentikasi memakai cookie sesi `tk_session` dari `POST /api/auth/login`. Body berupa JSON, atau `multipart/form-data` untuk endpoint dengan gambar.

```bash
# masuk, simpan cookie
curl -c jar.txt -H "Content-Type: application/json" \
  -d '{"email":"buyer@temukarya.id","password":"Buyer123!"}' http://localhost:3000/api/auth/login

# tambah produk ke keranjang
curl -b jar.txt -H "Content-Type: application/json" \
  -d '{"productId":"1","quantity":2}' http://localhost:3000/api/cart
```

Respons selalu berbentuk `{ ok, message?, data?, errors? }` dengan kode status:

| Kode | Arti |
|---|---|
| 200 / 201 | berhasil / berhasil dibuat |
| 401 | belum login |
| 403 | peran salah, atau seller belum disetujui |
| 404 | tidak ada **atau bukan milik Anda** (agar keberadaan data orang lain tidak bocor) |
| 409 | konflik: duplikat, stok tidak cukup, transisi status tidak diizinkan |
| 415 / 422 | tipe body salah / validasi gagal (ada `errors` per field) |
| 429 | terlalu banyak percobaan login |

<details>
<summary><b>Daftar lengkap endpoint (23)</b></summary>

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
| POST `/api/order-items/:id/review` | buyer pemilik | ulasan (hanya pesanan toko berstatus Selesai) |
| GET, PATCH `/api/profile`, PATCH `/api/profile/password` | buyer | profil dan kata sandi |
| GET, POST `/api/wishlist`, DELETE `/api/wishlist/:productId` | buyer | daftar favorit |
| GET, POST `/api/addresses`, PATCH, DELETE `/api/addresses/:id`, POST `/api/addresses/:id/default` | buyer | buku alamat (maks. 10) |
| GET, PATCH `/api/seller/store` | seller | informasi toko (+ gambar) |
| GET `/api/seller/orders` | seller | pesanan masuk (hanya item tokonya) |
| PATCH `/api/seller/orders/:id/status` | seller pemilik | ubah status |
| GET `/api/admin/users`, PATCH/DELETE `/api/admin/users/:id` | admin | kelola pengguna |
| GET `/api/admin/sellers`, POST `/api/admin/sellers/:id/decision` | admin | verifikasi seller (`approve`/`reject`) |

</details>

## 🔒 Keamanan

Perlindungan berlapis, dari tepi sampai database:

```mermaid
flowchart LR
  A["proxy.js<br/>cookie ada?"] --> B["requireRole / route roles<br/>sesi + peran + status seller"]
  B --> C["Query berbatas pemilik<br/>WHERE seller_id / buyer_id = sesi"]
  C --> D["Trigger + CHECK di database"]
```

| Lapisan | Perlindungan |
|---|---|
| Autentikasi | Password di-hash **bcrypt**. Sesi berupa cookie `httpOnly`, `SameSite=Lax`, bertanda tangan HMAC. Peran dan status seller dibaca ulang dari database di setiap request. |
| Pembatas login | 5 kegagalan per IP + email dalam 15 menit menghasilkan HTTP 429. |
| Otorisasi | Dijaga di server (bukan hanya menyembunyikan tombol). Seller hanya lolos jika `approved`. Data milik orang lain dijawab 404. |
| Database | `CHECK` (harga > 0, stok >= 0, rating 1-5), `UNIQUE`, serta trigger: alur status pesanan, kelayakan ulasan, **peran tidak bisa diubah**, dan **status seller hanya `pending` → `approved`/`rejected`**. |
| Upload | Tipe dicek dari **isi file** (JPG/PNG/WebP, bukan SVG), maksimal 2 MB, nama acak. |
| SQL | Selalu berparameter; `ORDER BY` dari daftar yang diizinkan; `LIKE` di-escape. |
| HTTP | `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; request ubah-data dari origin asing ditolak. |

## ✅ Pengujian

Skrip uji menjalankan aplikasi dan database nyata (tanpa mock). Detail cara menjalankan: [`tests/README.md`](tests/README.md).

| Suite | Skenario | Fokus |
|---|---|---|
| `npm run test:api` | 82 | semua endpoint, status HTTP, kepemilikan data |
| `npm run test:hardening` | 35 | trigger DB, aturan hapus user, pembatas login, 12 checkout serentak |
| `npm run test:e2e:auth` | 64 | halaman publik, login dan register, status seller |
| `npm run test:e2e:dashboards` | 96 | dashboard 3 peran, upload, request yang dipalsukan, checkout |
| `npm run test:e2e:features` | 67 | wishlist, alamat, filter, aksesibilitas dialog |
| `npm run test:e2e:journey` | 26 | alur lengkap lintas peran dari akun baru |
| `npm run test:e2e:audit` | 124 kombinasi | axe-core WCAG 2 A/AA **0 pelanggaran**; **0 overflow** di 360/768/1280/1536 px; **0 gambar rusak** |
| `npm run test:e2e:keyboard` | 315 fokus, 99 tautan | semua elemen fokus terlihat; **0 tautan rusak** |

```bash
npm run build && npm start        # terminal 1
npm run test:api                  # terminal 2 (otomatis mereset database)
```

> Uji browser butuh `npm i -D playwright axe-core` dan `npx playwright install chromium`.
> Setiap perintah uji mereset database, jadi jalankan di database uji.

## 🎨 Mengubah tampilan

<details>
<summary>Panduan singkat</summary>

Tampilan dipisahkan dari logika, jadi aman diubah:

- **Warna, font, radius:** blok `@theme` di `app/globals.css` (`bg-primary`, `bg-cream`, `text-charcoal`, `border-line`, …). Pakai nama token, bukan hex mentah.
- **Komponen:** `components/ui`, `components/commerce`, `components/layout`, `components/dashboard`.
- **Jangan ubah:** atribut `name` pada field form (dibaca validasi server), serta peran `ServerForm`, `ConfirmAction`, dan `DialogForm`.
- **Kontras:** `muted` (4,1:1) hanya untuk teks besar; teks kecil memakai `muted-strong` (5,8:1); tombol aksen memakai teks `charcoal`.
- Setelah mengubah, jalankan `npm run lint`, `npm run build`, dan `npm run test:e2e:audit`.

Halaman rujukan komponen (hanya mode pengembangan): `/design-system` dan `/design-system/dashboard`.

</details>

## ⚠️ Batasan yang diketahui

<details>
<summary>Dicatat apa adanya</summary>

- Satu produk hanya punya satu gambar (sesuai skema). Gambar di seed adalah placeholder lokal.
- Pembatas login disimpan di memori server: hilang saat restart dan tidak dibagi antar instance.
- Sesi berupa cookie bertanda tangan tanpa daftar sesi di server: cookie yang sudah dicuri tetap berlaku sampai kedaluwarsa (7 hari), dan mengganti kata sandi tidak mengakhiri sesi di perangkat lain.
- Admin belum bisa mengubah informasi toko (hanya moderasi produk). Buyer belum bisa membatalkan pesanan sendiri; pembatalan dilakukan penjual.
- Setelah form registrasi atau login gagal divalidasi, kolom kata sandi dikosongkan (perilaku bawaan form React).
- Tidak ada pembersihan terjadwal untuk file gambar yatim akibat kegagalan di tengah proses.
- Pembayaran hanya simulasi, tanpa payment gateway (sesuai tugas).
- Logo masih logo sementara (`components/brand/BrandLogo.jsx`, `public/brand/logo-mark.svg`).

</details>

## 📚 Dokumen lain

| Dokumen | Isi |
|---|---|
| [`docs/KESESUAIAN_TUGAS.md`](docs/KESESUAIAN_TUGAS.md) | pemetaan tiap butir PDF tugas ke fitur dan cara memeriksanya |
| [`docs/PRESENTASI.md`](docs/PRESENTASI.md) | alur demo per menit dan jawaban pertanyaan yang mungkin muncul |
| [`tests/README.md`](tests/README.md) | cara menjalankan semua uji otomatis |

---

<p align="center">
  Dikerjakan secara individu oleh <b>[isi nama dan NIM]</b> untuk Praktikum Pemrograman Web 2026.
</p>
