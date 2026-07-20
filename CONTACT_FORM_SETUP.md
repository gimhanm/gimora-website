# Contact Form Setup Guide

## Overview
This guide helps you set up and troubleshoot the contact form on your GIMORA website. The form collects inquiries from customers and stores them in your Supabase database.

## Quick Start (5 Minutes)

### 1. Verify Supabase Environment Variables
Check that these environment variables are set in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (for backend operations)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anonymous key (optional)

### 2. Create the Contact Inquiries Table

Go to your Supabase Dashboard:
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);

-- Create index on created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read all inquiries
CREATE POLICY "Allow authenticated users to read" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');
```

4. Click **Run** to execute the SQL
5. You should see "Query succeeded" message

### 3. Test the Form
1. Go to your website's **Contact** section
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "1234567890" (optional)
   - Message: "This is a test message"
3. Click "Send Message"
4. You should see: "Message Sent Successfully! We'll get back to you within 24 hours."

### 4. Verify in Supabase
1. Go to Supabase Dashboard
2. Click **Table Editor** → **contact_inquiries**
3. You should see your test message in the table

## Troubleshooting

### Error: "Database connection failed"
**Cause:** Supabase credentials are not configured
**Fix:**
1. Go to Vercel Project Settings → Environment Variables
2. Add these variables (get values from Supabase Dashboard):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy your project

### Error: "Contact table not found"
**Cause:** The `contact_inquiries` table hasn't been created
**Fix:**
1. Follow the "Create the Contact Inquiries Table" steps above
2. Make sure the SQL query runs without errors

### Error: "Permission denied"
**Cause:** RLS policies are preventing inserts
**Fix:**
1. Go to Supabase Dashboard
2. Click **Table Editor** → **contact_inquiries** → **RLS** (right side)
3. Check that the policy "Allow public inserts" is enabled
4. If not, create it using the SQL from Step 2 above

### Error: "Duplicate submission"
**Cause:** Same email submitted multiple times in quick succession
**Fix:** This is intentional rate limiting. Users need to wait a moment between submissions.

## API Endpoint Reference

### POST /api/contact

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I would like to inquire about your products..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your inquiry has been submitted successfully. We will get back to you within 24 hours.",
  "status": 200
}
```

**Error Response Examples:**

400 - Missing Fields:
```json
{
  "error": "Name is required",
  "code": "MISSING_NAME",
  "status": 400
}
```

400 - Invalid Email:
```json
{
  "error": "Please provide a valid email address",
  "code": "INVALID_EMAIL",
  "status": 400
}
```

503 - Database Not Found:
```json
{
  "error": "Contact table not found. Database setup required.",
  "code": "TABLE_NOT_FOUND",
  "status": 503
}
```

## Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Name | Text | Yes | Minimum 1 character |
| Email | Email | Yes | Valid email format |
| Phone | Tel | No | Any format accepted |
| Message | Textarea | Yes | Minimum 10 characters |

## Features

✓ Real-time validation
✓ Error messages for each field
✓ Loading spinner during submission
✓ Success message with 5-second timeout
✓ Form clears after successful submission
✓ Browser console logging for debugging
✓ Duplicate submission prevention
✓ HTML escaping for security
✓ Email normalization (lowercase, trimmed)
✓ Rate limiting by email address

## Email Notifications (Optional)

The contact form can send email notifications to you. To enable:

1. Set up an email service (Resend, SendGrid, etc.)
2. Get an API key for your email service
3. Uncomment the email sending code in `/app/api/contact/route.ts`
4. Set `BUSINESS_EMAIL` environment variable
5. Set API key environment variables for your email service

Currently, submissions are logged to the console. Check Vercel Logs for email content.

## Debugging

### Check Browser Console
Open your browser's Developer Tools (F12) and go to Console tab. You'll see:
- `[v0] Submitting contact form with payload: {...}`
- `[v0] Contact form API response status: 200`
- `[v0] Contact form submitted successfully`

Or on error:
- `[v0] Contact form submission failed: {...}`
- `[v0] Contact form error: ...`

### Check Vercel Logs
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Open the current deployment
4. Click **Runtime Logs** to see server logs
5. Search for `[v0] Contact` to find form submission logs

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click **Logs** → **Database Webhooks**
3. You should see INSERT operations for successful submissions

## Security

- All inputs are validated server-side
- HTML is escaped to prevent XSS attacks
- RLS policies prevent unauthorized access
- Service role key is kept secret (server-only)
- Email is normalized and trimmed
- Message content is HTML-escaped before storage

## Next Steps

1. ✓ Set up the database table
2. ✓ Test the form locally
3. ✓ Deploy to production
4. (Optional) Set up email notifications
5. (Optional) Create admin dashboard to view inquiries

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review console logs (browser and Vercel)
3. Verify Supabase table structure
4. Check environment variables are set correctly
5. Ensure RLS policies are properly configured
