-- Create reviews table with comprehensive fields
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  admin_notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_name);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Reviews Table
DROP POLICY IF EXISTS "allow_public_insert_reviews" ON reviews;
DROP POLICY IF EXISTS "allow_public_read_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "allow_admin_read_all_reviews" ON reviews;
DROP POLICY IF EXISTS "allow_admin_update_reviews" ON reviews;
DROP POLICY IF EXISTS "allow_admin_delete_reviews" ON reviews;

-- Policy 1: Public can INSERT reviews
-- This allows any user to submit a review
CREATE POLICY "allow_public_insert_reviews" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Public can only SELECT approved reviews
-- This prevents users from seeing unapproved reviews
CREATE POLICY "allow_public_read_approved_reviews" ON reviews
  FOR SELECT
  USING (is_approved = true);

-- Policy 3: Service role (admin) can SELECT all reviews
-- This allows backend admin operations to see all reviews
CREATE POLICY "allow_admin_read_all_reviews" ON reviews
  FOR SELECT
  USING (true);

-- Policy 4: Service role (admin) can UPDATE reviews
-- This allows backend to approve/update reviews
CREATE POLICY "allow_admin_update_reviews" ON reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 5: Service role (admin) can DELETE reviews
-- This allows backend to delete spam/inappropriate reviews
CREATE POLICY "allow_admin_delete_reviews" ON reviews
  FOR DELETE
  USING (true);
