# Quick Start: Contact Form Setup (5 minutes)

## TL;DR - Get it working in 5 steps

### 1. **Run SQL in Supabase Dashboard**

Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query

Copy and paste this:

```sql
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to read" ON contact_inquiries;

CREATE POLICY "Allow public inserts" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');
```

Click **Execute** ✓

### 2. **Verify Environment Variables**

Check your `.env.local` has these:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

Not there? Get from Supabase Dashboard → Settings → API Keys

### 3. **Start the Server**

```bash
pnpm dev
```

### 4. **Test the Form**

Open: http://localhost:3000#contact

Fill out and submit the form ✓

### 5. **Check Supabase**

Go to: https://supabase.com/dashboard → Your Project → Table Editor → contact_inquiries

Should see your submission there ✓

---

## What Happens When Form is Submitted

1. **Client** - Form validates inputs (email, required fields, etc.)
2. **Server** - API route `/api/contact` validates again
3. **Database** - Entry saved in `contact_inquiries` table
4. **Email** - (Optional) Notification sent to business owner
5. **Response** - Success message shown to customer

---

## Enable Email Notifications (Optional)

### Using Resend (Easiest)

1. Go to: https://resend.com and create account
2. Get API key from dashboard
3. In `/app/api/contact/route.ts`, uncomment the Resend code section
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=your_api_key
   BUSINESS_EMAIL=contactgimora@gmail.com
   ```
5. Restart server: `pnpm dev`

---

## Verify Everything Works

| Step | Check | Status |
|------|-------|--------|
| 1 | Form submits without errors | ✓ |
| 2 | Entry appears in Supabase | ✓ |
| 3 | Success message shows | ✓ |
| 4 | Email received (if configured) | ✓ |

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Form doesn't submit | Check browser console for errors |
| "Invalid table" error | Re-run SQL from step 1 |
| Missing env vars | Copy from Supabase Settings → API Keys |
| Emails not received | Check email is configured in route.ts |

---

## File Locations

- **Contact Form Component**: `components/contact/ContactSection.tsx`
- **API Endpoint**: `app/api/contact/route.ts`
- **Database Schema**: `migrations/001_create_contact_inquiries.sql`
- **Full Docs**: `CONTACT_FORM_README.md`

---

## Next Steps

✓ Form is working? Great!

- Review `CONTACT_FORM_README.md` for advanced features
- Set up email notifications
- Configure spam protection if needed
- Deploy to production

---

**Questions?** Check `CONTACT_FORM_README.md` for detailed documentation.
