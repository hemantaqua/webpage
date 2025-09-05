-- Create the categories table
CREATE TABLE categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the products table
CREATE TABLE products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    images TEXT[], -- An array of image URLs
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);

-- Optional: Add some initial data to test with
-- INSERT INTO categories (name, slug, description) VALUES
-- ('Irrigation Systems', 'irrigation-systems', 'State-of-the-art irrigation solutions.'),
-- ('Water Distribution', 'water-distribution', 'Reliable pipes and fittings.'),
-- ('Solar Solutions', 'solar-solutions', 'High-quality solar components.');

-- INSERT INTO products (category_id, name, slug, description, images) VALUES
-- (1, 'Drip Irrigation Kit', 'drip-irrigation-kit', 'A complete kit for efficient drip irrigation.', '{"/images/product1.jpg", "/images/product2.jpg"}');