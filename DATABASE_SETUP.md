# Database Setup for GIMORA Contact Form

## Prerequisites
- Supabase project already set up
- Environment variables configured (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

## Setup Instructions

### 1. Create the contact_inquiries table

Go to your Supabase project dashboard and run the following SQL query in the SQL Editor:

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

### 2. Set up Email Notifications (Optional but Recommended)

To receive email notifications when customers submit inquiries, you have several options:

#### Option A: Using Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_api_key_here
   BUSINESS_EMAIL=your_email@example.com
   ```
4. Uncomment the Resend code in `/app/api/contact/route.ts`

#### Option B: Using SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=your_api_key_here
   BUSINESS_EMAIL=your_email@example.com
   ```

#### Option C: Using NodeMailer with Gmail
1. Set up an App Password in Gmail
2. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   BUSINESS_EMAIL=your_email@gmail.com
   ```

### 3. Environment Variables

Create or update `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BUSINESS_EMAIL=contactgimora@gmail.com
```

## Testing

1. Start the dev server: `pnpm dev`
2. Navigate to the contact form
3. Submit a test inquiry
4. Check your Supabase dashboard to verify the data was saved
5. Check your email to verify you received the notification

## Spam Protection

The current implementation includes:
- Email format validation
- Required field validation
- Message length validation (minimum 10 characters)
- CORS restrictions on API endpoint

For additional protection, consider:
- Adding rate limiting (e.g., using Redis)
- Implementing CAPTCHA
- Adding honeypot field
- Verifying email addresses

## Troubleshooting

### Inquiries not being saved
- Check that the table was created successfully
- Verify environment variables are set correctly
- Check browser console for API errors

### Emails not sending
- Verify email service credentials
- Check API keys are correct
- Review email service logs
- Check spam folder

### Form validation errors
- All fields except phone are required
- Email must be in valid format
- Message must be at least 10 characters
