// /app/winners/date/[id]/page.tsx
'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import WinnersNavbar from '@/app/components/WinnersNavBar'
import WinsByDateGrid from '@/app/components/WinByDateGrid'

/**
 * Formats a date string for display
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString || typeof dateString !== 'string') return 'Invalid Date'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Page component for displaying wins filtered by a specific date
 * Route: /winners/date/[id] where id is the date string
 */
export default function WinnersDatePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const formattedDate = formatDate(id)
  const isValidDate = formattedDate !== 'Invalid Date'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/winners')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Back to Winners"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Winners</span>
            </button>
            <div className="text-center">
              <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-1">
                Only Ws in the Chat 🏆
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {isValidDate ? `Wins from ${formattedDate}` : 'Invalid Date'}
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          <WinnersNavbar />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {isValidDate ? (
          <WinsByDateGrid date={id} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Date</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The date provided is not valid. Please check the URL and try again.
            </p>
            <button
              onClick={() => router.push('/winners')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Winners
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
