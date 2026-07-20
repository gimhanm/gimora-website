import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials are not configured')
  }

  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    // Check if reviews table exists by querying information_schema
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'reviews')

    if (!tableError && tables && tables.length > 0) {
      return NextResponse.json(
        { status: 'ok', message: 'Reviews table already exists' },
        { status: 200 }
      )
    }

    // Table doesn't exist, try to create it
    console.log('[v0] Reviews table does not exist, attempting to create...')

    // Use RPC or raw SQL via exec function
    // First, try to create using direct table insert (won't work, but let's verify schema)
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        verified_purchase BOOLEAN DEFAULT FALSE,
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        admin_notes TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
      CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_name);

      ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

      CREATE POLICY IF NOT EXISTS allow_public_insert_reviews ON reviews
        FOR INSERT
        WITH CHECK (true);

      CREATE POLICY IF NOT EXISTS allow_public_read_approved_reviews ON reviews
        FOR SELECT
        USING (is_approved = true);

      CREATE POLICY IF NOT EXISTS allow_admin_full_access ON reviews
        FOR ALL
        USING (true)
        WITH CHECK (true);
    `

    // Try executing via rpc if available
    let execError = null
    try {
      const result = await supabase.rpc('exec', { 
        sql: createTableSQL 
      })
      execError = result.error
    } catch (e) {
      execError = { message: 'exec function not available' }
    }

    if (execError?.message.includes('exec')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Reviews table does not exist. Please run migrations manually in Supabase dashboard.',
          steps: [
            'Go to Supabase Dashboard > SQL Editor',
            'Create a new query',
            'Copy the SQL from migrations/003_create_reviews_table.sql',
            'Click Run'
          ]
        },
        { status: 500 }
      )
    }

    if (execError) {
      throw execError
    }

    return NextResponse.json(
      { status: 'ok', message: 'Reviews table created successfully' },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Database initialization error:', errorMessage)
    return NextResponse.json(
      {
        status: 'error',
        message: errorMessage,
        hint: 'Please run the database migration manually in your Supabase dashboard'
      },
      { status: 500 }
    )
  }
}
