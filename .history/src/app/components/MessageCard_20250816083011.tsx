'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// UPDATED IMPORT: Use authFetch for API calls
import { authFetch } from '@/app/lib/api' // Make sure this path is correct relative to this file
import { removeTokens } from '@/app/lib/auth' // Add removeTokens for handling auth errors

export default function MessagesCard() {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    // You might want to display an error state in this component if it fits the UI
    console.error('Auth error in MessagesCard:', errMessage)
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  useEffect(() => {
    const fetchUnread = async () => {
      // REMOVED: const token = getToken(); and if (!token) return;
      // authFetch will handle checking for token existence and adding it.

      try {
        // CHANGED: Use authFetch for the authenticated call
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/inbox`)

        const data = await res.json()

        if (!res.ok) {
          // Handle specific non-auth related API errors if any
          throw new Error(
            data.message || data.error || `Failed to fetch inbox (Status: ${res.status})`
          )
        }

        const unread = data.filter((d: any) => d.isUnread).length
        setUnreadCount(unread)
      } catch (err: any) {
        console.error('Error fetching unread messages:', err)
        // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        }
        // No specific error state displayed on the card, just logs out
      }
    }

    // Call fetchUnread immediately and set up an interval for periodic checks
    fetchUnread() // Initial fetch
    const intervalId = setInterval(fetchUnread, 60000) // Fetch every minute (adjust as needed)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [router]) // Add router to dependency array

  return (
    <div
      onClick={() => router.push('/inbox')}
      // Consider adding dark mode classes here if not handled globally for this card's background/border
      className="relative cursor-pointer p-4 border dark:border-gray-700 rounded-lg shadow hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">💬</span>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Messages</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">See who messaged you</p>
        </div>
        {unreadCount > 0 && (
          <span className="ml-2 text-white bg-red-500 rounded-full px-2 py-0.5 text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  )
}
