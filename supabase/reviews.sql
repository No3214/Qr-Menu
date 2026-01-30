-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    customer_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT false, -- For moderation if needed later
    is_read BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Anyone (anon) can insert a review (Guests)
CREATE POLICY "Anyone can insert reviews" 
ON reviews FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. Only authenticated users (Admin) can view all reviews
CREATE POLICY "Admins can view all reviews" 
ON reviews FOR SELECT 
TO authenticated 
USING (true);

-- 3. Only admins can update reviews (approve/mark read)
CREATE POLICY "Admins can update reviews" 
ON reviews FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Only admins can delete reviews
CREATE POLICY "Admins can delete reviews" 
ON reviews FOR DELETE 
TO authenticated 
USING (true);
