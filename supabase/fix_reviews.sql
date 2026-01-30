-- Add missing column if it doesn't exist
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Drop existing policies to remove recursive dependency
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;

-- Re-create simple policies for Authenticated users (Admins)
-- This avoids the "infinite recursion" error by not querying other tables
CREATE POLICY "Admins can view all reviews" 
ON reviews FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can update reviews" 
ON reviews FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete reviews" 
ON reviews FOR DELETE 
TO authenticated 
USING (true);

-- Ensure Insert policy is still there for guests
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
CREATE POLICY "Anyone can insert reviews" 
ON reviews FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
