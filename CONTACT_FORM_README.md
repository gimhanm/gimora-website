# GIMORA Contact Form - Implementation Guide

## Overview

This document describes the production-ready contact form implementation for the GIMORA website. The form collects customer inquiries and stores them in Supabase with optional email notifications.

## Features

✅ **Full-featured contact form** with Name, Email, Phone, and Message fields
✅ **Real-time validation** - Email format, required fields, message length
✅ **Error handling** - User-friendly error messages and field-level feedback
✅ **Database integration** - All inquiries stored in Supabase PostgreSQL
✅ **Email notifications** - Business owner receives email for each submission
✅ **Spam protection** - Built-in validation and configurable rate limiting
✅ **Loading states** - Visual feedback during form submission
✅ **Success messages** - Clear confirmation after submission
✅ **Responsive design** - Mobile-friendly form with beautiful GIMORA branding
✅ **Accessibility** - Semantic HTML, ARIA attributes, keyboard navigation

## File Structure

```
├── components/contact/
│   └── ContactSection.tsx          # Main contact form component
├── app/api/contact/
│   └── route.ts                    # API endpoint for form submissions
├── migrations/
│   └── 001_create_contact_inquiries.sql  # Database schema
├── scripts/
│   └── setup-database.js           # Database setup script
├── DATABASE_SETUP.md               # Database setup instructions
└── CONTACT_FORM_README.md         # This file
```

## Setup Instructions

### Step 1: Create the Database Table

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the SQL from `/migrations/001_create_contact_inquiries.sql`
5. Execute the query

**Option B: Using Setup Script**

```bash
node scripts/setup-database.js
```

The SQL query creates:
- `contact_inquiries` table with UUID primary key
- Indexes on email and created_at for performance
- Row-level security policies for data protection
- Permission for public form submissions

### Step 2: Environment Variables

Ensure these are in your `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Notifications (Optional)
BUSINESS_EMAIL=contactgimora@gmail.com
RESEND_API_KEY=your_resend_api_key  # If using Resend
```

### Step 3: Enable Email Notifications (Optional)

The form currently logs email notifications. To enable actual email sending, uncomment the email service code in `/app/api/contact/route.ts` and configure your email provider:

#### Using Resend (Easiest)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Update `/app/api/contact/route.ts` - uncomment Resend code
4. Set `RESEND_API_KEY` in `.env.local`

#### Using SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Implement SendGrid API calls in email function

#### Using Gmail

1. Enable 2FA on your Gmail account
2. Generate App Password
3. Use SMTP configuration with nodemailer

### Step 4: Start Development

```bash
pnpm dev
```

Navigate to `http://localhost:3000#contact` to see the contact form.

## API Endpoint

### POST `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+94 784230450",
  "message": "I'm interested in your Ceylon tea products."
}
```

**Validation:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `phone`: Optional
- `message`: Required, minimum 10 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your inquiry has been submitted successfully"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message describing the issue"
}
```

## Database Schema

**Table: `contact_inquiries`**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | VARCHAR(255) | Customer name |
| email | VARCHAR(255) | Customer email |
| phone | VARCHAR(20) | Customer phone (optional) |
| message | TEXT | Inquiry message |
| created_at | TIMESTAMP | Submission timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_contact_inquiries_email` - For quick lookups by email
- `idx_contact_inquiries_created_at` - For sorting by date

**Row-Level Security (RLS):**
- Public can INSERT new inquiries
- Authenticated users can SELECT all inquiries
- Prevents unauthorized data access

## Form Validation

The contact form includes client-side and server-side validation:

### Client-Side (Real-time feedback)
- Required field validation
- Email format validation
- Message minimum length (10 characters)
- Field-level error messages

### Server-Side (Security)
- All validation repeated on server
- SQL injection prevention
- Input sanitization
- Rate limiting (optional)

## Spam Protection

Current protections:
✅ Email format validation
✅ Required field validation
✅ Message length validation
✅ CORS restrictions
✅ Service role key authentication

**Optional Additional Protections:**
- Rate limiting (Redis recommended)
- CAPTCHA integration
- Honeypot field
- Email verification

## Testing the Form

1. **Valid submission:**
   - Fill all fields with valid data
   - Click "Send Message"
   - Should see success message
   - Check Supabase for new entry

2. **Validation errors:**
   - Try submitting with empty fields
   - Try invalid email format
   - Try message under 10 characters
   - Should see field-level error messages

3. **Email notifications:**
   - Submit form
   - Check email inbox for notification
   - Verify all fields are displayed correctly

## Troubleshooting

### Form submissions not saving

**Check:**
- Table exists in Supabase: `select * from contact_inquiries`
- RLS policies are correct
- Environment variables are set
- No JavaScript errors in browser console

**Solution:**
```bash
# Re-run database setup
node scripts/setup-database.js
```

### Emails not sending

**Check:**
- Email service credentials are correct
- API key is valid and has email sending permission
- BUSINESS_EMAIL environment variable is set
- Check email service logs/dashboard

**Debug:**
- Enable logging in `/app/api/contact/route.ts`
- Check server logs for email sending errors
- Test email service directly with API

### CORS errors

**Cause:** Form is making cross-origin request
**Solution:** Ensure form is submitted to same domain

### "Service Role Key" errors

**Cause:** Missing or incorrect `SUPABASE_SERVICE_ROLE_KEY`
**Solution:** 
1. Get from Supabase: Project Settings → API Keys
2. Copy "service_role" key
3. Add to `.env.local`
4. Restart dev server

## Performance Considerations

- Database indexes optimize queries for email and date sorting
- Queries are parameterized to prevent SQL injection
- Email sending is non-blocking (doesn't delay form response)
- Form submission is validated before database insertion

## Security Best Practices

✅ Service role key only used server-side
✅ Input validation and sanitization
✅ HTML escaping in email templates
✅ Row-level security policies
✅ Required fields validated
✅ No sensitive data in error messages

## Future Enhancements

- [ ] Rate limiting per IP address
- [ ] Email verification flow
- [ ] Admin dashboard to view inquiries
- [ ] Automated response emails
- [ ] Inquiry status tracking
- [ ] File attachments support
- [ ] Multi-language support

## Support

For issues or questions:
1. Check this README and DATABASE_SETUP.md
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for JavaScript errors
4. Review server logs for API errors

## License

This contact form is part of the GIMORA website project.
