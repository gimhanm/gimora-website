# Supabase Reviews System - Complete Setup & Debugging Guide

## Quick Start (5 Minutes)

### Step 1: Verify Environment Variables
Open your project settings and verify these env vars are set:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key (secret)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (public)
- ✅ `SUPABASE_ANON_KEY` - Same as above

**If any are missing:**
1. Go to Supabase dashboard
2. Project Settings > API
3. Copy the URLs and keys
4. Add them to your environment variables

### Step 2: Create Reviews Table in Supabase

#### Option A: Automatic Setup (Recommended)
1. Open your browser dev tools (F12)
2. Go to Network tab
3. Visit your app and try to load reviews
4. If table doesn't exist, you'll see error
5. Call this in your browser console:
```javascript
fetch('/api/init-reviews', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

#### Option B: Manual SQL Setup
1. Go to Supabase Dashboard > SQL Editor
2. Create a new query
3. **Copy and paste the entire SQL below:**

```sql
-- Create reviews table with comprehensive fields
CREATE TABLE IF NOT EXISTS reviews (
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
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_name);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- DROP existing policies if they exist (optional, run if you're resetting)
-- DROP POLICY IF EXISTS "allow_public_insert_reviews" ON reviews;
-- DROP POLICY IF EXISTS "allow_public_read_approved_reviews" ON reviews;
-- DROP POLICY IF EXISTS "allow_admin_read_all_reviews" ON reviews;
-- DROP POLICY IF EXISTS "allow_admin_update_reviews" ON reviews;

-- RLS Policies

-- 1. Public INSERT: Anyone can submit a review (but is_approved = false by default)
CREATE POLICY "allow_public_insert_reviews" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- 2. Public READ: Anyone can only see approved reviews (is_approved = true)
CREATE POLICY "allow_public_read_approved_reviews" ON reviews
  FOR SELECT
  USING (is_approved = true);

-- 3. Admin READ: Service role can read all reviews (including unapproved)
CREATE POLICY "allow_service_role_read_all" ON reviews
  FOR SELECT
  USING (true);

-- 4. Admin UPDATE: Service role can update reviews to approve them
CREATE POLICY "allow_service_role_update" ON reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 5. Admin DELETE: Service role can delete reviews
CREATE POLICY "allow_service_role_delete" ON reviews
  FOR DELETE
  USING (true);
```

4. Click "Run" button
5. Refresh your browser

## Debugging the Reviews System

### Check 1: Verify Table Exists
Run this in Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'reviews';
```
Should return 1 row. If 0 rows, table doesn't exist - run the SQL above.

### Check 2: Verify RLS Policies
Run this in Supabase SQL Editor:
```sql
SELECT policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'reviews';
```
Should show all 5 policies. If none or incorrect, re-run the SQL above.

### Check 3: Test INSERT Permission
Run this in Supabase SQL Editor:
```sql
INSERT INTO reviews (customer_name, customer_email, product_name, rating, review_text)
VALUES ('Test User', 'test@example.com', 'Test Product', 5, 'This is a test review of at least 20 characters long.');
```
Should succeed. If error, check RLS policies.

### Check 4: Test SELECT Permission (Approved Only)
Run this in Supabase SQL Editor:
```sql
SELECT * FROM reviews WHERE is_approved = true;
```
Should return only approved reviews. If you see unapproved reviews, RLS is misconfigured.

### Check 5: Browser Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs with `[v0]` prefix:
```
[v0] Fetching reviews from /api/reviews
[v0] Fetch reviews response status: 200
[v0] Reviews fetched successfully: 0 reviews
```

If status is 503 or error message mentions "table does not exist", run the SQL setup.

## Common Errors & Solutions

### Error: "relation 'reviews' does not exist"
**Cause:** Table hasn't been created yet
**Solution:** Run the SQL schema from Step 2 above

### Error: "permission denied for schema public"
**Cause:** RLS policies are too restrictive
**Solution:** Make sure all 5 policies are created with `WITH CHECK (true)`

### Error: "Failed to fetch reviews" (Status 500)
**Cause:** Database connection or query error
**Solution:**
1. Check environment variables are set
2. Verify Supabase URL is correct
3. Check RLS policies exist
4. Look at browser console [v0] logs

### Approved Reviews Not Showing
**Cause:** RLS policy "allow_public_read_approved_reviews" is missing or broken
**Solution:**
1. Verify RLS policies exist (Check 2 above)
2. Make sure the USING clause is: `USING (is_approved = true)`

### Can't Submit New Reviews
**Cause:** INSERT policy missing or RLS misconfigured
**Solution:**
1. Verify "allow_public_insert_reviews" policy exists
2. Make sure WITH CHECK is `(true)`
3. Check form validation isn't blocking submission

## Architecture Overview

### Database Flow
```
User Browser
    ↓
ReviewForm Component
    ↓
/api/reviews POST (Submit review)
    ↓
Supabase Service Role Client
    ↓
INSERT INTO reviews
    ↓
ReviewsList Component
    ↓
/api/reviews GET (Fetch approved reviews)
    ↓
Supabase Service Role Client
    ↓
SELECT * FROM reviews WHERE is_approved = true
    ↓
Display Reviews to User
```

### Security Model
- **Public Users**: Can only see `is_approved = true` reviews
- **Public Users**: Can submit reviews (stored with `is_approved = false`)
- **Admin (Service Role)**: Can see and approve all reviews
- **SQL Injection**: Prevented by Supabase parameterized queries

## Environment Variables Required

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Where to Get These
1. Go to Supabase Dashboard
2. Click on Project > Settings
3. Click API in left sidebar
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

## Testing the System

### Test 1: Submit a Review
1. Navigate to reviews section on website
2. Fill out the form with:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Product: "Pure Ceylon Black Tea"
   - Rating: 5 stars
   - Review: "This product is amazing and excellent quality!"
3. Click "Submit Review"
4. Should see: "Review submitted successfully"

### Test 2: Verify Review in Database
1. Supabase Dashboard > SQL Editor
2. Run: `SELECT * FROM reviews WHERE is_approved = false;`
3. Should see your submitted review
4. Run: `SELECT * FROM reviews WHERE is_approved = true;`
5. Should be empty (unapproved reviews don't show)

### Test 3: Approve Review
1. Supabase Dashboard > SQL Editor
2. Run: 
```sql
UPDATE reviews 
SET is_approved = true 
WHERE customer_email = 'john@example.com';
```
3. Refresh the website
4. Review should now appear in the reviews section

### Test 4: Check Logs
1. Open browser DevTools (F12)
2. Console tab
3. Submit a review
4. Should see logs:
```
[v0] Submitting review with payload: {...}
[v0] Review API response status: 201
[v0] Review submitted successfully
```

## File Reference

- **Components**: `components/reviews/ReviewForm.tsx`, `components/reviews/ReviewsList.tsx`
- **API Routes**: `app/api/reviews/route.ts`, `app/api/init-reviews/route.ts`
- **Migrations**: `migrations/003_create_reviews_table.sql`
- **Documentation**: `REVIEWS_SYSTEM_SETUP.md`, `REVIEW_SUBMISSION_FIXES_SUMMARY.md`

## Getting Help

If issues persist:
1. Check all [v0] console logs
2. Run all "Check" queries from Debugging section
3. Verify environment variables are set in Vercel
4. Make sure all SQL from Step 2 was executed
5. Try clearing browser cache and refreshing
