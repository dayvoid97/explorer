'use client'

import React, { useState } from 'react'
import { Button } from './ui/Button' // Assuming Button component handles its own dark/light mode
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '@/app/lib/auth' // isLoggedIn for initial check
import { useRouter } from 'next/navigation' // Import useRouter for redirection

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  reportedUsername: string
  onClose: () => void
}

export default function ReportUserModal({ reportedUsername, onClose }: Props) {
  const router = useRouter() // Initialize useRouter
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null) // State for API errors

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setApiError(errMessage) // Display error in modal
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setApiError(null) // Clear previous errors
    setSubmitted(false) // Reset submitted status

    // Check if user is logged in before attempting authenticated fetch
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to report a user.')
      setSubmitting(false) // Stop submitting state
      return
    }

    try {
      // CHANGED: Use authFetch for the authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/users/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify({ reportedUsername, reason, details }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const errData = await res.json()
        throw new Error(errData.message || errData.error || 'Something went wrong with the report.')
      }
    } catch (err: any) {
      console.error('Failed to submit report:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to submit report.') // Set other non-auth related errors
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {' '}
      {/* Added padding for small screens */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl text-gray-900 dark:text-white">
        {' '}
        {/* Dark mode bg/text */}
        <h2 className="text-lg font-semibold mb-4">Report @{reportedUsername}</h2>
        {submitted ? (
          <div className="text-green-600 dark:text-green-400 text-center py-4">
            ✅ Thank you for your report.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              // Dark mode styles for select
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Reason</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Copyright infringement">Copyright infringement</option>
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Other">Other (Please specify in details)</option>{' '}
              {/* Added "Other" option */}
            </select>

            <textarea
              placeholder="Additional details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              // Dark mode styles for textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />

            {apiError && ( // Display API errors here
              <p className="text-red-600 dark:text-red-400 text-sm">{apiError}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !reason}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
