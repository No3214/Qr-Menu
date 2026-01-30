-- =============================================
-- Kozbeyli Konağı - Supabase Database Schema
-- =============================================
-- Run this FIRST in Supabase SQL Editor
-- Then run seed.sql to populate data
-- =============================================

-- Drop existing tables if recreating (CAUTION in production!)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- =============================================
-- 1. CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,                    -- String IDs: 'kahvalti', 'tatli', etc.
  title TEXT NOT NULL,                    -- Display name: 'Kahvaltı'
  slug TEXT,                              -- URL-safe: 'kahvalti'
  description TEXT,                       -- Short description for grid view
  image TEXT,                             -- Unsplash image URL
  "order" INTEGER DEFAULT 0,             -- Sort order (1-16)
  is_active BOOLEAN DEFAULT true,        -- Soft delete / hide
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
  id TEXT PRIMARY KEY,                    -- String IDs: 'k1', 'e1', 'b1', etc.
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                     -- Product name (frontend uses 'name')
  description TEXT,                       -- Detailed product description
  price NUMERIC(10, 2) NOT NULL,         -- Price in TRY
  image TEXT,                             -- Product image URL
  is_available BOOLEAN DEFAULT true,     -- Frontend uses 'isAvailable'
  is_active BOOLEAN DEFAULT true,        -- Admin soft delete
  options JSONB DEFAULT '[]'::jsonb,     -- Variants/sides (future use)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT false,     -- Moderation flag
  is_read BOOLEAN DEFAULT false          -- Admin read status
);

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public read, authenticated write
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin write categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- PRODUCTS: Public read, authenticated write
CREATE POLICY "Public read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin write products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- REVIEWS: Anyone can insert, anyone can read (for showing ratings)
-- Admins can update/delete
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- 5. INDEXES (Performance)
-- =============================================
CREATE INDEX idx_categories_order ON categories("order");
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);
