-- =====================================================================
-- TemuKarya - Seed Data
-- Jalankan SETELAH schema.sql. Simpan di /database/seed.sql.
-- Password di-hash dengan bcrypt via pgcrypto (kompatibel dengan
-- bcrypt/bcryptjs di Node.js; $2a$ prefix).
--
-- AKUN DEMO (ganti password sebelum produksi):
--   admin@temukarya.id   / Admin123!   (admin)
--   seller@temukarya.id  / Seller123!  (seller, approved)
--   pending@temukarya.id / Seller123!  (seller, pending)
--   rejected@temukarya.id / Seller123! (seller, rejected)
--   seller2@temukarya.id / Seller123!  (seller, approved)
--   seller3@temukarya.id / Seller123!  (seller, approved)
--   buyer@temukarya.id   / Buyer123!   (buyer)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users (seller_status wajib eksplisit; NULL untuk admin/buyer)
INSERT INTO users (full_name, email, password_hash, role, seller_status, reviewed_at) VALUES
  ('Administrator TemuKarya', 'admin@temukarya.id',
     crypt('Admin123!',  gen_salt('bf', 10)), 'admin',  NULL, NULL),
  ('Rina Pratama',            'seller@temukarya.id',
     crypt('Seller123!', gen_salt('bf', 10)), 'seller', 'approved', NOW()),
  ('Budi Santoso',            'pending@temukarya.id',
     crypt('Seller123!', gen_salt('bf', 10)), 'seller', 'pending',  NULL),
  ('Sari Buyer',              'buyer@temukarya.id',
     crypt('Buyer123!',  gen_salt('bf', 10)), 'buyer',  NULL, NULL),
  ('Dewi Lestari',            'rejected@temukarya.id',
     crypt('Seller123!', gen_salt('bf', 10)), 'seller', 'rejected', NOW()),
  ('Siti Aminah',             'seller2@temukarya.id',
     crypt('Seller123!', gen_salt('bf', 10)), 'seller', 'approved', NOW()),
  ('Andi Mappasessu',         'seller3@temukarya.id',
     crypt('Seller123!', gen_salt('bf', 10)), 'seller', 'approved', NOW());

UPDATE users SET reviewed_by = (SELECT id FROM users WHERE email = 'admin@temukarya.id')
WHERE role = 'seller' AND seller_status IN ('approved','rejected');

-- Categories
INSERT INTO categories (name, description) VALUES
  ('Fashion',           'Pakaian dan aksesori karya lokal'),
  ('Kerajinan Tangan',  'Produk handmade dan kriya'),
  ('Makanan & Minuman', 'Kuliner khas UMKM'),
  ('Dekorasi Rumah',    'Perlengkapan dan dekorasi rumah'),
  ('Kecantikan',        'Perawatan tubuh dan kecantikan alami'),
  ('Buku & Alat Tulis', 'Buku, jurnal, dan alat tulis');

-- Stores
INSERT INTO stores (seller_id, name, description, image_url) VALUES
  ((SELECT id FROM users WHERE email = 'seller@temukarya.id'),
   'Rumah Anyam Rina',
   'Kerajinan anyaman tangan dari pengrajin lokal Sulawesi Selatan.',
   '/images/placeholder-store.svg'),
  ((SELECT id FROM users WHERE email = 'pending@temukarya.id'),
   'Toko Budi',
   'Toko baru, menunggu verifikasi.',
   '/images/placeholder-store.svg'),
  ((SELECT id FROM users WHERE email = 'rejected@temukarya.id'),
   'Toko Dewi',
   'Pendaftaran toko ditolak.',
   '/images/placeholder-store.svg'),
  ((SELECT id FROM users WHERE email = 'seller2@temukarya.id'),
   'Dapur Nusantara',
   'Camilan dan bumbu khas Makassar yang dibuat dalam skala rumahan, tanpa pengawet.',
   '/images/placeholder-store.svg'),
  ((SELECT id FROM users WHERE email = 'seller3@temukarya.id'),
   'Pesisir Kriya',
   'Tenun, sabun alami, dan jurnal kertas daur ulang buatan kreator pesisir.',
   '/images/placeholder-store.svg');

-- Demo products (hanya milik seller yang approved).
-- Seller pending/rejected sengaja tidak punya produk.
INSERT INTO products (seller_id, category_id, name, description, price, stock, image_url) VALUES
  ((SELECT id FROM users WHERE email = 'seller@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'kerajinan tangan'),
   'Tas Anyaman Pandan',
   'Tas anyaman pandan buatan tangan, ringan dan kuat untuk aktivitas harian.',
   185000, 20, '/images/products/kerajinan.svg'),
  ((SELECT id FROM users WHERE email = 'seller@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'dekorasi rumah'),
   'Tempat Tisu Rotan',
   'Tempat tisu rotan dengan finishing natural untuk meja makan atau ruang tamu.',
   95000, 35, '/images/products/dekorasi.svg'),
  ((SELECT id FROM users WHERE email = 'seller@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'fashion'),
   'Topi Anyam Bambu',
   'Topi anyaman bambu halus, nyaman dipakai di bawah matahari.',
   120000, 15, '/images/products/fashion.svg'),
  ((SELECT id FROM users WHERE email = 'seller@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'dekorasi rumah'),
   'Keranjang Serbaguna Lontar',
   'Keranjang daun lontar untuk menyimpan pakaian, mainan, atau hasil belanja.',
   145000, 4, '/images/products/dekorasi.svg'),
  ((SELECT id FROM users WHERE email = 'seller2@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'makanan & minuman'),
   'Kopi Toraja Sangrai Medium 250 g',
   'Biji kopi arabika Toraja sangrai medium, aroma cokelat dan rempah. Digiling sesuai permintaan.',
   78000, 40, '/images/products/makanan.svg'),
  ((SELECT id FROM users WHERE email = 'seller2@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'makanan & minuman'),
   'Kue Bagea Sagu Isi 10',
   'Kue bagea dari sagu dan kenari, renyah di luar dan lembut di dalam.',
   45000, 60, '/images/products/makanan.svg'),
  ((SELECT id FROM users WHERE email = 'seller2@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'makanan & minuman'),
   'Sambal Roa Botol 120 g',
   'Sambal ikan roa pedas gurih, dikemas dalam botol kaca.',
   52000, 0, '/images/products/makanan.svg'),
  ((SELECT id FROM users WHERE email = 'seller3@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'fashion'),
   'Sarung Tenun Sutra Motif Balo',
   'Sarung tenun dengan motif balo tradisional, ditenun manual dalam dua minggu.',
   420000, 6, '/images/products/fashion.svg'),
  ((SELECT id FROM users WHERE email = 'seller3@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'kecantikan'),
   'Sabun Kelapa dan Serai Batang',
   'Sabun batang dari minyak kelapa dan serai, lembut untuk kulit sensitif.',
   32000, 80, '/images/products/kecantikan.svg'),
  ((SELECT id FROM users WHERE email = 'seller3@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'kecantikan'),
   'Lulur Kopi dan Madu 150 g',
   'Lulur tubuh dari ampas kopi dan madu hutan, tanpa pewangi buatan.',
   58000, 25, '/images/products/kecantikan.svg'),
  ((SELECT id FROM users WHERE email = 'seller3@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'buku & alat tulis'),
   'Jurnal Kertas Daur Ulang A5',
   'Jurnal 120 halaman dari kertas daur ulang dengan sampul kain tenun.',
   65000, 30, '/images/products/buku.svg'),
  ((SELECT id FROM users WHERE email = 'seller3@temukarya.id'),
   (SELECT id FROM categories WHERE LOWER(name) = 'dekorasi rumah'),
   'Lampu Gantung Anyaman Bambu',
   'Kap lampu anyaman bambu, memberi cahaya hangat berpola untuk ruang makan.',
   210000, 8, '/images/products/dekorasi.svg');

-- Demo order SELESAI + ulasan, agar rating tampil dan alur ulasan bisa diuji.
-- store_orders dimasukkan langsung berstatus 'completed' (trigger transisi hanya untuk UPDATE).
INSERT INTO orders (buyer_id, recipient_name, recipient_phone, shipping_address)
VALUES ((SELECT id FROM users WHERE email = 'buyer@temukarya.id'),
        'Sari Buyer', '081234567890', 'Jl. Contoh No. 1, Makassar, Sulawesi Selatan');

INSERT INTO store_orders (order_id, seller_id, store_name, fulfillment_status) VALUES
  ((SELECT MAX(id) FROM orders), (SELECT id FROM users WHERE email = 'seller@temukarya.id'),  'Rumah Anyam Rina', 'completed'),
  ((SELECT MAX(id) FROM orders), (SELECT id FROM users WHERE email = 'seller2@temukarya.id'), 'Dapur Nusantara',  'completed');

INSERT INTO order_items (store_order_id, product_id, product_name, unit_price, quantity)
SELECT so.id, p.id, p.name, p.price, 1
FROM store_orders so
JOIN products p ON p.seller_id = so.seller_id
WHERE so.order_id = (SELECT MAX(id) FROM orders)
  AND p.name IN ('Tas Anyaman Pandan', 'Topi Anyam Bambu', 'Kopi Toraja Sangrai Medium 250 g');

INSERT INTO reviews (product_id, buyer_id, order_item_id, rating, comment)
SELECT oi.product_id, o.buyer_id, oi.id,
       CASE oi.product_name WHEN 'Tas Anyaman Pandan' THEN 5 WHEN 'Topi Anyam Bambu' THEN 4 ELSE 5 END,
       CASE oi.product_name
         WHEN 'Tas Anyaman Pandan' THEN 'Anyamannya rapi dan kuat, cocok dipakai sehari-hari. Pengemasan aman.'
         WHEN 'Topi Anyam Bambu' THEN 'Nyaman dipakai dan ringan. Ukurannya sedikit longgar, tapi masih bisa disesuaikan.'
         ELSE 'Aromanya enak, tidak terlalu asam. Akan beli lagi.'
       END
FROM order_items oi
JOIN store_orders so ON so.id = oi.store_order_id
JOIN orders o ON o.id = so.order_id
WHERE so.order_id = (SELECT MAX(id) FROM orders);
