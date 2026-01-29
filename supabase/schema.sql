-- Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  options JSONB DEFAULT '[]'::jsonb, -- Store variants/sides as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read, Authenticated Write)
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

CREATE POLICY "Admin Write Categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Insert Sample Data (Optional - Mimics MenuData.ts)
INSERT INTO categories (title, "order", image) VALUES
('Başlangıçlar', 1, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('Ana Yemekler', 2, 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80'),
('Tatlilar', 3, 'https://images.unsplash.com/photo-1563729768-b6363c4df969?auto=format&fit=crop&q=80');
