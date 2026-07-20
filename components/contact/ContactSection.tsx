'use client'

import { MessageCircle, Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

interface SubmitState {
  isLoading: boolean
  success: boolean
  error: string | null
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitState, setSubmitState] = useState<SubmitState>({
    isLoading: false,
    success: false,
    error: null,
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({})

  const validateForm = (): boolean => {
    const errors: Partial<FormState> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FormState]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitState({ isLoading: true, success: false, error: null })

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      }

      console.log('[v0] Submitting contact form with payload:', {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        messageLength: payload.message.length,
      })

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('[v0] Contact form API response status:', response.status)

      const data = await response.json()
      console.log('[v0] Contact form API response:', data)

      if (!response.ok) {
        const errorMessage = data.error || `Request failed with status ${response.status}`
        console.error('[v0] Contact form submission failed:', {
          status: response.status,
          error: errorMessage,
          code: data.code,
        })
        throw new Error(errorMessage)
      }

      console.log('[v0] Contact form submitted successfully')
      setSubmitState({ isLoading: false, success: true, error: null })
      setFormData({ name: '', email: '', phone: '', message: '' })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitState({ isLoading: false, success: false, error: null })
      }, 5000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      console.error('[v0] Contact form error:', errorMessage)
      setSubmitState({ isLoading: false, success: false, error: errorMessage })
    }
  }

  const whatsappMessage = encodeURIComponent(
    'Hi GIMORA, I would like to inquire about your products and services.'
  )

  return (
    <section id="contact" className="section-spacing bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Get in Touch
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1 w-12 bg-accent" />
            <div className="h-1 w-12 bg-accent/50" />
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Have questions about our products? Let&apos;s start a conversation. We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Mail size={24} className="text-accent mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Email</h3>
                <a
                  href="mailto:contactgimora@gmail.com"
                  className="text-foreground/70 hover:text-accent transition-colors"
                >
                  contactgimora@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Phone size={24} className="text-accent mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Phone</h3>
                <a
                  href="tel:+94784230450"
                  className="text-foreground/70 hover:text-accent transition-colors"
                >
                  +94 784230450
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <MapPin size={24} className="text-accent mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Location</h3>
                <p className="text-foreground/70">
                  Colombo, Sri Lanka<br />
                  Premium Export Quality
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-4">
              <a
                href={`https://wa.me/94784230450?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* Status Messages */}
            {submitState.success && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-semibold">Message Sent Successfully!</p>
                  <p className="text-green-700 text-sm">We&apos;ll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            {submitState.error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-semibold">Error Submitting Form</p>
                  <p className="text-red-700 text-sm">{submitState.error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 ${
                      fieldErrors.name
                        ? 'border-red-500 focus:outline-none focus:border-red-600'
                        : 'border-transparent focus:outline-none focus:border-accent'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 ${
                      fieldErrors.email
                        ? 'border-red-500 focus:outline-none focus:border-red-600'
                        : 'border-transparent focus:outline-none focus:border-accent'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-secondary rounded-lg border-2 border-transparent focus:outline-none focus:border-accent transition-colors placeholder-foreground/40"
              />

              <div>
                <textarea
                  name="message"
                  placeholder="Tell us about your inquiry..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 resize-none ${
                    fieldErrors.message
                      ? 'border-red-500 focus:outline-none focus:border-red-600'
                      : 'border-transparent focus:outline-none focus:border-accent'
                  }`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitState.isLoading}
                className="w-full px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitState.isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Response Time */}
        <div className="text-center p-6 bg-secondary/50 rounded-lg">
          <p className="text-foreground/70">
            We typically respond to inquiries within <span className="font-semibold text-primary">24 hours</span>
          </p>
        </div>
      </div>
    </section>
  )
}
