
-- Add allergens and labels columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS allergens text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS labels text[] DEFAULT '{}';

-- Update existing products with some sample data for demonstration
UPDATE products 
SET allergens = '{"gluten", "dairy"}' 
WHERE title ILIKE '%pizza%' OR title ILIKE '%sandviç%' OR title ILIKE '%börek%';

UPDATE products 
SET allergens = '{"egg"}' 
WHERE title ILIKE '%yumurta%' OR title ILIKE '%menemen%';

UPDATE products 
SET labels = '{"popular"}' 
WHERE title ILIKE '%serpme%' OR title ILIKE '%köfte%';

UPDATE products 
SET labels = '{"new"}' 
WHERE title ILIKE '%san sebastian%';
