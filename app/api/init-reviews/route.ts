import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials are not configured')
  }

  return createClient(url, key)
}

const REVIEWS_TABLE_SCHEMA = `
-- Create reviews table with comprehensive fields
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_name);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can insert reviews
CREATE POLICY IF NOT EXISTS "allow_public_insert_reviews" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Public can only see approved reviews
CREATE POLICY IF NOT EXISTS "allow_public_read_approved_reviews" ON reviews
  FOR SELECT
  USING (is_approved = true);

-- Admin can see all reviews (service role always has access)
CREATE POLICY IF NOT EXISTS "allow_admin_read_all_reviews" ON reviews
  FOR SELECT
  USING (true);

-- Admin can update reviews (service role always has access)
CREATE POLICY IF NOT EXISTS "allow_admin_update_reviews" ON reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
`;

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] POST /api/init-reviews - Initializing reviews table')

    const supabase = getSupabaseAdminClient()

    // Execute the schema creation SQL
    console.log('[v0] Executing reviews table creation schema')
    let schemaError = null
    try {
      await supabase.rpc('exec_sql', {
        sql: REVIEWS_TABLE_SCHEMA,
      })
    } catch (err: any) {
      schemaError = err
    }

    if (schemaError) {
      console.warn('[v0] RPC method not available, attempting direct SQL execution')
      // Alternative: Try using the raw SQL execution through the REST API
      // This requires the schema to be created manually or through Supabase dashboard
      return NextResponse.json(
        {
          error: 'Automatic schema creation requires manual setup',
          code: 'MANUAL_SETUP_REQUIRED',
          message: 'Please copy and execute the SQL schema from REVIEWS_SYSTEM_SETUP.md in your Supabase SQL Editor',
          schema: REVIEWS_TABLE_SCHEMA
        },
        { status: 400 }
      )
    }

    console.log('[v0] Reviews table created successfully')

    // Verify the table was created
    const { data: tables, error: verifyError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1)

    if (verifyError && !verifyError.message?.includes('no rows')) {
      console.error('[v0] Error verifying table creation:', verifyError)
      return NextResponse.json(
        {
          error: 'Table creation verification failed',
          code: 'VERIFICATION_FAILED',
          details: verifyError.message
        },
        { status: 500 }
      )
    }

    console.log('[v0] Reviews table verified and ready')
    return NextResponse.json(
      {
        success: true,
        message: 'Reviews table created and configured successfully',
        code: 'TABLE_CREATED'
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    console.error('[v0] Error initializing reviews table:', error)
    return NextResponse.json(
      {
        error: errorMessage || 'Failed to initialize reviews table',
        code: 'INIT_FAILED',
        message: 'Please manually create the table using the SQL schema in REVIEWS_SYSTEM_SETUP.md'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'POST to this endpoint to initialize the reviews table',
      schema: REVIEWS_TABLE_SCHEMA,
      code: 'USE_POST'
    },
    { status: 200 }
  )
}
