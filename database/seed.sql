-- =========================================================================
-- TEMUKARYA SEED DATA (jalankan SETELAH schema.sql)
-- Akun demo (password di-hash bcrypt):
--   Admin          : admin@temukarya.id        / Admin123!
--   Seller (aktif) : seller@temukarya.id       / Seller123!
--   Seller pending : pending@temukarya.id      / Seller123!
--   Seller ditolak : rejected@temukarya.id     / Seller123!
--   Buyer          : buyer@temukarya.id        / Buyer123!
-- =========================================================================

-- Profiles
INSERT INTO profiles (fullname, email, password, role, status) VALUES
 ('Admin TemuKarya',  'admin@temukarya.id',    '$2b$10$cRYuXcXI5/Ole151rE8nMuaKue5lWzJS/yhEaMEHKFuzGW/MdWzwO', 'admin',  'approved'),
 ('Sari Kriya',       'seller@temukarya.id',   '$2b$10$2uRihSUeFvnCaFhA4G1iaOxlLMzJnrPxBtf.aCjrXo93TVpWTH./G', 'seller', 'approved'),
 ('Budi Pending',     'pending@temukarya.id',  '$2b$10$2uRihSUeFvnCaFhA4G1iaOxlLMzJnrPxBtf.aCjrXo93TVpWTH./G', 'seller', 'pending'),
 ('Rina Ditolak',     'rejected@temukarya.id', '$2b$10$2uRihSUeFvnCaFhA4G1iaOxlLMzJnrPxBtf.aCjrXo93TVpWTH./G', 'seller', 'rejected'),
 ('Andi Pembeli',     'buyer@temukarya.id',    '$2b$10$qV3khmvKD5gwncXWi6Iu9../WqASdEaJGpKbLNMV16UNHOrSqXs0e', 'buyer',  'approved');

UPDATE profiles
   SET reviewed_by = (SELECT id FROM profiles WHERE email = 'admin@temukarya.id'),
       reviewed_at = NOW()
 WHERE email IN ('seller@temukarya.id', 'rejected@temukarya.id');

-- Toko (seller yang pending/rejected tetap punya data toko dari form registrasi)
INSERT INTO stores (seller_id, store_name, description)
SELECT id, 'Kriya Sari Makassar', 'Kerajinan tangan dan anyaman khas Sulawesi Selatan.'
  FROM profiles WHERE email = 'seller@temukarya.id';
INSERT INTO stores (seller_id, store_name, description)
SELECT id, 'Toko Budi', 'Toko baru menunggu verifikasi.'
  FROM profiles WHERE email = 'pending@temukarya.id';
INSERT INTO stores (seller_id, store_name, description)
SELECT id, 'Toko Rina', 'Pendaftaran belum dapat disetujui.'
  FROM profiles WHERE email = 'rejected@temukarya.id';

-- Kategori
INSERT INTO categories (name, description) VALUES
 ('Kerajinan Tangan', 'Produk handmade dan kriya'),
 ('Seni Lukis',       'Lukisan dan karya seni rupa'),
 ('Fashion Lokal',    'Pakaian dan aksesori karya lokal'),
 ('Dekorasi Rumah',   'Hiasan dan furnitur dekoratif'),
 ('Kuliner Kreatif',  'Makanan dan minuman olahan kreatif');

-- Produk contoh (hanya milik toko seller yang sudah approved)
INSERT INTO products (store_id, category_id, name, description, price, stock)
SELECT s.id, c.id, v.name, v.description, v.price, v.stock
  FROM stores s
  JOIN (VALUES
     ('Tas Anyaman Lontar',   'Kerajinan Tangan', 'Tas anyaman daun lontar, ukuran sedang.',        185000, 12),
     ('Tenun Sutra Sengkang', 'Fashion Lokal',    'Kain tenun sutra motif khas Sengkang.',          450000,  5),
     ('Hiasan Dinding Rotan', 'Dekorasi Rumah',   'Hiasan dinding rotan diameter 40 cm.',            95000, 20),
     ('Lukisan Pantai Losari','Seni Lukis',       'Lukisan cat akrilik di atas kanvas 40x60 cm.',   650000,  3)
  ) AS v(name, cat, description, price, stock) ON TRUE
  JOIN categories c ON c.name = v.cat
 WHERE s.store_name = 'Kriya Sari Makassar';

-- Keranjang kosong untuk buyer demo
INSERT INTO carts (buyer_id) SELECT id FROM profiles WHERE email = 'buyer@temukarya.id';
