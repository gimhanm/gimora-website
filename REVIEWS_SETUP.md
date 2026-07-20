# Customer Reviews System Setup Guide

## Overview
The GIMORA website now features a comprehensive customer review system with:
- Real customer ratings (1-5 stars)
- Detailed review text
- Admin approval workflow
- Review statistics and analytics
- Verified purchase badges
- Responsive pagination
- Beautiful rating distribution visualization

## Database Setup

### 1. Run the Migration
Execute the SQL migration to create the reviews table in Supabase:

**File:** `/migrations/003_create_reviews_table.sql`

Steps:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of `migrations/003_create_reviews_table.sql`
5. Click "Run"

This creates:
- `reviews` table with all necessary fields
- Proper indexes for performance
- Row Level Security (RLS) policies
- Public insert permissions (for form submissions)
- Public read permissions (for approved reviews only)

### 2. Verify Table Creation
```sql
SELECT * FROM reviews LIMIT 1;
```

## Architecture

### Database Schema
```sql
reviews table:
├── id (BIGINT) - Primary key
├── customer_name (VARCHAR) - Submitted customer name
├── customer_email (VARCHAR) - Submitted customer email
├── product_name (VARCHAR) - Product being reviewed
├── rating (INTEGER) - 1-5 star rating
├── review_text (TEXT) - Full review content
├── verified_purchase (BOOLEAN) - Purchase verification badge
├── is_approved (BOOLEAN) - Approval status (default: false)
├── created_at (TIMESTAMP) - Review submission date
├── updated_at (TIMESTAMP) - Last update date
└── admin_notes (TEXT) - Admin moderation notes
```

### Components

#### ReviewForm (`components/reviews/ReviewForm.tsx`)
- **Purpose:** Customer review submission form
- **Features:**
  - Customer name input (validated)
  - Email address (validated with regex)
  - Product selection dropdown
  - Interactive star rating (1-5)
  - Rich review text area (20-1000 characters)
  - Real-time character counter
  - Field validation with error messages
  - Success/error notifications
  - Loading state during submission
- **Validation Rules:**
  - Name: 2+ characters required
  - Email: Valid format required
  - Review: 20-1000 characters required
  - Rating: 1-5 stars required

#### ReviewsList (`components/reviews/ReviewsList.tsx`)
- **Purpose:** Display and manage customer reviews
- **Features:**
  - Average rating calculation
  - Rating distribution visualization
  - Individual review cards with:
    - Customer name and date
    - Star rating display
    - Review text
    - Verified purchase badge
  - Pagination (6 reviews per page)
  - Loading state
  - Empty state message

#### TestimonialsSection (`components/testimonials/TestimonialsSection.tsx`)
- **Purpose:** Main testimonials page section
- **Contains:**
  - Section header with subtitle
  - ReviewsList component
  - ReviewForm component (wrapped in white card)
  - Trust indicators (business categories)

### API Routes

#### GET `/api/reviews`
Fetches approved reviews with statistics.

**Query Parameters:**
- `limit` (optional): Maximum number of reviews to fetch (default: 100)

**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "customer_name": "John Doe",
      "rating": 5,
      "review_text": "Excellent quality...",
      "created_at": "2024-06-22T10:30:00Z",
      "verified_purchase": true
    }
  ],
  "stats": {
    "averageRating": 4.8,
    "totalReviews": 15,
    "reviewCounts": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 4,
      "5": 8
    }
  }
}
```

#### POST `/api/reviews`
Submit a new customer review.

**Request Body:**
```json
{
  "customer_name": "Jane Smith",
  "customer_email": "jane@example.com",
  "product_name": "Pure Ceylon Black Tea",
  "rating": 5,
  "review_text": "Amazing quality and fresh aroma. Highly recommended!"
}
```

**Validation:**
- All fields required
- Name: 2+ characters
- Email: Valid format
- Rating: 1-5
- Review: 20-1000 characters

**Response (Success):**
```json
{
  "message": "Review submitted successfully. It will be displayed after admin approval.",
  "review": { ... }
}
```

**Response (Error):**
```json
{
  "error": "Validation error message"
}
```

## Admin Panel Features

### Approving Reviews
1. Go to Supabase Dashboard
2. Select the `reviews` table
3. Find reviews with `is_approved = false`
4. Update `is_approved` to `true`

### Adding Verified Purchase Badges
1. Manually verify purchase with customer
2. Update `verified_purchase = true`
3. Optionally add notes in `admin_notes`

### Filtering Reviews
- **Unapproved:** `is_approved = false`
- **By Product:** Filter by `product_name`
- **By Rating:** Filter by `rating` (e.g., rating >= 4)
- **Date Range:** Filter by `created_at`

### Bulk Actions
Example SQL to approve all reviews from specific customers:
```sql
UPDATE reviews 
SET is_approved = true 
WHERE customer_email IN ('email1@example.com', 'email2@example.com');
```

## Features & Specifications

### Review Display
- **Sorting:** Newest reviews first (DESC by created_at)
- **Filtering:** Only approved reviews shown
- **Pagination:** 6 reviews per page
- **Statistics:**
  - Average rating (1 decimal place)
  - Total review count
  - Per-rating distribution chart

### Form Validation
- HTML sanitization (escapes HTML entities)
- Email format validation
- Character length validation
- Required field validation
- Real-time error messages

### Security
- Row Level Security (RLS) enabled
- Public can only insert and read approved reviews
- Admin can manage all reviews
- HTML entity escaping prevents XSS
- Input validation on both client and server

### User Experience
- Smooth animations
- Loading states
- Success/error toasts
- Mobile responsive design
- Accessible star rating interface
- Character counter for reviews
- Product dropdown with common items

## Customization

### Adding More Products
Edit `components/reviews/ReviewForm.tsx`:
```tsx
<select id="productName" name="productName" ...>
  <option value="Pure Ceylon Black Tea">Pure Ceylon Black Tea</option>
  <option value="Black Pepper">Black Pepper</option>
  <option value="Your New Product">Your New Product</option>
  {/* Add more options */}
</select>
```

### Changing Reviews Per Page
Edit `components/reviews/ReviewsList.tsx`:
```tsx
const REVIEWS_PER_PAGE = 6; // Change this number
```

### Adjusting Character Limits
Edit `components/reviews/ReviewForm.tsx`:
```tsx
const validateForm = (): boolean => {
  // Change these values:
  if (formData.reviewText.trim().length < 20) { ... }
  if (formData.reviewText.trim().length > 1000) { ... }
}
```

## Testing

### Manual Testing Checklist
- [ ] Submit a review with valid data
- [ ] Verify review appears in list after approval
- [ ] Test form validation (empty fields, invalid email)
- [ ] Check pagination with 7+ reviews
- [ ] Verify average rating calculation
- [ ] Test rating distribution chart
- [ ] Check mobile responsiveness
- [ ] Test HTML escaping (try <script> tags)

### Adding Test Data
```sql
INSERT INTO reviews (customer_name, customer_email, product_name, rating, review_text, is_approved, created_at)
VALUES 
  ('John Smith', 'john@example.com', 'Pure Ceylon Black Tea', 5, 'Exceptional quality and freshness. Best tea I have tried!', true, NOW()),
  ('Sarah Johnson', 'sarah@example.com', 'Black Pepper', 4, 'Great flavor profile, consistent quality across batches.', true, NOW()),
  ('Michael Lee', 'michael@example.com', 'Pure Ceylon Black Tea', 5, 'Premium quality, exactly what our restaurant needed.', true, NOW());
```

## Troubleshooting

### Reviews Not Appearing
1. Check `is_approved = true` in database
2. Verify RLS policies are correctly set
3. Clear browser cache
4. Check console for API errors

### Form Submission Fails
1. Verify Supabase credentials in environment variables
2. Check network tab in DevTools
3. Ensure email is valid format
4. Check character count of review (20-1000)

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that design tokens are available in globals.css
- Verify premium-border class exists

## Environment Variables
Required Supabase credentials (add to `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Performance

### Query Optimization
- Reviews table is indexed by:
  - `is_approved` (for filtering approved reviews)
  - `created_at DESC` (for sorting newest first)
  - `rating` (for statistics)
  - `product_name` (for product filtering)

### Pagination
- Default 100 reviews fetched and paginated client-side
- Change `limit` parameter in API route for larger datasets
- Consider server-side pagination if >1000 reviews

## Future Enhancements
- Photo uploads with reviews
- Helpful/unhelpful voting
- Response system for admin replies
- Review filtering by product
- Review search functionality
- Email notifications for new reviews
- Integration with loyalty programs

## Support
For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Next.js Documentation: https://nextjs.org
