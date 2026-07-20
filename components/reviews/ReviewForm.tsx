'use client'

import { Star, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface FormState {
  customerName: string
  customerEmail: string
  productName: string
  rating: number
  reviewText: string
}

interface SubmitState {
  isLoading: boolean
  success: boolean
  error: string | null
}

export default function ReviewForm() {
  const [formData, setFormData] = useState<FormState>({
    customerName: '',
    customerEmail: '',
    productName: 'Pure Ceylon Black Tea',
    rating: 5,
    reviewText: '',
  })
  const [submitState, setSubmitState] = useState<SubmitState>({
    isLoading: false,
    success: false,
    error: null,
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({})
  const [charCount, setCharCount] = useState(0)

  const validateForm = (): boolean => {
    const errors: Partial<FormState> = {}

    if (!formData.customerName.trim()) {
      errors.customerName = 'Name is required'
    } else if (formData.customerName.trim().length < 2) {
      errors.customerName = 'Name must be at least 2 characters'
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email'
    }

    if (!formData.productName) {
      errors.productName = 'Product is required'
    }

    if (!formData.reviewText.trim()) {
      errors.reviewText = 'Review text is required'
    } else if (formData.reviewText.trim().length < 20) {
      errors.reviewText = 'Review must be at least 20 characters'
    } else if (formData.reviewText.trim().length > 1000) {
      errors.reviewText = 'Review must be less than 1000 characters'
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

    if (name === 'reviewText') {
      setCharCount(value.length)
    }

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
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        product_name: formData.productName,
        rating: formData.rating,
        review_text: formData.reviewText,
      }

      console.log('[v0] Submitting review with payload:', payload)

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('[v0] Review API response status:', response.status)

      const data = await response.json()
      console.log('[v0] Review API response data:', data)

      if (!response.ok) {
        const errorMessage = data.error || `Request failed with status ${response.status}`
        console.warn('[v0] Review submit failed:', {
          status: response.status,
          error: errorMessage,
          fullResponse: data,
        })
        setSubmitState({ isLoading: false, success: false, error: errorMessage })
        return
      }

      console.log('[v0] Review submitted successfully:', data)
      window.dispatchEvent(new Event('reviews:updated'))
      setSubmitState({ isLoading: false, success: true, error: null })
      setFormData({
        customerName: '',
        customerEmail: '',
        productName: 'Pure Ceylon Black Tea',
        rating: 5,
        reviewText: '',
      })
      setCharCount(0)

      setTimeout(() => {
        setSubmitState({ isLoading: false, success: false, error: null })
      }, 5000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      console.warn('[v0] Review submit failed:', error)
      setSubmitState({ isLoading: false, success: false, error: errorMessage })
    }
  }

  return (
    <div>
      {/* Status Messages */}
      {submitState.success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-semibold">Review Submitted Successfully!</p>
            <p className="text-green-700 text-sm">Your review is now visible on the site.</p>
          </div>
        </div>
      )}

      {submitState.error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-semibold">Error Submitting Review</p>
            <p className="text-red-700 text-sm">{submitState.error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-semibold text-primary mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 ${
              fieldErrors.customerName
                ? 'border-red-500 focus:outline-none focus:border-red-600'
                : 'border-transparent focus:outline-none focus:border-accent'
            }`}
          />
          {fieldErrors.customerName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.customerName}</p>
          )}
        </div>

        {/* Customer Email */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-semibold text-primary mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 ${
              fieldErrors.customerEmail
                ? 'border-red-500 focus:outline-none focus:border-red-600'
                : 'border-transparent focus:outline-none focus:border-accent'
            }`}
          />
          {fieldErrors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.customerEmail}</p>
          )}
        </div>

        {/* Product Selection */}
        <div>
          <label htmlFor="productName" className="block text-sm font-semibold text-primary mb-2">
            Product Reviewed
          </label>
          <select
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors ${
              fieldErrors.productName
                ? 'border-red-500 focus:outline-none focus:border-red-600'
                : 'border-transparent focus:outline-none focus:border-accent'
            }`}
          >
            <option value="Pure Ceylon Black Tea">Pure Ceylon Black Tea</option>
            <option value="Black Pepper">Black Pepper</option>
            <option value="Ceylon Cinnamon">Ceylon Cinnamon</option>
            <option value="Cloves">Cloves</option>
            <option value="Other">Other</option>
          </select>
          {fieldErrors.productName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.productName}</p>
          )}
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-3">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= formData.rating
                      ? 'fill-accent text-accent'
                      : 'text-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-foreground/60">
            {formData.rating} out of 5 stars
          </p>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-semibold text-primary mb-2">
            Your Review
          </label>
          <textarea
            id="reviewText"
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            placeholder="Share your experience with GIMORA products. Be specific about what you liked and how it has benefited you..."
            rows={6}
            maxLength={1000}
            className={`w-full px-4 py-3 bg-secondary rounded-lg border-2 transition-colors placeholder-foreground/40 resize-none ${
              fieldErrors.reviewText
                ? 'border-red-500 focus:outline-none focus:border-red-600'
                : 'border-transparent focus:outline-none focus:border-accent'
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            {fieldErrors.reviewText ? (
              <p className="text-sm text-red-600">{fieldErrors.reviewText}</p>
            ) : (
              <p className="text-sm text-foreground/60">
                Minimum 20 characters required
              </p>
            )}
            <p className="text-sm text-foreground/60">
              {charCount}/1000
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitState.isLoading}
          className="w-full px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitState.isLoading ? 'Submitting Review...' : 'Submit Review'}
        </button>
      </form>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold">Note:</span> Your review will be published immediately after submission.
        </p>
      </div>
    </div>
  )
}
