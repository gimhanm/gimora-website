-- Create testimonials table for user-submitted comments
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for efficient sorting
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at DESC);

-- Create index on is_approved for filtering
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);

-- Set up RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert testimonials
CREATE POLICY "Allow public insert"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read approved testimonials
CREATE POLICY "Allow public read approved testimonials"
  ON testimonials
  FOR SELECT
  TO anon
  USING (is_approved = true);
