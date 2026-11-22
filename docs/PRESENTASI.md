# Panduan Presentasi (15 menit + 15 menit tanya jawab)

Siapkan sebelum mulai: database baru di-reset (`npm run db:reset -- --yes`), aplikasi berjalan dengan
`npm run build && npm start`, tiga jendela peramban (Guest, Buyer, Seller/Admin) atau satu jendela biasa
ditambah satu jendela privat.

## Alur demo (±10 menit)

| Menit | Yang ditunjukkan | Poin yang disebut |
|---|---|---|
| 0-1 | Slide singkat: masalah, solusi, stack | Marketplace multi-seller; Next.js + PostgreSQL raw SQL |
| 1-2.5 | **Guest**: beranda, cari "kopi", detail produk, Add to Cart → diarahkan login | Guest hanya melihat; interaksi butuh login |
| 2.5-4 | **Daftar Seller baru** → "Akun Anda sedang ditinjau."; coba buka `/seller/products` (dialihkan) | Status Pending; penjagaan di server |
| 4-5 | **Admin** menyetujui seller di `/admin/sellers` | Keputusan final; dicatat siapa dan kapan |
| 5-6.5 | **Seller** (tanpa login ulang) tambah produk dengan gambar; tunjukkan validasi dengan mengosongkan harga | Validasi di server; upload dicek isi file |
| 6.5-8.5 | **Buyer** (`buyer@temukarya.id`): rekomendasi acak, tambah dua produk dari toko berbeda, checkout dengan alamat tersimpan | Satu checkout menghasilkan sub-order per toko; transaksi atomik |
| 8.5-10 | **Seller** proses → kirim → selesai; **Buyer** memberi ulasan; rating muncul di produk | Ulasan hanya setelah Selesai |

Cadangan bila waktu longgar: Admin menghapus produk pelanggar; wishlist; filter rating.

## Slide teknis (±3 menit)

1. **Arsitektur** (diagram di README): Server Action dan Route Handler → `lib/services` → `lib/repositories` (raw SQL) → PostgreSQL.
2. **Mengapa dua jalur?** Server Action untuk form di UI; Route Handler REST untuk klien lain. Keduanya memakai logika yang sama, jadi aturan tidak bisa berbeda.
3. **Keamanan berlapis**: proxy → `requireRole`/`route({roles})` → query berbatas pemilik → trigger dan `CHECK` di database.
4. **Pengujian**: ±370 skenario otomatis; 0 pelanggaran aksesibilitas; 12 checkout serentak untuk 3 stok → tepat 3 berhasil.

## Pertanyaan yang mungkin muncul, dan jawabannya

**Bagaimana mencegah dua pembeli membeli stok terakhir yang sama?**
`UPDATE products SET stock = stock - $n WHERE id = $id AND stock >= $n` di dalam transaksi. Hanya satu yang mendapat baris; yang lain gagal dan seluruh checkout di-rollback. Teruji: 12 checkout serentak untuk stok 3 menghasilkan tepat 3 order.

**Bagaimana mencegah deadlock?** Produk dalam keranjang diproses berurutan menurut id, sehingga dua transaksi mengunci baris dengan urutan yang sama. Teruji dengan urutan item berlawanan.

**Kenapa harga tidak diambil dari form?** Client tidak pernah dipercaya untuk harga, stok, atau kepemilikan. Harga dibaca dari tabel `products` saat checkout dan disalin ke `order_items` (harga saat pembelian), jadi mengubah harga kemudian tidak mengubah pesanan lama.

**Bagaimana status pesanan induk ditentukan jika tiap toko berbeda status?** Tidak disimpan; diturunkan dari sub-order (`deriveOrderStatus`): semua dibatalkan → Dibatalkan; selain itu tahap paling awal di antara sub-order yang tidak dibatalkan.

**Apa bedanya 401, 403, dan 404 di API?** 401 belum login; 403 role salah atau seller belum disetujui; 404 untuk data yang tidak ada **atau bukan milik Anda** (agar keberadaan data orang lain tidak bocor).

**Bagaimana mencegah Buyer menjadi Admin?** Tiga lapis: registrasi hanya menerima `buyer`/`seller`; tidak ada jalur ubah role di aplikasi; trigger database menolak perubahan `role`.

**Bagaimana mencegah Seller menyetujui dirinya sendiri?** Hanya Admin yang punya jalur ubah status; query keputusan membatasi transisi dari `pending`; trigger database menolak transisi lain.

**Kenapa upload tidak di folder `public`?** File yang ditambahkan ke `public/` setelah build tidak disajikan oleh `next start`. Gambar disajikan lewat route handler dengan nama file yang divalidasi ketat (anti path traversal) dan header `nosniff`.

**Bagaimana validasi upload?** Tipe dari isi file (magic bytes), bukan ekstensi atau Content-Type; hanya JPG/PNG/WebP (bukan SVG); maksimal 2 MB; nama acak.

**Apa kelemahan yang Anda ketahui?** (Jujur, lihat "Batasan" di README) Pembatas login di memori server; sesi tanpa daftar sesi di server; satu gambar per produk; pembayaran simulasi.

**Apa yang dikerjakan jika ada waktu lebih?** Pembatalan pesanan oleh Buyer, banyak gambar per produk, penyimpanan sesi dan pembatas login di PostgreSQL, ekspor laporan.

## Kalau demo bermasalah

- Database berantakan: `npm run db:reset -- --yes`, muat ulang peramban.
- "Terlalu banyak percobaan masuk": tunggu 15 menit atau restart server (hitungan di memori).
- Login seller baru tidak masuk dashboard: pastikan Admin sudah menyetujui di `/admin/sellers`.
