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

- **Empat peran** dengan hak akses terpisah: Guest, Buyer, Seller, dan Admin. Seller baru harus disetujui Admin dulu (jika ditolak, alasan penolakan ditampilkan jelas di halaman status).
- **Satu checkout, banyak toko.** Satu pesanan otomatis dipecah per toko, dan tiap penjual hanya melihat dan memproses bagiannya sendiri.
- **Stok aman.** Checkout berjalan dalam satu transaksi database; 12 pembeli berebut 3 stok menghasilkan tepat 3 pesanan.
- **Tata kelola & moderasi aktif.** Admin wajib menyertakan alasan saat menghapus produk melanggar (otomatis masuk ke notifikasi Seller), dapat menghapus ulasan tidak pantas, menonaktifkan/mengaktifkan akun pengguna, serta memproses pengajuan hapus akun.
- **Pemotongan gambar produk interaktif.** Penjual dapat memotong foto produk (`1:1` atau `4:3`) maupun memotong ulang gambar tersimpan langsung dari form produk.
- **Dua jalur akses, satu logika.** Form memakai *Server Actions*, klien lain memakai *Route Handler* REST, dan keduanya berbagi satu lapisan aturan bisnis.
- **Rapi di semua layar.** Responsif dari 360 px, penanda tab aktif pada navigasi, 0 pelanggaran aksesibilitas (axe-core), dan dapat dioperasikan penuh dengan keyboard.

## 📸 Tampilan

### Untuk pengunjung

<table>
  <tr>
    <td width="50%"><img src="docs/img/home.jpg" alt="Beranda"><br><sub><b>Beranda</b>: pencarian, produk pilihan, kategori, dan toko</sub></td>
    <td width="50%"><img src="docs/img/catalog.jpg" alt="Katalog produk dengan filter"><br><sub><b>Katalog</b>: cari, filter kategori, harga, rating, dan stok</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/img/product-detail.jpg" alt="Detail produk"><br><sub><b>Detail produk</b>: toko, rating, ulasan, moderasi ulasan admin, dan tombol favorit</sub></td>
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
    <td width="50%"><img src="docs/img/buyer-overview.jpg" alt="Ringkasan pembeli"><br><sub><b>Ringkasan & Notifikasi</b> pesanan, keranjang, dan status akun</sub></td>
  </tr>
</table>

### Penjual dan Admin

<table>
  <tr>
    <td width="50%"><img src="docs/img/seller-orders.jpg" alt="Pesanan masuk penjual"><br><sub><b>Pesanan masuk</b>: hanya item toko sendiri, dengan aksi status</sub></td>
    <td width="50%"><img src="docs/img/seller-products.jpg" alt="Daftar produk penjual"><br><sub><b>Produk saya</b>: CRUD, stok, dan pemotong gambar (crop & potong ulang)</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/img/admin-sellers.jpg" alt="Verifikasi seller"><br><sub><b>Verifikasi seller</b> oleh Admin (Setujui atau Tolak dengan alasan)</sub></td>
    <td width="50%"><img src="docs/img/admin-overview.jpg" alt="Ringkasan admin"><br><sub><b>Ringkasan & Tata Kelola Admin</b>: moderasi produk beralasan dan kelola akun</sub></td>
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