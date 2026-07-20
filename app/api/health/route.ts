import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment_variables: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : 'MISSING',
    },
    supabase_connection: {
      status: 'testing...',
      error: null as string | null,
      tables: [] as string[],
    },
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      checks.supabase_connection.status = 'FAILED'
      checks.supabase_connection.error = 'Missing environment variables'
      return NextResponse.json(checks, { status: 500 })
    }

    console.log('[v0] Health check: Initializing Supabase client with URL:', url)
    
    const supabase = createClient(url, key)

    console.log('[v0] Health check: Supabase client created, querying information_schema...')

    // Query information schema to check connection and list tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      console.error('[v0] Health check: Error querying tables:', tablesError)
      checks.supabase_connection.status = 'PARTIAL'
      checks.supabase_connection.error = `Tables query failed: ${tablesError.message}`
      
      // Try a simpler query to test connection
      const { error: simpleError } = await supabase.from('reviews').select('count')
      if (simpleError) {
        console.error('[v0] Health check: Reviews table query failed:', simpleError)
        if (simpleError.message?.includes('relation "reviews" does not exist')) {
          checks.supabase_connection.error += ' - reviews table does not exist'
        }
      }
    } else {
      console.log('[v0] Health check: Tables found:', tables?.map((t: any) => t.table_name))
      checks.supabase_connection.status = 'CONNECTED'
      checks.supabase_connection.tables = tables?.map((t: any) => t.table_name) || []
    }

    // Check specific tables
    const requiredTables = ['reviews', 'contact_inquiries']
    const missingTables = []

    for (const table of requiredTables) {
      const { data, error } = await supabase.from(table).select('count', { count: 'exact' })
      if (error) {
        console.warn(`[v0] Health check: Table ${table} check failed:`, error.message)
        missingTables.push(table)
      } else {
        console.log(`[v0] Health check: Table ${table} exists`)
      }
    }

    if (missingTables.length > 0) {
      checks.supabase_connection.error = `Missing tables: ${missingTables.join(', ')}`
    }

    return NextResponse.json(checks, { status: checks.supabase_connection.status === 'CONNECTED' ? 200 : 206 })
  } catch (error) {
    console.error('[v0] Health check: Unexpected error:', error)
    checks.supabase_connection.status = 'ERROR'
    checks.supabase_connection.error = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(checks, { status: 500 })
  }
}
