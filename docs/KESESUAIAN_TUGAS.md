# Kesesuaian dengan PDF Tugas Final (Proyek 1: E-Commerce)

Setiap butir di PDF dipetakan ke tempat implementasinya. Kolom "Cara memeriksa" bisa dipakai langsung saat demo.
Akun demo ada di `README.md`.

## Aturan pengerjaan

| Aturan | Status | Keterangan |
|---|---|---|
| Next.js (JSX, Tailwind CSS) dan PostgreSQL | Terpenuhi | Next.js 16 App Router, Tailwind v4, `pg` |
| Query database/SQL disimpan sebagai `.sql` di luar `/app` | Terpenuhi | `database/schema.sql` dan `database/seed.sql` |
| Raw SQL (tanpa ORM) | Terpenuhi | `lib/repositories/*.js`, semua query berparameter |
| Penilai bisa menjalankan database dengan mudah | Terpenuhi | langkah pgAdmin di `README.md`; `npm run db:reset -- --yes` sebagai alternatif; teruji pada database kosong |
| Upload ke repository, penilaian dari commit terakhir | Tindakan Anda | pastikan commit terakhir adalah versi yang berjalan |

## Kriteria penilaian

| Kriteria | Bukti |
|---|---|
| **Frontend (30%)**: UI/UX dan responsivitas | Token desain konsisten; 0 overflow horizontal di 360/768/1280/1536 px; axe-core 0 pelanggaran; navigasi keyboard lengkap (`npm run test:e2e:audit`, `test:e2e:keyboard`) |
| **Backend (30%)**: autentikasi, request (validasi, route handler, server actions), database (raw SQL) | Sesi bertanda tangan + bcrypt + pembatas login; validasi di server; **Server Action dan Route Handler** memakai satu lapisan `lib/services`; 23 endpoint REST; PostgreSQL dengan trigger, `CHECK`, transaksi |
| **Kelengkapan fitur (40%)** | Tabel di bawah |

## Peran pengguna

| Butir PDF | Status | Di mana | Cara memeriksa |
|---|---|---|---|
| Admin: verifikasi Seller (Approve/Reject) | Ya | `/admin/sellers` | login admin, setujui `pending@temukarya.id` |
| Admin: kelola data pengguna | Ya | `/admin/users` | ubah dan hapus pengguna |
| Admin: hapus produk yang melanggar dari penjual mana pun | Ya | `/admin/products` | hapus satu produk |
| Seller: mendaftar dan menunggu approval sebelum bisa akses dashboard | Ya | `/register?type=seller`, `/seller/pending` | daftar seller baru, coba buka `/seller` |
| Seller: kelola toko dan produk sendiri (CRUD), stok, kategori produk | Ya | `/seller/store`, `/seller/products` | login `seller@temukarya.id` |
| Buyer: keranjang, checkout, rating dan review, kelola profil | Ya | `/buyer/*` | login `buyer@temukarya.id` |
| Guest: lihat daftar dan detail produk, login untuk interaksi | Ya | `/`, `/products`, `/products/[id]` | tekan Add to Cart tanpa login |

## Modul CMS

| Modul | Butir PDF | Status | Di mana |
|---|---|---|---|
| **Produk (Seller)** | List produk | Ya | `/seller/products` |
| | Create: nama, deskripsi, harga, stok, gambar, kategori; semua wajib valid | Ya | `/seller/products/new` (validasi per field di server) |
| | Edit: nama, deskripsi, harga, stok, gambar, kategori; tidak boleh kosong | Ya | `/seller/products/[id]/edit` |
| | Delete hanya produk miliknya | Ya | tombol Hapus; produk seller lain dijawab 404 (teruji) |
| **Pengguna (Admin)** | View user (Admin, Seller) | Ya | `/admin/users` (juga menampilkan Buyer, dengan filter peran) |
| | Verifikasi Seller "Pending" → Approved/Rejected | Ya | `/admin/sellers` |
| | Edit user | Ya | dialog Ubah (nama, email, telepon; role tidak bisa diubah) |
| | Delete user selain dirinya sendiri | Ya | `/admin/users`; tambahan: ditolak bila masih ada pesanan berjalan |
| **Keranjang (Buyer)** | Add to Cart | Ya | kartu produk dan halaman detail |
| | View Cart: jumlah dan total harga; ubah jumlah atau hapus | Ya | `/buyer/cart` (harga dan stok dibaca dari database) |
| | Checkout membuat Order; keranjang dikosongkan otomatis | Ya | `/buyer/cart` → detail pesanan; transaksi atomik |
| **Toko (Seller)** | Informasi toko: nama, deskripsi, gambar | Ya | `/seller/store` |
| | CRUD produk | Ya | lihat modul Produk |
| **Pesanan** | Buyer: riwayat dan status (Menunggu Pembayaran, Diproses, Selesai) | Ya | `/buyer/orders` dan detail dengan pelacakan |
| | Buyer: rating dan review setelah pesanan selesai, tampil di produk | Ya | form ulasan di detail pesanan; tampil di `/products/[id]` |
| | Seller: pesanan masuk khusus produk tokonya | Ya | `/seller/orders` (hanya item tokonya) |
| | Seller: perbarui status pesanan | Ya | tombol status dengan konfirmasi |
| **Kategori (Admin)** | CRUD kategori | Ya | `/admin/categories` (tidak bisa dihapus bila dipakai produk) |

## Layout

| Halaman | Butir PDF | Status |
|---|---|---|
| Login/Register | Login semua peran; register hanya Buyer dan Seller; Seller baru berstatus Pending | Ya (percobaan mendaftar sebagai admin ditolak server dan database) |
| Homepage (Guest) | List produk dengan pencarian; Add to Cart → login | Ya |
| Homepage (Buyer) | Produk rekomendasi acak; Add to Cart; search bar berdasarkan nama | Ya ("Rekomendasi produk", berubah tiap dimuat ulang) |
| Daftar produk | Preview, nama, harga | Ya |
| Detail produk | Nama, harga, deskripsi, kategori, toko; Add to Cart khusus Buyer; rating dan review; Guest tidak bisa menambah ke cart atau favorit | Ya |
| Dashboard Buyer | Profil; keranjang (tambah/kurangi jumlah, checkout); riwayat dan pelacakan | Ya |
| Dashboard Seller | Toko; produk; pesanan (lihat dan ubah status) | Ya |
| Halaman Pending Seller | "Akun Anda sedang ditinjau."; tombol Delete Account jika ditolak | Ya |
| Dashboard Admin | Kelola pengguna; verifikasi Seller; CRUD kategori | Ya |

## Opsional (Advanced Requirements)

| Fitur | Status | Di mana |
|---|---|---|
| Filter dan sorting produk (kategori atau harga) | Ya, lebih lengkap | `/products`: kategori, harga, rating, ketersediaan, 5 pilihan urutan |
| Alamat pengiriman, tampil di detail order | Ya | `/buyer/addresses`; alamat tampil di detail pesanan (disalin saat checkout) |
| Daftar favorit (wishlist) terpisah dari keranjang | Ya | `/buyer/wishlist`, ikon hati |

## Hal yang sengaja diputuskan (perlu Anda ketahui saat tanya jawab)

1. **PDF menyebut Seller "mengelola kategori"** di ringkasan, tetapi modul Category Management adalah milik Admin. Implementasi: Admin CRUD kategori, Seller memilih kategori saat membuat produk.
2. **Daftar pengguna** di PDF menyebut "Admin, Seller". Implementasi menampilkan semua peran termasuk Buyer, karena Admin juga mengelola Buyer.
3. **Pembayaran** hanya simulasi: seller menandai "Diproses" setelah menganggap pembayaran diterima.
4. **Menghapus pengguna** ditolak jika masih punya pesanan berjalan (aturan integritas); riwayat pesanan tidak pernah hilang.
