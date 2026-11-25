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
  <a href="#-sekilas">Sekilas</a> &middot;
  <a href="#-tampilan">Tampilan</a> &middot;
  <a href="#-mulai-cepat">Mulai Cepat</a> &middot;
  <a href="#-akun-demo">Akun Demo</a> &middot;
  <a href="#-panduan-penggunaan">Panduan Penggunaan</a> &middot;
  <a href="#-fitur-lengkap-per-peran">Fitur</a> &middot;
  <a href="#-arsitektur--keamanan">Arsitektur & Keamanan</a>
</p>

---

## 📑 Daftar Isi

1. [Sekilas](#-sekilas)
2. [Tampilan](#-tampilan)
3. [Mulai Cepat](#-mulai-cepat)
4. [Akun Demo](#-akun-demo)
5. [Panduan Penggunaan](#-panduan-penggunaan)
6. [Fitur Lengkap per Peran](#-fitur-lengkap-per-peran)
7. [Arsitektur & Keamanan](#-arsitektur--keamanan)
8. [Pemecahan Masalah](#-pemecahan-masalah)

---

## ✨ Sekilas

- **Empat peran terpisah:** Guest, Buyer, Seller, dan Admin. Pendaftaran Seller baru berstatus *Pending* dan wajib disetujui Admin sebelum dapat berjualan (jika ditolak, alasan penolakan ditampilkan di halaman status).
- **Satu checkout, banyak toko:** Satu keranjang lintas toko otomatis dipecah menjadi sub-pesanan per toko, sehingga setiap penjual hanya melihat dan memproses item miliknya sendiri.
- **Stok aman dari *overselling*:** Proses *checkout* berjalan dalam satu transaksi atomik PostgreSQL; 12 pembeli yang berebut 3 stok tersisa akan menghasilkan tepat 3 pesanan sukses.
- **Tata kelola & moderasi aktif:** Admin wajib menyertakan alasan saat menghapus produk yang melanggar (otomatis masuk ke notifikasi Seller), dapat menghapus ulasan tidak pantas, menonaktifkan/mengaktifkan akun, serta memproses pengajuan penghapusan akun.
- **Pemotongan gambar produk interaktif:** Penjual dapat memotong foto produk (`1:1` atau `4:3`) maupun memotong ulang (*re-crop*) gambar tersimpan langsung dari form produk.
- **Dua jalur akses, satu logika:** Form memakai *Server Actions*, klien eksternal memakai *Route Handler* REST, dan keduanya berbagi satu lapisan repository Raw SQL.
- **Responsif & aksesibel:** Rapi mulai dari layar 360 px hingga desktop, memiliki penanda tab aktif pada navigasi, 0 pelanggaran aksesibilitas (`axe-core`), dan dapat dioperasikan penuh dengan keyboard.

---

## 📸 Tampilan

### Untuk Pengunjung

<table>
  <tr>
    <td width="50%">
      <img src="docs/img/home.jpg" alt="Beranda TemuKarya"><br>
      <sub><b>Beranda:</b> pencarian produk, galeri karya unggulan, kategori, dan toko rekomendasi</sub>
    </td>
    <td width="50%">
      <img src="docs/img/catalog.jpg" alt="Katalog produk dengan filter"><br>
      <sub><b>Katalog:</b> pencarian, filter kategori, rentang harga, rating, dan stok</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/img/product-detail.jpg" alt="Detail produk"><br>
      <sub><b>Detail Produk:</b> info toko, rating, ulasan, moderasi ulasan Admin, dan tombol favorit</sub>
    </td>
    <td width="50%">
      <img src="docs/img/register.jpg" alt="Halaman daftar"><br>
      <sub><b>Daftar Akun:</b> registrasi sebagai Pembeli atau Penjual (menunggu persetujuan Admin)</sub>
    </td>
  </tr>
</table>

### Pembeli

<table>
  <tr>
    <td width="50%">
      <img src="docs/img/buyer-cart.jpg" alt="Keranjang dan checkout"><br>
      <sub><b>Keranjang & Checkout:</b> perhitungan otomatis dengan pemilihan alamat tersimpan</sub>
    </td>
    <td width="50%">
      <img src="docs/img/buyer-order.jpg" alt="Pelacakan pesanan per toko"><br>
      <sub><b>Pelacakan Pesanan:</b> pemantauan status pengiriman terpisah untuk setiap toko</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/img/wishlist.jpg" alt="Daftar favorit"><br>
      <sub><b>Daftar Favorit:</b> simpan produk incaran terpisah dari keranjang belanja</sub>
    </td>
    <td width="50%">
      <img src="docs/img/buyer-overview.jpg" alt="Ringkasan pembeli"><br>
      <sub><b>Ringkasan & Notifikasi:</b> pantauan pesanan aktif, keranjang, dan status akun</sub>
    </td>
  </tr>
</table>

### Penjual dan Admin

<table>
  <tr>
    <td width="50%">
      <img src="docs/img/seller-orders.jpg" alt="Pesanan masuk penjual"><br>
      <sub><b>Pesanan Masuk:</b> khusus item toko sendiri lengkap dengan tombol pembaruan status</sub>
    </td>
    <td width="50%">
      <img src="docs/img/seller-products.jpg" alt="Daftar produk penjual"><br>
      <sub><b>Produk Saya:</b> CRUD produk, manajemen stok, serta fitur crop & potong ulang foto</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/img/admin-sellers.jpg" alt="Verifikasi seller"><br>
      <sub><b>Verifikasi Seller:</b> persetujuan atau penolakan akun penjual oleh Admin disertai alasan</sub>
    </td>
    <td width="50%">
      <img src="docs/img/admin-overview.jpg" alt="Ringkasan admin"><br>
      <sub><b>Ringkasan & Tata Kelola Admin:</b> statistik platform, moderasi produk, dan kelola akun</sub>
    </td>
  </tr>
</table>

### Tampilan Ponsel (Mobile)

<p align="center">
  <img src="docs/img/m-home.jpg" alt="Beranda di ponsel" width="23%">
  <img src="docs/img/m-product.jpg" alt="Detail produk di ponsel" width="23%">
  <img src="docs/img/m-cart.jpg" alt="Keranjang di ponsel" width="23%">
  <img src="docs/img/m-order.jpg" alt="Pelacakan pesanan di ponsel" width="23%">
</p>

---

## 🚀 Mulai Cepat

### Prasyarat

| Kebutuhan | Versi |
|-----------|-------|
| Node.js | `20.9` atau lebih baru (disarankan `22 LTS`) |
| PostgreSQL | `13` atau lebih baru |
| Git | Versi terbaru |

### Langkah 1: Kloning repositori dan instal dependensi

```bash
git clone <url-repository>
cd <folder-proyek>
npm install
```

### Langkah 2: Siapkan database PostgreSQL

Seluruh file SQL berada di folder `database/` (di luar folder `app/`) agar mudah dijalankan saat pengujian.

1. Buat database baru bernama `temukarya`.
2. Jalankan `database/schema.sql` **terlebih dahulu** untuk membuat tabel, *foreign key*, *constraint*, dan *index*.
3. Jalankan `database/seed.sql` untuk mengisi data awal: kategori, toko, produk, dan akun demo (Admin, Seller, Buyer).

Bisa dilakukan lewat **pgAdmin** (Query Tool) atau lewat terminal dengan `psql`:

```bash
psql -U postgres -c "CREATE DATABASE temukarya;"
psql -U postgres -d temukarya -f database/schema.sql
psql -U postgres -d temukarya -f database/seed.sql
```

### Langkah 3: Konfigurasi variabel lingkungan

Salin file contoh, lalu sesuaikan dengan kredensial PostgreSQL Anda:

```bash
cp .env.example .env.local
```

Isi `.env.local` (minimal dua variabel berikut):

```env
DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/temukarya"
SESSION_SECRET="rahasia-session-cookie-minimal-32-karakter"
```

| Variabel | Fungsi |
|----------|--------|
| `DATABASE_URL` | Alamat koneksi PostgreSQL. Format: `postgresql://USER:PASSWORD@HOST:PORT/NAMA_DB` |
| `SESSION_SECRET` | Kunci rahasia untuk mengenkripsi cookie sesi. Gunakan teks acak minimal 32 karakter. |

### Langkah 4: Jalankan aplikasi

```bash
npm run dev
```

Buka <http://localhost:3000> di browser. Untuk mencoba cepat, langsung login dengan [akun demo](#-akun-demo) di bawah.

---

## 🔑 Akun Demo

Kata sandi untuk **semua** akun demo: `Password123!`

Akun-akun ini dibuat oleh `database/seed.sql`, dan masing-masing mewakili kondisi yang berbeda agar setiap fitur mudah diuji.

| Peran | Email | Status & Skenario yang Dapat Diuji |
|-------|-------|------------------------------------|
| **Admin** | `admin@temukarya.co.id` | Aktif. Akses penuh dashboard Admin: kelola pengguna, verifikasi seller, hapus produk dengan alasan wajib, hapus ulasan, dan kelola kategori. |
| **Seller** | `rina.seller@temukarya.co.id` | Approved. Memiliki 1 notifikasi merah riwayat penghapusan produk beserta alasan dari Admin, serta ulasan pembeli. |
| **Seller** | `budi.seller@temukarya.co.id` | Approved. Memiliki produk dengan stok menipis, pesanan berstatus Dikirim, dan siap diuji untuk fitur crop / Potong Ulang gambar. |
| **Seller** | `dewi.seller@temukarya.co.id` | Approved. Memiliki pesanan baru berstatus Menunggu Diproses. |
| **Seller** | `bayu.pending@temukarya.co.id` | Pending. Tampil pada tab *Menunggu* di halaman Verifikasi Seller (Admin) dan melihat halaman status tinjauan saat login. |
| **Seller** | `citra.rejected@temukarya.co.id` | Rejected. Menampilkan kotak *Alasan Penolakan* dari Admin serta tombol *Hapus Akun* saat login. |
| **Buyer** | `andi.buyer@temukarya.co.id` | Aktif. Memiliki riwayat pesanan, ulasan, daftar favorit, item di keranjang, dan 1 notifikasi baru. |
| **Buyer** | `sari.buyer@temukarya.co.id` | Minta Hapus. Menampilkan lencana *Minta Hapus* dan tombol *ACC Hapus* pada tabel Manajemen Pengguna Admin. |
| **Buyer** | `dimas.nonaktif@temukarya.co.id` | Nonaktif. Akun ditangguhkan, otomatis diarahkan ke `/account-deactivated`, dan dapat diaktifkan kembali oleh Admin. |

---

## 📖 Panduan Penggunaan

### ⚡ Demo Cepat (±5 menit)

Tiga alur di bawah ini mencakup fitur utama aplikasi.

#### Alur 1: Belanja multi-toko (Buyer)

Login sebagai `andi.buyer@temukarya.co.id`.

1. Buka `/products`, lalu tambahkan produk dari **dua toko berbeda** ke keranjang.
2. Buka keranjang dan lakukan *checkout* dengan alamat tersimpan.
3. Buka riwayat pesanan, lalu perhatikan pesanan **terpecah otomatis per toko**, masing-masing dengan status sendiri.

#### Alur 2: Kelola pesanan & potong ulang gambar (Seller)

Login sebagai `budi.seller@temukarya.co.id`.

1. Buka **Pesanan Masuk**, lalu perbarui status salah satu pesanan.
2. Buka **Produk Saya**, pilih produk, lalu klik **Edit**.
3. Klik **Potong Ulang** untuk mencoba pemotongan gambar interaktif (`1:1` atau `4:3`).

#### Alur 3: Moderasi & tata kelola (Admin)

Login sebagai `admin@temukarya.co.id`.

1. Buka **Manajemen Produk**, filter berdasarkan kategori, lalu hapus satu produk dengan mengisi **alasan penghapusan** (wajib).
2. Login kembali sebagai penjual pemilik produk (misalnya `rina.seller@temukarya.co.id`) dan lihat **notifikasi alasan penghapusan** yang masuk otomatis.
3. Coba juga tombol **Hapus Ulasan** pada halaman `/products/[id]`, serta penonaktifan akun di **Manajemen Pengguna**.

### 🧭 Cara Menggunakan sebagai...

<details>
<summary><b>👤 Pengunjung (tanpa login)</b></summary>

- Jelajahi beranda, lalu buka `/products` untuk mencari produk atau toko.
- Gunakan filter kategori, rentang harga, rating, dan ketersediaan stok.
- Buka detail produk untuk membaca ulasan, atau buka profil toko di `/stores/[id]`.
- Menekan **Tambah ke Keranjang** atau **Favorit** akan mengarahkan Anda ke halaman login.

</details>

<details>
<summary><b>🛒 Pembeli</b></summary>

1. **Daftar** sebagai Pembeli (atau login dengan akun demo), lalu isi buku alamat (maks. 10 alamat).
2. **Belanja:** tambahkan produk ke keranjang, atur jumlah, lalu *checkout*.
3. **Lacak pesanan** per toko pada halaman pesanan.
4. **Beri ulasan** (rating 1–5 + komentar) setelah pesanan berstatus *Selesai*.
5. **Favorit:** simpan produk incaran ke wishlist, terpisah dari keranjang.
6. **Notifikasi** dapat dibaca di `/buyer/notifications`.
7. **Akun:** ubah profil, ganti kata sandi, atau ajukan penghapusan akun.

</details>

<details>
<summary><b>🏪 Penjual</b></summary>

1. **Daftar** sebagai Penjual. Status awal **Pending** dan Anda belum bisa berjualan.
2. Tunggu **persetujuan Admin**:
   - *Approved*: dashboard penjual terbuka.
   - *Rejected*: alasan penolakan ditampilkan, dan Anda dapat menghapus akun.
3. **Atur toko:** identitas dan gambar toko.
4. **Kelola produk:** tambah, ubah, hapus, atur stok, dan potong gambar (`1:1` / `4:3` / Potong Ulang).
5. **Proses pesanan masuk:** hanya item dari toko Anda yang tampil. Perbarui statusnya secara bertahap.
6. **Notifikasi** di `/seller/notifications`, termasuk pemberitahuan resmi bila produk dihapus Admin.

</details>

<details>
<summary><b>🛡️ Admin</b></summary>

1. **Ringkasan:** statistik platform dan pendaftar terbaru.
2. **Verifikasi Seller:** *Approve* atau *Reject* (dengan alasan) pada tab Menunggu.
3. **Manajemen Pengguna:** ubah data, nonaktifkan/aktifkan akun, atau setujui (*ACC*) pengajuan hapus akun.
4. **Manajemen Produk:** filter per kategori dan hapus produk pelanggar (alasan wajib, otomatis dikirim ke Seller).
5. **Moderasi Ulasan:** hapus ulasan tidak pantas langsung dari halaman detail produk.
6. **Kategori:** tambah, ubah, dan hapus kategori produk.

</details>

---

## 👥 Fitur Lengkap per Peran

| Peran | Kemampuan & Cakupan Fitur |
|-------|---------------------------|
| 👤 **Guest** (Pengunjung) | Menjelajahi beranda dengan penanda tab aktif di Navbar; mencari produk maupun toko di katalog (`/products`); menyaring berdasarkan kategori, rentang harga, rating, dan stok; membaca detail produk & ulasan; membuka profil toko (`/stores/[id]`). Aksi Tambah ke Keranjang dan Favorit otomatis mengarahkan ke halaman login. |
| 🛒 **Buyer** (Pembeli) | Melihat ringkasan akun dan rekomendasi produk; mengelola keranjang (ubah jumlah, hapus item); *checkout* atomik multi-toko; melacak status pesanan per toko; menulis rating (1–5) dan ulasan setelah pesanan *Selesai*; mengelola profil, kata sandi, dan pengajuan hapus akun; mengelola buku alamat (maks. 10); menyimpan daftar favorit (wishlist); membaca pusat notifikasi (`/buyer/notifications`). |
| 🏪 **Seller** (Penjual) | Mendaftar dengan status *Pending* (jika ditolak: melihat alasan penolakan & tombol Hapus Akun). Setelah *Approved*: mengelola identitas & gambar toko; CRUD produk dengan pemotong gambar interaktif (1:1 / 4:3 & Potong Ulang); memproses pesanan masuk khusus item tokonya; mengajukan penghapusan akun/toko; menerima notifikasi (`/seller/notifications`) termasuk pemberitahuan resmi jika produk dihapus Admin. |
| 🛡️ **Admin** | Memantau statistik & pendaftaran pengguna terbaru; mengelola pengguna (ubah data, nonaktifkan/aktifkan, ACC hapus akun); memverifikasi seller (Approve/Reject dengan alasan); menyaring produk per kategori & menghapus produk pelanggar dengan alasan wajib; menghapus ulasan tidak pantas dari halaman detail produk; CRUD kategori produk. |

---

## 🏗️ Arsitektur & Keamanan

- **Raw SQL berparameter:** Seluruh interaksi dengan PostgreSQL memakai driver `pg` dengan parameter `$1`, `$2`, ... di lapisan repository, tanpa ORM dan tanpa *string concatenation*, untuk mencegah SQL Injection.
- **Otorisasi sisi server:** Sesi disimpan dalam cookie `httpOnly` terenkripsi. Peran (*role*) dan status penjual (`pending` / `approved` / `rejected`) selalu diverifikasi ulang langsung dari database pada setiap Server Action dan Route Handler.
- **Isolasi kepemilikan data:** Setiap kueri baca, ubah, dan hapus data milik penjual atau pembeli selalu menyertakan klausa kepemilikan (`WHERE seller_id = $1` atau `WHERE buyer_id = $1`).
- **Checkout atomik:** Pengurangan stok dan pembuatan pesanan berjalan dalam satu transaksi PostgreSQL sehingga stok tidak bisa terjual melebihi persediaan.

### ⚠️ Batasan yang Diketahui

Integrasi *payment gateway* pihak ketiga berada di luar cakupan tugas. Proses pembayaran **disimulasikan** melalui transisi status pesanan oleh penjual setelah *checkout* berhasil.

---

## 🛠️ Pemecahan Masalah

| Masalah | Kemungkinan Penyebab & Solusi |
|---------|-------------------------------|
| Aplikasi gagal terhubung ke database | Periksa `DATABASE_URL` di `.env.local` (user, password, port, nama database) dan pastikan layanan PostgreSQL sedang berjalan. |
| Error *relation does not exist* | `database/schema.sql` belum dijalankan. Jalankan `schema.sql` lebih dulu, baru `seed.sql`. |
| Tidak bisa login dengan akun demo | Pastikan `seed.sql` sudah dijalankan dan gunakan kata sandi `Password123!` (huruf besar/kecil berpengaruh). |
| Error terkait sesi / cookie | Pastikan `SESSION_SECRET` terisi minimal 32 karakter, lalu restart `npm run dev`. |
| Versi Node tidak didukung | Periksa dengan `node -v`. Gunakan Node.js `20.9` atau lebih baru. |
| Port `3000` sudah dipakai | Hentikan proses lain di port tersebut, atau jalankan dengan port lain: `npm run dev -- -p 3001`. |
| Ingin mengulang data dari awal | Hapus database `temukarya`, buat ulang, lalu jalankan kembali `schema.sql` dan `seed.sql`. |
