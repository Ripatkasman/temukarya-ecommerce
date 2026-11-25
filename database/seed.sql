-- =====================================================================
-- TemuKarya - Database Seeder (PostgreSQL)
-- Jalankan setelah schema.sql.
-- Password semua akun demo: Password123!
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- 1. USERS (Admin, Seller Approved/Pending/Rejected, Buyer Aktif/Minta Hapus/Nonaktif)
INSERT INTO users (
  full_name, email, password_hash, role, seller_status, rejection_reason,
  phone, is_active, deletion_requested_at, deletion_reason, reviewed_by, reviewed_at
) VALUES
  -- ID 1: Admin Utama
  ('Administrator TemuKarya', 'admin@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'admin', NULL, NULL, '081100001111', TRUE, NULL, NULL, NULL, NULL),

  -- ID 2: Seller 1 (Approved - Kriya Nusantara)
  ('Rina Pratama', 'rina.seller@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'seller', 'approved', NULL, '081234567801', TRUE, NULL, NULL, 1, NOW() - INTERVAL '25 days'),

  -- ID 3: Seller 2 (Approved - Rasa Nusantara)
  ('Budi Santoso', 'budi.seller@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'seller', 'approved', NULL, '081234567802', TRUE, NULL, NULL, 1, NOW() - INTERVAL '22 days'),

  -- ID 4: Seller 3 (Approved - Tenun & Wastra)
  ('Dewi Lestari', 'dewi.seller@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'seller', 'approved', NULL, '081234567803', TRUE, NULL, NULL, 1, NOW() - INTERVAL '18 days'),

  -- ID 5: Seller 4 (Pending - Menunggu Verifikasi Admin)
  ('Bayu Saputra', 'bayu.pending@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'seller', 'pending', NULL, '081234567804', TRUE, NULL, NULL, NULL, NULL),

  -- ID 6: Seller 5 (Rejected - Ditolak dengan Alasan Admin)
  ('Citra Maharani', 'citra.rejected@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'seller', 'rejected',
   'Deskripsi toko belum menjelaskan asal-usul produk lokal serta nama toko masih menggunakan merek umum.',
   '081234567805', TRUE, NULL, NULL, 1, NOW() - INTERVAL '3 days'),

  -- ID 7: Buyer 1 (Aktif - Punya riwayat pesanan, ulasan, favorit, keranjang)
  ('Andi Wijaya', 'andi.buyer@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'buyer', NULL, NULL, '082198765401', TRUE, NULL, NULL, NULL, NULL),

  -- ID 8: Buyer 2 (Aktif - Mengajukan Penghapusan Akun -> untuk uji fitur ACC Hapus Admin)
  ('Sari Kusuma', 'sari.buyer@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'buyer', NULL, NULL, '082198765402', TRUE, NOW() - INTERVAL '1 day',
   'Saya sudah jarang berbelanja online dan ingin menutup akun secara permanen.', NULL, NULL),

  -- ID 9: Buyer 3 (Nonaktif / Suspended -> untuk uji fitur Aktifkan/Nonaktifkan Admin)
  ('Dimas Putra', 'dimas.nonaktif@temukarya.co.id', crypt('Password123!', gen_salt('bf', 10)),
   'buyer', NULL, NULL, '082198765403', FALSE, NULL, NULL, NULL, NULL);

-- 2. STORES (Satu toko per seller)
INSERT INTO stores (seller_id, name, description, image_url) VALUES
  (2, 'Kriya Anyam Nusantara',
   'Kerajinan tangan anyaman rotan, bambu, dan pandan karya pengrajin lokal Sulawesi dan Jawa.',
   '/images/stores/kriya-anyam.jpg'),
  (3, 'Dapur Rasa Nusantara',
   'Kopi sangrai pilihan, teh herbal organik, dan camilan tradisional khas daerah tanpa pengawet.',
   '/images/stores/dapur-rasa.jpg'),
  (4, 'Wastra & Tenun Lokal',
   'Kain tenun ikat tradisional, tas etnik, dan busana berbahan serat alam ramah lingkungan.',
   '/images/stores/wastra-tenun.jpg'),
  (5, 'Kayu Jati Studio',
   'Peralatan makan dan dekorasi rumah berbahan kayu jati daur ulang.',
   NULL),
  (6, 'Toko Serba Ada',
   'Menjual berbagai barang.',
   NULL);

-- 3. CATEGORIES
INSERT INTO categories (name, description) VALUES
  ('Kerajinan Tangan', 'Produk anyaman, ukiran kayu, keramik, dan kriya buatan tangan pengrajin lokal.'),
  ('Kuliner & Minuman', 'Kopi nusantara, teh herbal, madu hutan, serta camilan tradisional kemasan.'),
  ('Fashion & Wastra', 'Kain tenun, batik tulis, tas rajut, dan aksesori etnik khas Nusantara.'),
  ('Dekorasi Rumah', 'Hiasan dinding, lampu meja, wadah penyimpanan, dan pernak-pernik interior.'),
  ('Perawatan Alami', 'Sabun herbal, minyak esensial, dan perawatan tubuh berbahan alami lokal.');

-- 4. PRODUCTS (10 Produk lengkap di berbagai kategori, termasuk stok menipis & stok habis)
INSERT INTO products (seller_id, category_id, name, description, price, stock, image_url, is_active) VALUES
  (2, 1, 'Tas Anyaman Pandan Etnik',
   'Tas selempang anyaman daun pandan alami dengan lapisan kain katun dan tali kulit sintetis.',
   185000, 18, '/images/products/tas-pandan.jpg', TRUE),

  (2, 4, 'Cermin Dinding Bingkai Rotan Matahari',
   'Cermin hias berdiameter 50 cm dengan anyaman rotan alami motif matahari buatan tangan.',
   240000, 4, '/images/products/cermin-rotan.jpg', TRUE),

  (2, 4, 'Keranjang Serbaguna Lontar',
   'Wadah penyimpanan serbaguna dari serat daun lontar untuk ruang tamu maupun kamar tidur.',
   145000, 12, '/images/products/keranjang-lontar.jpg', TRUE),

  (2, 1, 'Nampan Saji Bambu Pegangan Jati',
   'Nampan anyaman bambu kokoh dengan pegangan kayu jati solid untuk menyajikan hidangan.',
   130000, 0, '/images/products/nampan-bambu.jpg', TRUE),

  (3, 2, 'Kopi Arabika Toraja Sapan 250g',
   'Biji kopi sangrai medium roast dari dataran tinggi Sapan, Toraja Utara dengan aroma rempah dan cokelat.',
   95000, 30, '/images/products/kopi-toraja.jpg', TRUE),

  (3, 2, 'Madu Hutan Liar Sumbawa 350ml',
   'Madu murni hasil panen lestari lebah hutan liar tanpa campuran gula maupun pemanasan berlebih.',
   120000, 3, '/images/products/madu-hutan.jpg', TRUE),

  (3, 2, 'Teh Rempah Jahe Merah & Serai',
   'Seduhan herbal alami dari jahe merah kering, serai wangi, dan kayu manis untuk menghangatkan tubuh.',
   55000, 25, '/images/products/teh-rempah.jpg', TRUE),

  (4, 3, 'Selendang Tenun Ikat Sumba',
   'Kain tenun ikat pewarna alam motif tradisional dengan benang katun lembut.',
   350000, 8, '/images/products/tenun-sumba.jpg', TRUE),

  (4, 3, 'Dompet Kartu Tenun Baduy',
   'Dompet ringkas berbahan tenun tradisional Baduy dengan 4 slot kartu dan kompartemen uang lipat.',
   75000, 20, '/images/products/dompet-tenun.jpg', TRUE),

  (4, 5, 'Sabun Batang Kelapa & Kunyit Alami',
   'Sabun mandi cold-process berbahan minyak kelapa murni, ekstrak kunyit, dan minyak atsiri sereh.',
   38000, 40, '/images/products/sabun-kelapa.jpg', TRUE);

-- 5. ADDRESSES
INSERT INTO addresses (buyer_id, label, recipient_name, phone, full_address, is_default) VALUES
  (7, 'Rumah', 'Andi Wijaya', '082198765401',
   'Jl. Boulevard Panakkukang Blok C No. 14, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan 90231', TRUE),
  (7, 'Kantor', 'Andi Wijaya', '082198765401',
   'Gedung Graha Pena Lt. 5, Jl. Urip Sumoharjo No. 20, Makassar, Sulawesi Selatan 90234', FALSE),
  (8, 'Rumah', 'Sari Kusuma', '082198765402',
   'Jl. Perintis Kemerdekaan KM 9 No. 45, Tamalanrea, Kota Makassar, Sulawesi Selatan 90245', TRUE);

-- 6. WISHLIST & CART
INSERT INTO wishlist_items (buyer_id, product_id) VALUES
  (7, 2),
  (7, 8);

INSERT INTO carts (buyer_id) VALUES (7);
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
  (1, 3, 1),
  (1, 7, 2);

-- 7. ORDERS, STORE_ORDERS, ORDER_ITEMS
-- Order 1: Sudah Selesai (Completed) -> agar ada ulasan pembeli di dashboard seller & katalog
INSERT INTO orders (buyer_id, recipient_name, recipient_phone, shipping_address, notes, created_at) VALUES
  (7, 'Andi Wijaya', '082198765401',
   'Jl. Boulevard Panakkukang Blok C No. 14, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan 90231',
   'Tolong bungkus rapi dengan bubble wrap.', NOW() - INTERVAL '7 days');

INSERT INTO store_orders (order_id, seller_id, store_name, fulfillment_status, created_at) VALUES
  (1, 2, 'Kriya Anyam Nusantara', 'completed', NOW() - INTERVAL '7 days'),
  (1, 3, 'Dapur Rasa Nusantara', 'completed', NOW() - INTERVAL '7 days');

INSERT INTO order_items (store_order_id, product_id, product_name, unit_price, quantity) VALUES
  (1, 1, 'Tas Anyaman Pandan Etnik', 185000, 1),
  (2, 5, 'Kopi Arabika Toraja Sapan 250g', 95000, 2);

-- Order 2: Sedang Berjalan (1 menunggu diproses, 1 sedang dikirim)
INSERT INTO orders (buyer_id, recipient_name, recipient_phone, shipping_address, notes, created_at) VALUES
  (7, 'Andi Wijaya', '082198765401',
   'Jl. Boulevard Panakkukang Blok C No. 14, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan 90231',
   NULL, NOW() - INTERVAL '1 day');

INSERT INTO store_orders (order_id, seller_id, store_name, fulfillment_status, created_at) VALUES
  (2, 4, 'Wastra & Tenun Lokal', 'processing', NOW() - INTERVAL '1 day'),
  (2, 3, 'Dapur Rasa Nusantara', 'shipped', NOW() - INTERVAL '1 day');

INSERT INTO order_items (store_order_id, product_id, product_name, unit_price, quantity) VALUES
  (3, 9, 'Dompet Kartu Tenun Baduy', 75000, 1),
  (4, 6, 'Madu Hutan Liar Sumbawa 350ml', 120000, 1);

-- 8. REVIEWS (Untuk item dari Order 1 yang sudah completed)
INSERT INTO reviews (product_id, buyer_id, order_item_id, rating, comment, created_at) VALUES
  (1, 7, 1, 5,
   'Anyaman pandannya sangat rapi, halus, dan jahitan lapisan dalamnya kuat. Pengiriman juga cepat!',
   NOW() - INTERVAL '5 days'),
  (5, 7, 2, 5,
   'Aroma kopinya wangi sekali begitu kemasan dibuka. Tingkat sangrainya pas dan tidak terlalu asam.',
   NOW() - INTERVAL '4 days');

-- 9. NOTIFICATIONS (Contoh notifikasi untuk Seller & Buyer)
INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
  -- Notifikasi untuk Seller 1 (Rina Pratama)
  (2, 'Produk "Gelang Plastik Impor" Dihapus oleh Admin',
   E'Produk Anda "Gelang Plastik Impor" telah dihapus dari katalog karena melanggar ketentuan platform.\n\nAlasan Admin: Produk bukan merupakan hasil karya lokal/UMKM Nusantara sesuai syarat katalog TemuKarya.',
   'product_removed', FALSE, NOW() - INTERVAL '2 hours'),

  (2, 'Selamat Datang di TemuKarya!',
   'Pengajuan toko Kriya Anyam Nusantara telah disetujui oleh Admin. Anda kini dapat menambahkan produk dan menerima pesanan.',
   'info', TRUE, NOW() - INTERVAL '25 days'),

  -- Notifikasi untuk Buyer 1 (Andi Wijaya)
  (7, 'Pesanan #2 Sedang Dikirim',
   'Pesanan Anda dari toko Dapur Rasa Nusantara telah diserahkan ke kurir dan sedang dalam perjalanan menuju alamat tujuan.',
   'info', FALSE, NOW() - INTERVAL '3 hours');

COMMIT;