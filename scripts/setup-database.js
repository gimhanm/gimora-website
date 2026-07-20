/**
 * Database Setup Script
 * 
 * This script creates the necessary tables and policies in Supabase for the contact form.
 * 
 * Usage: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database for GIMORA contact form...\n')

    // SQL query to create table and policies
    const sqlQuery = `
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

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Allow public inserts" ON contact_inquiries;
      DROP POLICY IF EXISTS "Allow authenticated users to read" ON contact_inquiries;

      -- Create policy to allow public inserts (for form submissions)
      CREATE POLICY "Allow public inserts" ON contact_inquiries
        FOR INSERT WITH CHECK (true);

      -- Create policy to allow authenticated users to read all inquiries
      CREATE POLICY "Allow authenticated users to read" ON contact_inquiries
        FOR SELECT USING (auth.role() = 'authenticated');
    `

    // Execute the SQL query
    const { data, error } = await supabase.rpc('exec', { sql: sqlQuery })

    if (error && !error.message.includes('already exists')) {
      throw error
    }

    console.log('✅ Database setup completed successfully!\n')
    console.log('📋 Next steps:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the SQL query from DATABASE_SETUP.md')
    console.log('4. Set up email notifications (optional)')
    console.log('5. Start the dev server: pnpm dev\n')

  } catch (error) {
    console.error('❌ Error setting up database:')
    console.error(error.message)
    console.error('\n📖 For manual setup, please visit: https://supabase.com/docs')
    process.exit(1)
  }
}

setupDatabase()
