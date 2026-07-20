'use client'

import { Star, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface FormState {
  name: string
  email: string
  title: string
  quote: string
  rating: number
}

interface SubmitState {
  isLoading: boolean
  success: boolean
  error: string | null
}

export default function TestimonialForm() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    title: '',
    quote: '',
    rating: 5,
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

    if (!formData.quote.trim()) {
      errors.quote = 'Testimonial is required'
    } else if (formData.quote.trim().length < 10) {
      errors.quote = 'Testimonial must be at least 10 characters'
    } else if (formData.quote.trim().length > 500) {
      errors.quote = 'Testimonial must be less than 500 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }))
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
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit testimonial')
      }

      setSubmitState({ isLoading: false, success: true, error: null })
      setFormData({ name: '', email: '', title: '', quote: '', rating: 5 })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitState({ isLoading: false, success: false, error: null })
      }, 5000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSubmitState({ isLoading: false, success: false, error: errorMessage })
    }
  }

  return (
    <div className="bg-white rounded-lg premium-border p-8">
      <h3 className="text-2xl font-heading font-bold text-primary mb-2">
        Share Your Experience
      </h3>
      <p className="text-foreground/70 mb-6">
        Your feedback helps us improve and lets others know about GIMORA quality.
      </p>

      {/* Status Messages */}
      {submitState.success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-semibold">Thank You!</p>
            <p className="text-green-700 text-sm">Your testimonial will be reviewed and published shortly.</p>
          </div>
        </div>
      )}

      {submitState.error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm">{submitState.error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 ${
                fieldErrors.name
                  ? 'border-red-500 focus:outline-none focus:border-red-600'
                  : 'border-transparent focus:outline-none focus:border-accent'
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 ${
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

        {/* Title (Optional) */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Title (Optional)</label>
          <input
            type="text"
            name="title"
            placeholder="Your title or business"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-secondary rounded-lg border-2 border-transparent focus:outline-none focus:border-accent transition-colors placeholder-foreground/40"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Rating *</label>
          <div className="flex items-center gap-2">
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="px-4 py-2 bg-secondary rounded-lg border-2 border-transparent focus:outline-none focus:border-accent transition-colors"
            >
              <option value="5">5 Stars - Excellent</option>
              <option value="4">4 Stars - Very Good</option>
              <option value="3">3 Stars - Good</option>
              <option value="2">2 Stars - Fair</option>
              <option value="1">1 Star - Poor</option>
            </select>
            <div className="flex gap-1">
              {[...Array(formData.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-accent text-accent"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Your Testimonial *</label>
          <textarea
            name="quote"
            placeholder="Share your experience with GIMORA products... (10-500 characters)"
            rows={4}
            value={formData.quote}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 resize-none ${
              fieldErrors.quote
                ? 'border-red-500 focus:outline-none focus:border-red-600'
                : 'border-transparent focus:outline-none focus:border-accent'
            }`}
          />
          <div className="mt-1 flex justify-between items-center">
            {fieldErrors.quote && (
              <p className="text-sm text-red-600">{fieldErrors.quote}</p>
            )}
            <p className="text-xs text-foreground/50 ml-auto">
              {formData.quote.length}/500
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitState.isLoading}
          className="w-full px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitState.isLoading ? 'Submitting...' : 'Submit Testimonial'}
        </button>

        <p className="text-xs text-foreground/50 text-center">
          Your testimonial will be reviewed before publishing.
        </p>
      </form>
    </div>
  )
}
