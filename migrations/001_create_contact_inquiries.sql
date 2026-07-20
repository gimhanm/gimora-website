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

DROP POLICY IF EXISTS "Allow public inserts" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to read" ON contact_inquiries;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read all inquiries
CREATE POLICY "Allow authenticated users to read" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');
