
-- ⚠️ IMPORTANT: Run this script in your Supabase SQL Editor to enable the new Menu Features.

-- 1. Add new columns for Allergens and Labels
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS allergens text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS labels text[] DEFAULT '{}';

-- 2. Add some sample data to see the effect immediately
-- (You can remove this part if you want to add data provided manually)

-- Add 'Popular' label to some items
UPDATE products 
SET labels = '{"popular"}' 
WHERE title ILIKE '%serpme%' OR title ILIKE '%köfte%' OR title ILIKE '%burger%';

-- Add 'New' label
UPDATE products 
SET labels = '{"new"}' 
WHERE title ILIKE '%san sebastian%' OR title ILIKE '%tacos%';

-- Add Allergens
UPDATE products 
SET allergens = '{"gluten", "dairy"}' 
WHERE title ILIKE '%pizza%' OR title ILIKE '%sandviç%' OR title ILIKE '%börek%' OR title ILIKE '%makarna%';

UPDATE products 
SET allergens = '{"egg"}' 
WHERE title ILIKE '%yumurta%' OR title ILIKE '%menemen%';

UPDATE products 
SET allergens = '{"spicy"}' 
WHERE title ILIKE '%acılı%' OR title ILIKE '%mexico%';

UPDATE products 
SET allergens = '{"vegetarian"}' 
WHERE title ILIKE '%salata%' OR title ILIKE '%sebze%';
