#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up GIMORA reviews database...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/003_create_reviews_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec', { sql });
    
    if (error && error.message.includes('function "exec" does not exist')) {
      console.log('Using direct SQL execution via pg_net...');
      // Fallback: try using query directly (this may require the Postgres extension)
      console.error('Note: You need to run the SQL migration manually in your Supabase dashboard');
      console.log('\nSQL Migration Script:');
      console.log('='.repeat(60));
      console.log(sql);
      console.log('='.repeat(60));
      console.log('\nTo apply this:');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log('2. Create new query');
      console.log('3. Paste the SQL above');
      console.log('4. Click Run');
      process.exit(1);
    }

    if (error) {
      throw error;
    }

    console.log('✓ Database setup complete!');
    console.log('✓ reviews table created successfully');
    console.log('✓ RLS policies configured');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    console.log('\nPlease run the SQL migration manually:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Open migrations/003_create_reviews_table.sql');
    console.log('3. Copy and paste into Supabase SQL Editor');
    console.log('4. Click Run');
    process.exit(1);
  }
}

setupDatabase();
