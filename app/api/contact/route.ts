import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Lazy-load Supabase client to avoid initialization errors during build
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials are not configured')
  }

  return createClient(url, key)
}

function isMissingTableError(error: { code?: string; message?: string }, tableName: string) {
  return (
    error.code === 'PGRST205' ||
    error.message?.includes(`relation "${tableName}" does not exist`) ||
    error.message?.includes(`table 'public.${tableName}'`)
  )
}

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Contact form POST request received')
    const body = await request.json()
    console.log('[v0] Form data received:', { name: body.name, email: body.email, phone: body.phone, messageLength: body.message?.length })
    
    const { name, email, phone, message } = body

    // Validation with detailed error codes
    if (!name || !name.trim()) {
      console.error('[v0] Validation failed: missing name')
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME', status: 400 },
        { status: 400 }
      )
    }

    if (!email || !email.trim()) {
      console.error('[v0] Validation failed: missing email')
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL', status: 400 },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      console.error('[v0] Validation failed: invalid email format')
      return NextResponse.json(
        { error: 'Please provide a valid email address', code: 'INVALID_EMAIL', status: 400 },
        { status: 400 }
      )
    }

    if (!message || !message.trim()) {
      console.error('[v0] Validation failed: missing message')
      return NextResponse.json(
        { error: 'Message is required', code: 'MISSING_MESSAGE', status: 400 },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      console.error('[v0] Validation failed: message too short')
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long', code: 'MESSAGE_TOO_SHORT', status: 400 },
        { status: 400 }
      )
    }

    // Get Supabase client
    let supabase
    try {
      supabase = getSupabaseClient()
      console.log('[v0] Supabase client initialized')
    } catch (clientError) {
      console.error('[v0] Failed to initialize Supabase client:', clientError)
      return NextResponse.json(
        { 
          error: 'Database connection failed. Check Supabase configuration.',
          code: 'DB_CONNECTION_FAILED',
          status: 503
        },
        { status: 503 }
      )
    }

    // Insert into Supabase
    console.log('[v0] Attempting to insert contact inquiry into database')
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone ? phone.trim() : null,
          message: message.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      const fullError = {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
      console.error('[v0] Supabase error inserting contact:', JSON.stringify(fullError, null, 2))
      
      let errorCode = 'DB_INSERT_FAILED'
      let statusCode = 500
      let errorMessage = 'Failed to submit form. Please try again.'

      if (isMissingTableError(error, 'contact_inquiries')) {
        errorMessage = 'Contact table not found. Database setup required. Contact system administrator.'
        errorCode = 'TABLE_NOT_FOUND'
        statusCode = 503
      } else if (error.message?.includes('permission denied')) {
        errorMessage = 'Permission denied. Check RLS policies. Contact system administrator.'
        errorCode = 'PERMISSION_DENIED'
        statusCode = 403
      } else if (error.message?.includes('duplicate')) {
        errorMessage = 'Duplicate submission. Please wait before submitting again.'
        errorCode = 'DUPLICATE_SUBMISSION'
        statusCode = 409
      } else if (error.message?.includes('connection') || error.message?.includes('ENOTFOUND') || error.message?.includes('timeout')) {
        errorMessage = 'Database connection failed. Please try again later.'
        errorCode = 'CONNECTION_FAILED'
        statusCode = 503
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          code: errorCode,
          status: statusCode,
          details: process.env.NODE_ENV === 'development' ? fullError : undefined
        },
        { status: statusCode }
      )
    }

    console.log('[v0] Contact inquiry inserted successfully:', data?.[0]?.id)

    // Send email notification
    try {
      await sendEmailNotification(name, email, phone, message)
    } catch (emailError) {
      console.error('[v0] Email error:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your inquiry has been submitted successfully. We will get back to you within 24 hours.',
        status: 200
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error('[v0] Unexpected API error:', error)
    return NextResponse.json(
      { 
        error: errorMessage || 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
      },
      { status: 500 }
    )
  }
}

async function sendEmailNotification(
  name: string,
  email: string,
  phone: string,
  message: string
) {
  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #123524;">New Inquiry from GIMORA Website</h2>
        <p style="margin: 10px 0;"><strong>Customer Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 10px 0;"><strong>Customer Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin: 10px 0;"><strong>Phone Number:</strong> ${escapeHtml(phone || 'Not provided')}</p>
        <p style="margin: 10px 0;"><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="margin: 10px 0;"><strong>Message:</strong></p>
        <p style="margin: 10px 0; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${escapeHtml(message).replace(/\n/g, '<br>')}
        </p>
      </body>
    </html>
  `

  // Send email using Resend API (or your preferred email service)
  // For now, we'll log it - implement your email service here
  console.log('Email notification would be sent to business owner:', {
    to: process.env.BUSINESS_EMAIL || 'contactgimora@gmail.com',
    subject: 'New Inquiry from GIMORA Website',
    html: emailContent,
  })

  // If you have an email service configured, uncomment and use it:
  /*
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'noreply@gimora.com',
      to: process.env.BUSINESS_EMAIL || 'contactgimora@gmail.com',
      subject: 'New Inquiry from GIMORA Website',
      html: emailContent,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send email')
  }
  */
}

function escapeHtml(text: string): string {
  const htmlEscapeMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char])
}
