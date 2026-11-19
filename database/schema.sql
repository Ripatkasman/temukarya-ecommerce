-- =====================================================================
-- TemuKarya - Database Schema (PostgreSQL)
-- Simpan di /database/schema.sql (di LUAR folder /app).
-- Urutan menjalankan: 1) schema.sql  2) seed.sql
-- Aman dijalankan ulang pada database kosong maupun yang sudah berisi
-- (semua tabel lama dihapus lebih dulu).
-- =====================================================================

-- ---------- Reset ----------
DROP VIEW     IF EXISTS v_order_totals CASCADE;
DROP TABLE    IF EXISTS reviews        CASCADE;
DROP TABLE    IF EXISTS order_items    CASCADE;
DROP TABLE    IF EXISTS store_orders   CASCADE;
DROP TABLE    IF EXISTS orders         CASCADE;
DROP TABLE    IF EXISTS cart_items     CASCADE;
DROP TABLE    IF EXISTS carts          CASCADE;
DROP TABLE    IF EXISTS wishlist_items CASCADE;
DROP TABLE    IF EXISTS addresses      CASCADE;
DROP TABLE    IF EXISTS products       CASCADE;
DROP TABLE    IF EXISTS categories     CASCADE;
DROP TABLE    IF EXISTS stores         CASCADE;
DROP TABLE    IF EXISTS users          CASCADE;
DROP FUNCTION IF EXISTS set_updated_at()               CASCADE;
DROP FUNCTION IF EXISTS enforce_store_order_transition() CASCADE;
DROP FUNCTION IF EXISTS enforce_review_eligibility()   CASCADE;

-- ---------- Fungsi umum ----------
CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 1. users
-- Satu tabel untuk Admin, Seller, Buyer.
-- seller_status SENGAJA tanpa DEFAULT: registrasi seller wajib mengisi
-- 'pending' secara eksplisit; lupa mengisi = error, bukan celah.
-- =====================================================================
CREATE TABLE users (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,            -- bcrypt hash, bukan password asli
  role           VARCHAR(10)  NOT NULL,
  seller_status  VARCHAR(10),                      -- hanya untuk role 'seller'
  phone          VARCHAR(20),
  reviewed_by    BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- admin yang memutuskan
  reviewed_at    TIMESTAMPTZ,                      -- waktu keputusan approve/reject
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_users_role CHECK (role IN ('admin','seller','buyer')),
  CONSTRAINT chk_users_seller_status
    CHECK (seller_status IN ('pending','approved','rejected')),
  -- seller wajib punya status; admin/buyer tidak boleh punya status seller
  CONSTRAINT chk_users_status_matches_role CHECK (
    (role = 'seller' AND seller_status IS NOT NULL) OR
    (role <> 'seller' AND seller_status IS NULL)
  ),
  CONSTRAINT chk_users_email_lowercase CHECK (email = LOWER(email)),
  CONSTRAINT chk_users_name_not_blank  CHECK (BTRIM(full_name) <> ''),
  CONSTRAINT chk_users_email_not_blank CHECK (BTRIM(email) <> '')
);
-- Email unik tanpa peka huruf besar-kecil
CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_role_status ON users (role, seller_status);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 2. stores (satu seller = satu toko)
-- =====================================================================
CREATE TABLE stores (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  seller_id    BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,
  description  TEXT,
  image_url    VARCHAR(255),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_store_name_not_blank CHECK (BTRIM(name) <> '')
);
CREATE TRIGGER trg_stores_updated BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 3. categories (dikelola Admin)
-- =====================================================================
CREATE TABLE categories (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         VARCHAR(80) NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_category_name_not_blank CHECK (BTRIM(name) <> '')
);
CREATE UNIQUE INDEX uq_categories_name_lower ON categories (LOWER(name));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 4. products
-- Semua field wajib (sesuai PDF): nama, deskripsi, harga, stok, gambar, kategori.
-- Kepemilikan: selalu pakai WHERE seller_id = $sesi pada query ubah/hapus.
-- category_id ON DELETE RESTRICT -> kategori yang dipakai tidak bisa dihapus.
-- =====================================================================
CREATE TABLE products (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  seller_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name         VARCHAR(150)  NOT NULL,
  description  TEXT          NOT NULL,
  price        NUMERIC(12,2) NOT NULL,
  stock        INTEGER       NOT NULL,
  image_url    VARCHAR(255)  NOT NULL,
  is_active    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_product_name_not_blank CHECK (BTRIM(name) <> ''),
  CONSTRAINT chk_product_desc_not_blank CHECK (BTRIM(description) <> ''),
  CONSTRAINT chk_product_image_not_blank CHECK (BTRIM(image_url) <> ''),
  CONSTRAINT chk_product_price_positive CHECK (price > 0),
  CONSTRAINT chk_product_stock_nonneg   CHECK (stock >= 0)
);
CREATE INDEX idx_products_seller   ON products (seller_id);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_active_created ON products (is_active, created_at DESC);
CREATE INDEX idx_products_name_lower ON products (LOWER(name));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 5. carts & cart_items (satu buyer = satu cart aktif)
-- =====================================================================
CREATE TABLE carts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  buyer_id    BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_carts_updated BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE cart_items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cart_id     BIGINT NOT NULL REFERENCES carts(id)    ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_cart_qty_min CHECK (quantity >= 1),
  CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);
CREATE TRIGGER trg_cart_items_updated BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 6. addresses (OPSIONAL - fitur alamat pengiriman)
-- =====================================================================
CREATE TABLE addresses (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  buyer_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label           VARCHAR(50)  NOT NULL,            -- mis. "Rumah", "Kantor"
  recipient_name  VARCHAR(100) NOT NULL,
  phone           VARCHAR(20)  NOT NULL,
  full_address    TEXT         NOT NULL,
  is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_address_not_blank CHECK (BTRIM(full_address) <> '')
);
CREATE INDEX idx_addresses_buyer ON addresses (buyer_id);
-- maksimal satu alamat default per buyer
CREATE UNIQUE INDEX uq_addresses_one_default ON addresses (buyer_id) WHERE is_default;
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 7. wishlist_items (OPSIONAL - wishlist, dipisah dari cart)
-- Disederhanakan: satu baris = satu produk favorit milik satu buyer.
-- =====================================================================
CREATE TABLE wishlist_items (
  buyer_id    BIGINT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (buyer_id, product_id)
);

-- =====================================================================
-- 8. orders (induk) -> store_orders (per toko) -> order_items
-- Pembayaran DISIMULASIKAN (tanpa payment gateway); 'awaiting_payment'
-- bukan berarti sudah dibayar. Status induk diturunkan dari store_orders,
-- tidak disimpan. Total juga dihitung (lihat view v_order_totals).
-- Riwayat order dilindungi: menghapus user/toko/produk TIDAK menghapus order
-- (FK memakai SET NULL + snapshot nama).
-- =====================================================================
CREATE TABLE orders (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  buyer_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
  recipient_name   VARCHAR(100) NOT NULL,
  recipient_phone  VARCHAR(20)  NOT NULL,
  -- NOT NULL: form checkout wajib punya isian alamat (teks) walaupun
  -- fitur addresses belum dipakai. Ini snapshot saat checkout.
  shipping_address TEXT         NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_order_address_not_blank CHECK (BTRIM(shipping_address) <> '')
);
CREATE INDEX idx_orders_buyer ON orders (buyer_id, created_at DESC);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE store_orders (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id            BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  seller_id           BIGINT REFERENCES users(id) ON DELETE SET NULL,
  store_name          VARCHAR(100) NOT NULL,           -- snapshot nama toko
  fulfillment_status  VARCHAR(20)  NOT NULL DEFAULT 'awaiting_payment',
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_store_order_status CHECK (fulfillment_status IN
    ('awaiting_payment','processing','shipped','completed','cancelled')),
  CONSTRAINT uq_store_order_per_seller UNIQUE (order_id, seller_id)
);
CREATE INDEX idx_store_orders_seller ON store_orders (seller_id, fulfillment_status);
CREATE TRIGGER trg_store_orders_updated BEFORE UPDATE ON store_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Transisi status yang diizinkan (dijaga juga di level database):
--   awaiting_payment -> processing | cancelled
--   processing       -> shipped    | cancelled
--   shipped          -> completed
--   completed, cancelled = final
CREATE FUNCTION enforce_store_order_transition() RETURNS trigger AS $$
BEGIN
  IF NEW.fulfillment_status = OLD.fulfillment_status THEN
    RETURN NEW;
  END IF;
  IF (OLD.fulfillment_status, NEW.fulfillment_status) IN (
       ('awaiting_payment','processing'),
       ('awaiting_payment','cancelled'),
       ('processing','shipped'),
       ('processing','cancelled'),
       ('shipped','completed')
     ) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Transisi status tidak diizinkan: % -> %',
    OLD.fulfillment_status, NEW.fulfillment_status;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_store_orders_transition
  BEFORE UPDATE OF fulfillment_status ON store_orders
  FOR EACH ROW EXECUTE FUNCTION enforce_store_order_transition();

CREATE TABLE order_items (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  store_order_id  BIGINT NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  product_id      BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name    VARCHAR(150)  NOT NULL,              -- snapshot nama produk
  unit_price      NUMERIC(12,2) NOT NULL,              -- harga saat pembelian
  quantity        INTEGER       NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_item_price_positive CHECK (unit_price > 0),
  CONSTRAINT chk_item_qty_positive   CHECK (quantity >= 1)
);
CREATE INDEX idx_order_items_store_order ON order_items (store_order_id);
CREATE INDEX idx_order_items_product     ON order_items (product_id);

-- Total per order dihitung dari item, bukan disimpan sebagai sumber kebenaran.
CREATE VIEW v_order_totals AS
SELECT o.id AS order_id,
       SUM(oi.unit_price * oi.quantity) AS total_amount
FROM orders o
JOIN store_orders so ON so.order_id = o.id
JOIN order_items  oi ON oi.store_order_id = so.id
GROUP BY o.id;

-- =====================================================================
-- 9. reviews
-- Satu ulasan per order item. product_id & buyer_id adalah data turunan:
-- JANGAN diambil dari input client; gunakan INSERT ... SELECT (contoh di
-- bagian bawah). Trigger di bawah menjadi pengaman terakhir di database.
-- =====================================================================
CREATE TABLE reviews (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id     BIGINT NOT NULL REFERENCES products(id)    ON DELETE CASCADE,
  buyer_id       BIGINT NOT NULL REFERENCES users(id)       ON DELETE CASCADE,
  order_item_id  BIGINT NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,
  rating         SMALLINT NOT NULL,
  comment        TEXT     NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT chk_review_comment_not_blank CHECK (BTRIM(comment) <> '')
);
CREATE INDEX idx_reviews_product ON reviews (product_id);

CREATE FUNCTION enforce_review_eligibility() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN store_orders so ON so.id = oi.store_order_id
    JOIN orders o        ON o.id  = so.order_id
    WHERE oi.id = NEW.order_item_id
      AND oi.product_id = NEW.product_id
      AND o.buyer_id    = NEW.buyer_id
      AND so.fulfillment_status = 'completed'
  ) THEN
    RAISE EXCEPTION 'Ulasan tidak valid: order item tidak cocok dengan produk/buyer atau belum selesai';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_eligibility
  BEFORE INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION enforce_review_eligibility();

-- =====================================================================
-- CONTOH QUERY (untuk repository layer, bukan dijalankan di sini)
-- =====================================================================
-- Insert review yang aman ($1 order_item_id, $2 rating, $3 comment, $4 buyer id dari sesi):
--   INSERT INTO reviews (product_id, buyer_id, order_item_id, rating, comment)
--   SELECT oi.product_id, o.buyer_id, oi.id, $2, $3
--   FROM order_items oi
--   JOIN store_orders so ON so.id = oi.store_order_id
--   JOIN orders o        ON o.id  = so.order_id
--   WHERE oi.id = $1 AND o.buyer_id = $4
--     AND so.fulfillment_status = 'completed'
--     AND oi.product_id IS NOT NULL
--   RETURNING id;
--
-- Cegah overselling saat checkout (dalam transaksi):
--   UPDATE products SET stock = stock - $2
--   WHERE id = $1 AND is_active AND stock >= $2
--   RETURNING price, name, seller_id;   -- 0 baris = stok tidak cukup -> ROLLBACK
--
-- Status induk order (turunan) dan rating rata-rata:
--   SELECT product_id, ROUND(AVG(rating),1) AS avg_rating, COUNT(*) AS total
--   FROM reviews GROUP BY product_id;
