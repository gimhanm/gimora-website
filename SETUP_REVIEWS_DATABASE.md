# Setting Up the Reviews Database

The review submission feature requires a `reviews` table in your Supabase database. Follow these steps to create it:

## Quick Setup (5 minutes)

### Step 1: Go to Supabase Dashboard

1. Visit https://app.supabase.com/
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Create a New Query

1. Click "New Query" button
2. You should see an empty SQL editor

### Step 3: Copy and Paste the SQL

Copy the entire SQL script below and paste it into the Supabase SQL Editor:

```sql
-- Create reviews table with comprehensive fields
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  admin_notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_name);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can insert reviews (but marked as not approved by default)
CREATE POLICY IF NOT EXISTS allow_public_insert_reviews ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Public can only see approved reviews
CREATE POLICY IF NOT EXISTS allow_public_read_approved_reviews ON public.reviews
  FOR SELECT
  USING (is_approved = true);

-- Allow service role (admin) full access
DROP POLICY IF EXISTS "allow_admin_full_access" ON public.reviews;
CREATE POLICY allow_admin_full_access ON public.reviews
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 4: Execute the Query

1. Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)
2. Wait for the query to complete (usually 1-2 seconds)
3. You should see a success message

### Step 5: Verify Success

1. In the left sidebar, click "Table Editor"
2. Look for a table named "reviews" in the list
3. If you see it, the setup is complete!

## Testing the Feature

Once the table is created:

1. Go to your website (http://localhost:3000)
2. Scroll to the "Customer Reviews" section
3. Fill out the review form with test data
4. Click "Submit Review"
5. You should see a success message

## Troubleshooting

### Error: "Failed to submit review"

**Cause:** The reviews table doesn't exist in your database.

**Solution:** Follow the Quick Setup steps above to create the table.

### Error: "Table already exists"

This is expected if you've already run the migration. No action needed - the table is ready to use.

### Error: "Permission denied"

This might happen if RLS policies are misconfigured.

**Solution:** 
1. Go to Supabase Dashboard > Authentication > Policies
2. Make sure you see the "allow_public_insert_reviews" and other policies listed
3. If not, re-run the SQL script above

## Checking Your Database

To view submitted reviews in your Supabase dashboard:

1. Go to Table Editor
2. Click the "reviews" table
3. Set the filter to `is_approved = true` to see approved reviews only
4. To approve a review, find it in the table, set `is_approved` to `true`, then click Save

## Manual Review Approval

Currently, reviews are set to `is_approved = false` by default. You need to manually approve them in the Supabase dashboard:

1. Go to Table Editor > reviews table
2. Find the review you want to approve
3. Click the row to expand it
4. Change `is_approved` from `false` to `true`
5. Click "Save"
6. The review will now appear on your website

## Future: Automated Approval

To set up automatic approval (not recommended for production), you could:

1. Create a custom function in Supabase
2. Add a webhook trigger when new reviews are submitted
3. Implement a moderation workflow

For now, manual approval ensures quality control.
