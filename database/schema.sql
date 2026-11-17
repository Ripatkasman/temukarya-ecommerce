-- =========================================================================
-- TEMUKARYA DATABASE SCHEMA (POSTGRESQL)
-- Cara pakai di pgAdmin:
--   1. Buat database baru (misal: temukarya)
--   2. Query Tool -> buka schema.sql -> Execute (F5)
--   3. Lanjutkan dengan seed.sql
-- PERHATIAN: bagian DROP di bawah menghapus semua data lama.
-- =========================================================================

DROP TABLE IF EXISTS reviews      CASCADE;
DROP TABLE IF EXISTS wishlists    CASCADE;
DROP TABLE IF EXISTS order_items  CASCADE;
DROP TABLE IF EXISTS store_orders CASCADE;
DROP TABLE IF EXISTS orders       CASCADE;
DROP TABLE IF EXISTS addresses    CASCADE;
DROP TABLE IF EXISTS cart_items   CASCADE;
DROP TABLE IF EXISTS carts        CASCADE;
DROP TABLE IF EXISTS products     CASCADE;
DROP TABLE IF EXISTS categories   CASCADE;
DROP TABLE IF EXISTS stores       CASCADE;
DROP TABLE IF EXISTS profiles     CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- -------------------------------------------------------------------------
-- Fungsi: updated_at otomatis berubah setiap ada UPDATE
-- -------------------------------------------------------------------------
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------------------------
-- 1. PROFILES (Admin, Seller, Buyer)
--    status seller: pending -> approved / rejected (hanya oleh Admin)
--    Admin & Buyer selalu 'approved'. Seller baru WAJIB diinsert 'pending'.
-- -------------------------------------------------------------------------
CREATE TABLE profiles (
    id           SERIAL PRIMARY KEY,
    fullname     VARCHAR(150) NOT NULL,
    email        VARCHAR(150) UNIQUE NOT NULL,
    password     VARCHAR(255) NOT NULL,              -- hash bcrypt, bukan teks asli
    role         VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'seller', 'buyer')),
    status       VARCHAR(20)  NOT NULL DEFAULT 'approved'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by  INT REFERENCES profiles(id) ON DELETE SET NULL,  -- admin yang memutuskan
    reviewed_at  TIMESTAMP,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- hanya seller yang boleh berstatus pending/rejected
    CONSTRAINT chk_status_by_role CHECK (role = 'seller' OR status = 'approved')
);

-- -------------------------------------------------------------------------
-- 2. STORES (1 seller = 1 toko)
-- -------------------------------------------------------------------------
CREATE TABLE stores (
    id          SERIAL PRIMARY KEY,
    seller_id   INT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    store_name  VARCHAR(150) NOT NULL,
    description TEXT,
    store_image VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 3. CATEGORIES (dikelola Admin)
--    Tidak bisa dihapus selama masih dipakai produk (RESTRICT di products)
-- -------------------------------------------------------------------------
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 4. PRODUCTS (dikelola Seller; Admin boleh menghapus produk melanggar)
-- -------------------------------------------------------------------------
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    store_id    INT NOT NULL REFERENCES stores(id)     ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    price       NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    stock       INT NOT NULL CHECK (stock >= 0),
    image_url   VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 5-6. CARTS & CART_ITEMS
-- -------------------------------------------------------------------------
CREATE TABLE carts (
    id         SERIAL PRIMARY KEY,
    buyer_id   INT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id         SERIAL PRIMARY KEY,
    cart_id    INT NOT NULL REFERENCES carts(id)    ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INT NOT NULL CHECK (quantity > 0),
    UNIQUE (cart_id, product_id)
);

-- -------------------------------------------------------------------------
-- 7. ADDRESSES (opsional: alamat pengiriman buyer)
-- -------------------------------------------------------------------------
CREATE TABLE addresses (
    id             SERIAL PRIMARY KEY,
    buyer_id       INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(150) NOT NULL,
    phone_number   VARCHAR(30)  NOT NULL,
    street_address TEXT         NOT NULL,
    city           VARCHAR(100) NOT NULL,
    postal_code    VARCHAR(20)  NOT NULL,
    is_primary     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 8. ORDERS (pesanan induk dari buyer)
--    buyer_id RESTRICT: riwayat pesanan tidak ikut terhapus. User yang
--    punya pesanan tidak bisa dihapus (tampilkan pesan error yang jelas).
--    order_status diturunkan dari sub-order (diupdate oleh server).
-- -------------------------------------------------------------------------
CREATE TABLE orders (
    id               SERIAL PRIMARY KEY,
    buyer_id         INT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    total_amount     NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address TEXT NOT NULL,
    order_status     VARCHAR(30) NOT NULL DEFAULT 'awaiting_payment'
                     CHECK (order_status IN ('awaiting_payment','processing','shipped','completed','cancelled')),
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 9. STORE_ORDERS (sub-order per toko, batas data antar seller)
--    Status awal 'awaiting_payment' agar seller bisa mengubahnya menjadi
--    'processing' sesuai ketentuan tugas.
-- -------------------------------------------------------------------------
CREATE TABLE store_orders (
    id                 SERIAL PRIMARY KEY,
    order_id           INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    store_id           INT NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
    subtotal           NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    fulfillment_status VARCHAR(30) NOT NULL DEFAULT 'awaiting_payment'
                       CHECK (fulfillment_status IN ('awaiting_payment','processing','shipped','completed','cancelled')),
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id, store_id)
);

-- -------------------------------------------------------------------------
-- 10. ORDER_ITEMS
--     product_id boleh NULL (produk bisa dihapus), jadi nama & harga
--     disimpan sebagai salinan saat checkout agar riwayat tetap terbaca.
-- -------------------------------------------------------------------------
CREATE TABLE order_items (
    id             SERIAL PRIMARY KEY,
    store_order_id INT NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
    product_id     INT REFERENCES products(id) ON DELETE SET NULL,
    product_name   VARCHAR(150) NOT NULL,
    quantity       INT NOT NULL CHECK (quantity > 0),
    unit_price     NUMERIC(12, 2) NOT NULL CHECK (unit_price > 0)  -- harga saat dibeli
);

-- -------------------------------------------------------------------------
-- 11. REVIEWS (1 ulasan per item pesanan; hanya setelah status completed,
--     divalidasi di server)
-- -------------------------------------------------------------------------
CREATE TABLE reviews (
    id            SERIAL PRIMARY KEY,
    product_id    INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id      INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_item_id INT UNIQUE NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment       TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 12. WISHLISTS (opsional)
-- -------------------------------------------------------------------------
CREATE TABLE wishlists (
    id         SERIAL PRIMARY KEY,
    buyer_id   INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (buyer_id, product_id)
);

-- -------------------------------------------------------------------------
-- INDEX (PostgreSQL tidak membuat index otomatis untuk foreign key)
-- -------------------------------------------------------------------------
CREATE INDEX idx_products_store         ON products(store_id);
CREATE INDEX idx_products_category      ON products(category_id);
CREATE INDEX idx_products_created       ON products(created_at DESC);
CREATE INDEX idx_cart_items_cart        ON cart_items(cart_id);
CREATE INDEX idx_addresses_buyer        ON addresses(buyer_id);
CREATE INDEX idx_orders_buyer           ON orders(buyer_id);
CREATE INDEX idx_store_orders_order     ON store_orders(order_id);
CREATE INDEX idx_store_orders_store     ON store_orders(store_id);
CREATE INDEX idx_order_items_store_order ON order_items(store_order_id);
CREATE INDEX idx_order_items_product    ON order_items(product_id);
CREATE INDEX idx_reviews_product        ON reviews(product_id);
CREATE INDEX idx_profiles_role_status   ON profiles(role, status);

-- -------------------------------------------------------------------------
-- TRIGGER updated_at
-- -------------------------------------------------------------------------
CREATE TRIGGER trg_profiles_updated     BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_stores_updated       BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated     BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_carts_updated        BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_orders_updated       BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_store_orders_updated BEFORE UPDATE ON store_orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
