'use client'

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { getToken } from '@/app/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  reportedUsername: string
  onClose: () => void
}

export default function ReportUserModal({ reportedUsername, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/gurkha/users/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportedUsername, reason, details }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const err = await res.json()
        alert(err.error || 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-black p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Report @{reportedUsername}</h2>

        {submitted ? (
          <div className="text-green-600 dark:text-green-400">✅ Thank you for your report.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-md px-3 py-2 dark:bg-neutral-900"
            >
              <option value="">Select Reason</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Copyright infringement">Copyright infringement</option>
              <option value="Inappropriate content">Inappropriate content</option>
            </select>

            <textarea
              placeholder="Additional details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full border rounded-md px-3 py-2 dark:bg-neutral-900"
            />

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
