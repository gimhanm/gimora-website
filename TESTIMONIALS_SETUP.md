# Testimonials & Comments System Setup

This guide will help you set up the customer testimonials/comments system for GIMORA.

## Overview

The testimonials system allows customers to submit reviews and comments about GIMORA products. New testimonials require admin approval before being displayed on the website.

## Database Setup

### Step 1: Run the Migration

Execute the SQL migration to create the testimonials table:

```sql
-- Run this in your Supabase SQL Editor
-- File: migrations/002_create_testimonials_table.sql

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

CREATE INDEX idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read approved testimonials"
  ON testimonials
  FOR SELECT
  TO anon
  USING (is_approved = true);
```

### Step 2: Verify the Table

In Supabase dashboard:
1. Go to **SQL Editor**
2. Run the migration SQL above
3. Navigate to **Table Editor**
4. Verify `testimonials` table appears in the list
5. Check that RLS policies are enabled

## API Endpoints

### GET /api/testimonials
Fetches all approved testimonials.

**Response:**
```json
{
  "testimonials": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Restaurant Owner",
      "quote": "GIMORA products are exceptional!",
      "rating": 5,
      "is_approved": true,
      "created_at": "2024-06-18T10:30:00Z"
    }
  ]
}
```

### POST /api/testimonials
Submits a new testimonial.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "title": "Chef",
  "quote": "Outstanding quality and freshness!",
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your testimonial! It will be reviewed and published shortly.",
  "testimonial": { /* testimonial object */ }
}
```

**Validation Rules:**
- Name: Required, max 255 characters
- Email: Required, valid format
- Title: Optional, max 255 characters
- Quote: Required, 10-500 characters
- Rating: Required, integer 1-5

## Frontend Components

### TestimonialForm Component
Located at: `components/testimonials/TestimonialForm.tsx`

A form component for collecting customer testimonials with:
- Name, email, title, rating inputs
- Testimonial textarea with character counter (max 500)
- Star rating selector
- Real-time validation
- Success/error messages
- Loading states

**Usage:**
```tsx
import TestimonialForm from '@/components/testimonials/TestimonialForm'

export default function Page() {
  return <TestimonialForm />
}
```

### TestimonialsSection Component
Located at: `components/testimonials/TestimonialsSection.tsx`

Main section component that displays:
- 3 static brand testimonials (pre-written)
- Up to 3 most recent approved user testimonials
- Testimonial submission form
- "Trust Indicators" showing target industries

## Moderation & Admin

### To Approve Testimonials

1. Go to Supabase dashboard → Table Editor
2. Find the `testimonials` table
3. Filter by `is_approved = false`
4. Review testimonials
5. Click the `is_approved` checkbox to approve

### To Delete Testimonials

1. Open the testimonials table
2. Select the testimonial row
3. Click delete

### To View All Testimonials

Run this query in SQL Editor:
```sql
SELECT * FROM testimonials ORDER BY created_at DESC;
```

## Best Practices

1. **Review Frequently**: Check for new testimonials regularly
2. **Respond Personally**: Consider emailing approved customers to thank them
3. **Maintain Quality**: Reject testimonials that are:
   - Spam or unrelated
   - Offensive or inappropriate
   - Promotional for competitors
   - Test submissions
4. **Feature Diverse Testimonials**: Mix testimonials from different customer types
5. **Update Regularly**: Keep fresh testimonials displayed on the homepage

## Troubleshooting

### "Failed to fetch testimonials" error
- Check Supabase connection
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check RLS policies allow anonymous SELECT

### "Failed to submit testimonial" error
- Verify form validation passes
- Check Supabase INSERT RLS policy
- Review API logs for details

### Testimonials not appearing
- Verify `is_approved` is set to `true`
- Check table has data using SQL query
- Verify RLS SELECT policy is configured

## File Structure

```
components/testimonials/
├── TestimonialsSection.tsx    # Main section component
├── TestimonialForm.tsx         # Submission form component

app/api/testimonials/
├── route.ts                    # GET/POST endpoints

migrations/
├── 002_create_testimonials_table.sql
```

## Environment Variables Required

These should already be set in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Support

For issues or questions about the testimonials system:
1. Check the Supabase documentation
2. Review API response messages
3. Check browser console for detailed errors
4. Verify database RLS policies are correctly configured
