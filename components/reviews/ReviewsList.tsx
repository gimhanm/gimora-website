'use client'

import { Star, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Review {
  id: number
  customer_name: string
  rating: number
  review_text: string
  created_at: string
  verified_purchase: boolean
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  reviewCounts: { [key: number]: number }
}

const REVIEWS_PER_PAGE = 6

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    reviewCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        console.log('[v0] Fetching reviews from /api/reviews')
        const response = await fetch('/api/reviews')
        console.log('[v0] Fetch reviews response status:', response.status)
        
        const data = await response.json()
        console.log('[v0] Fetch reviews response data:', data)

        if (response.ok && data.reviews) {
          console.log('[v0] Reviews fetched successfully:', data.reviews.length, 'reviews')
          setReviews(data.reviews)
          setStats(data.stats)
          setError(null)
        } else if (!response.ok) {
          const errorMsg = data.error || `Failed to fetch reviews (status: ${response.status})`
          console.warn('[v0] Error fetching reviews:', errorMsg)
          setError(errorMsg)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'An error occurred while fetching reviews'
        console.warn('[v0] Error fetching reviews:', error)
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
    const handleReviewsUpdated = () => {
      setCurrentPage(1)
      fetchReviews()
    }

    window.addEventListener('reviews:updated', handleReviewsUpdated)
    return () => window.removeEventListener('reviews:updated', handleReviewsUpdated)
  }, [])

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
  const paginatedReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const RatingBar = ({ rating, count }: { rating: number; count: number }) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground/70 w-8">{rating}</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < rating ? 'fill-accent text-accent' : 'text-foreground/20'
              }`}
            />
          ))}
        </div>
        <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-foreground/60 w-10 text-right">{count}</span>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Average Rating & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Average Rating Card */}
        <div className="bg-white p-8 rounded-lg premium-border text-center">
          <p className="text-foreground/70 text-sm font-medium mb-2">Average Rating</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl font-bold text-accent">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.round(stats.averageRating)
                      ? 'fill-accent text-accent'
                      : 'text-foreground/20'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-foreground/60 text-sm">
            Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 bg-white p-8 rounded-lg premium-border">
          <p className="font-semibold text-primary mb-4">Rating Breakdown</p>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={stats.reviewCounts[rating as keyof typeof stats.reviewCounts] || 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground/70">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200 premium-border">
          <p className="text-red-800 font-semibold mb-2">Unable to load reviews</p>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          {error.includes('table does not exist') || error.includes('TABLE_NOT_FOUND') ? (
            <div className="text-left bg-white p-4 rounded border border-red-300 mb-4 max-w-lg mx-auto">
              <p className="text-red-800 text-sm font-semibold mb-2">⚠️ Database Setup Required</p>
              <p className="text-red-700 text-xs mb-3">The reviews table has not been created. Follow these steps:</p>
              <ol className="text-red-700 text-xs space-y-1 list-decimal list-inside">
                <li>Open your Supabase dashboard</li>
                <li>Go to SQL Editor</li>
                <li>Create a new query</li>
                <li>Copy the SQL from REVIEWS_SYSTEM_SETUP.md</li>
                <li>Execute the query</li>
                <li>Refresh this page</li>
              </ol>
              <p className="text-red-600 text-xs mt-3">
                Or automatically initialize by calling: <code className="bg-red-100 px-2 py-1 rounded">/api/init-reviews</code>
              </p>
            </div>
          ) : null}
          <p className="text-red-600 text-xs mt-4">Check browser console for detailed error logs with [v0] prefix</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg premium-border">
          <p className="text-foreground/70">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-lg premium-border hover:shadow-md transition-shadow"
              >
                {/* Review Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-3 md:mb-0">
                    <div>
                      <p className="font-semibold text-primary">{review.customer_name}</p>
                      <p className="text-sm text-foreground/60">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    {review.verified_purchase && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < review.rating ? 'fill-accent text-accent' : 'text-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                  {review.review_text}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  const isActive = page === currentPage
                  const isVisible =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1

                  if (!isVisible) {
                    return null
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-accent text-white'
                          : 'border border-border hover:border-accent'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
