import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Lazy-load Supabase client
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials are not configured')
  }

  return createClient(url, key)
}

// GET: Fetch approved testimonials
export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('[v0] Supabase error fetching testimonials:', error)
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      )
    }

    return NextResponse.json({ testimonials: data || [] })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    console.error('[v0] Error fetching testimonials:', errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// POST: Submit a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, title, quote, rating } = body

    // Validation
    if (!name || !email || !quote || !rating) {
      return NextResponse.json(
        { error: 'Name, email, testimonial, and rating are required' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (quote.trim().length < 10) {
      return NextResponse.json(
        { error: 'Testimonial must be at least 10 characters long' },
        { status: 400 }
      )
    }

    if (quote.trim().length > 500) {
      return NextResponse.json(
        { error: 'Testimonial must be less than 500 characters' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 255)
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedTitle = title ? title.trim().substring(0, 255) : null
    const sanitizedQuote = quote.trim()

    // Get Supabase client
    const supabase = getSupabaseClient()

    // Insert into Supabase
    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          name: sanitizedName,
          email: sanitizedEmail,
          title: sanitizedTitle,
          quote: sanitizedQuote,
          rating: parseInt(String(rating), 10),
          is_approved: false, // New testimonials require approval
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Supabase error inserting testimonial:', error)
      return NextResponse.json(
        { error: 'Failed to submit testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your testimonial! It will be reviewed and published shortly.',
        testimonial: data?.[0] || null,
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    console.error('[v0] Error submitting testimonial:', errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
