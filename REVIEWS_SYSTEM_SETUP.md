# GIMORA Reviews System Setup Guide

Complete guide to set up and troubleshoot the customer reviews feature.

## Overview

The reviews system allows customers to submit star ratings and written reviews for GIMORA products. All reviews require admin approval before displaying on the website.

**System Components:**
- Frontend: `components/reviews/ReviewForm.tsx` (submission form)
- Frontend: `components/reviews/ReviewsList.tsx` (display reviews)
- Backend: `app/api/reviews/route.ts` (API endpoints)
- Database: `reviews` table in Supabase

---

## Step 1: Database Setup

### Option A: Automatic Setup (Recommended)

Visit the database initialization endpoint to attempt automatic table creation:
```
GET /api/init-db
```

This will attempt to create the reviews table if it doesn't exist.

### Option B: Manual Setup via Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Sign in to your project
   - Navigate to "SQL Editor"

2. **Create a New Query**
   - Click "New Query"
   - Paste the SQL script below
   - Click "Run"

3. **SQL Script to Create Table**

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

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert new reviews
CREATE POLICY "allow_public_insert_reviews" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow public to read only approved reviews
CREATE POLICY "allow_public_read_approved_reviews" ON reviews
  FOR SELECT
  USING (is_approved = true);

-- Policy: Allow admin full access (service role bypasses RLS)
CREATE POLICY "allow_admin_full_access" ON reviews
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. **Verify Table Was Created**
   - In Supabase Dashboard, go to "Table Editor"
   - You should see a `reviews` table
   - Click it to view the columns and confirm they match the script

---

## Step 2: Verify Environment Variables

Check that these environment variables are set in your `.env.local` file:

```env
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find these in your Supabase dashboard:
- Settings → API → Project URL and Keys

---

## Step 3: Test the Reviews System

### Test Form Submission

1. **Open your website** and scroll to the "Customer Reviews" section
2. **Fill out the Review Form** with test data:
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Product: Any product from dropdown
   - Rating: Select 5 stars
   - Review: "This is a test review with at least 20 characters"
3. **Submit the Review**
4. **Check Browser Console** for detailed logs:
   - Open DevTools (F12 or Right-click → Inspect)
   - Go to Console tab
   - Look for messages starting with `[v0]`

### Expected Console Output on Success

```javascript
[v0] Submitting review with payload: {...}
[v0] Review API response status: 201
[v0] Review API response data: {message: "Review submitted successfully...", review: {...}}
[v0] Review submitted successfully: {id: 1, customer_name: "Test Customer", ...}
```

### Expected Console Output on Error

```javascript
[v0] Submitting review with payload: {...}
[v0] Review API response status: 400
[v0] Review API response data: {error: "Review must be between 20 and 1000 characters", code: "INVALID_REVIEW_LENGTH"}
[v0] Review Submit Error: Review must be between 20 and 1000 characters
```

---

## Troubleshooting

### Error: "Reviews table not found in database"

**Cause:** The `reviews` table doesn't exist in Supabase

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and run the SQL script from Step 1 (Option B)
3. Refresh your website
4. Try submitting a review again

### Error: "Permission denied. Check Row Level Security (RLS) policies"

**Cause:** RLS policies are not properly configured

**Solution:**
1. Go to Supabase Dashboard → Table Editor
2. Click on the `reviews` table
3. Go to "RLS" tab
4. Verify these policies exist:
   - `allow_public_insert_reviews` (INSERT)
   - `allow_public_read_approved_reviews` (SELECT)
   - `allow_admin_full_access` (ALL)
5. If missing, run the SQL script again from Step 1

### Error: "Database connection failed"

**Cause:** Supabase credentials are not set or invalid

**Solution:**
1. Verify environment variables in Step 2
2. Check that credentials are correct in Supabase Dashboard
3. Make sure `SUPABASE_SERVICE_ROLE_KEY` is used (not the anon key for the API)

### Reviews Are Not Appearing

**Cause 1:** Reviews are not approved yet

**Solution:**
- Reviews are marked as `is_approved = false` by default
- Only approved reviews are displayed
- Admin must manually approve reviews in Supabase

**To Approve a Review:**
1. Go to Supabase Dashboard → Table Editor → reviews
2. Find the review row
3. Change `is_approved` from `false` to `true`
4. Refresh your website to see the review

**Cause 2:** Form shows success but reviews list doesn't update

**Solution:**
- The review was submitted but not approved yet
- This is correct behavior - reviews require approval
- Approve the review (see above) and refresh the page

### Form Submission Hangs

**Cause:** API request is slow or timing out

**Solution:**
1. Check browser console for error messages
2. Verify database table exists (see troubleshooting above)
3. Check Supabase dashboard for any issues
4. Ensure network connection is stable

---

## Admin Dashboard (Manual Review Approval)

Currently, reviews must be manually approved in Supabase. To build a custom admin dashboard:

1. Create a new page at `app/admin/reviews`
2. Fetch all reviews (approved and pending) from `/api/reviews?approved=false`
3. Add buttons to approve/reject reviews
4. Create API endpoint `PUT /api/reviews/[id]` to update approval status

### Example Query to Fetch Pending Reviews

```typescript
const { data: pendingReviews, error } = await supabase
  .from('reviews')
  .select('*')
  .eq('is_approved', false)
  .order('created_at', { ascending: true })
```

---

## API Endpoints

### GET /api/reviews

Fetch all approved reviews with statistics.

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": 1,
      "customer_name": "John Doe",
      "rating": 5,
      "review_text": "Great quality!",
      "created_at": "2024-01-15T10:30:00Z",
      "verified_purchase": false
    }
  ],
  "stats": {
    "averageRating": 4.8,
    "totalReviews": 15,
    "reviewCounts": {
      "1": 0,
      "2": 1,
      "3": 0,
      "4": 2,
      "5": 12
    }
  }
}
```

### POST /api/reviews

Submit a new review.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "product_name": "Pure Ceylon Black Tea",
  "rating": 5,
  "review_text": "This tea is absolutely amazing! Great quality and taste."
}
```

**Response (201 Created):**
```json
{
  "message": "Review submitted successfully. It will be displayed after admin approval.",
  "review": {
    "id": 16,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "product_name": "Pure Ceylon Black Tea",
    "rating": 5,
    "review_text": "This tea is absolutely amazing! Great quality and taste.",
    "is_approved": false,
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

**Error Response Examples:**

400 - Missing required field:
```json
{
  "error": "Customer name is required",
  "code": "MISSING_NAME"
}
```

400 - Invalid review length:
```json
{
  "error": "Review must be between 20 and 1000 characters (current: 15)",
  "code": "INVALID_REVIEW_LENGTH",
  "currentLength": 15
}
```

503 - Table not found:
```json
{
  "error": "Reviews table not found in database. Please run database setup.",
  "code": "TABLE_NOT_FOUND",
  "details": "relation \"reviews\" does not exist"
}
```

---

## Debugging

### View Console Logs

1. Open your website in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for `[v0]` prefixed messages
5. These show detailed information about:
   - API requests and responses
   - Form validation
   - Database operations
   - Errors and their codes

### Check Server Logs

If using Next.js development server:
```bash
npm run dev
# or
pnpm dev
```

Server-side logs will appear in the terminal showing `[v0]` messages.

### Verify Database

In Supabase Dashboard:
1. Table Editor → reviews
2. Check the `id`, `customer_name`, `rating`, `review_text` columns
3. Look at `is_approved` status (false = needs approval)
4. Check `created_at` to see submission timestamps

---

## FAQ

**Q: Do I need to approve reviews manually?**
A: Yes, all reviews are marked `is_approved = false` by default and must be manually approved in Supabase before they appear.

**Q: Can customers edit their reviews?**
A: Currently, no. Reviews are immutable once submitted. You can delete and have the customer resubmit if needed.

**Q: What if I want to reject a review?**
A: Delete the row from the Supabase table. The review won't be approved and will be removed.

**Q: Can I mark reviews as "Verified Purchase"?**
A: Yes, in Supabase Table Editor, change `verified_purchase` from `false` to `true`. These reviews show a "Verified" badge.

**Q: How do I contact Gimora about reviews?**
A: Support email: contactgimora@gmail.com

---

## Next Steps

1. ✅ Create the reviews table (Step 1)
2. ✅ Verify environment variables (Step 2)
3. ✅ Test the system (Step 3)
4. Approve some reviews in Supabase to see them displayed
5. (Optional) Build custom admin dashboard for easier review management

For more help, check the browser console (F12) for detailed `[v0]` error messages.
