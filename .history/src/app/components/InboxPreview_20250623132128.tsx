'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '@/app/lib/auth' // isLoggedIn for initial check

interface ChatSummary {
  connectionId: string
  userName: string
  profilePictureUrl: string | null
  lastMessage: string
  lastTimestamp: number
  hasUnread: boolean
}

function timeAgo(timestamp: number) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function InboxPreview() {
  const [inbox, setInbox] = useState<ChatSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  // REMOVED: const token = getToken(); - authFetch handles this internally
  // Removed 'token' from state as it's not needed for internal component logic

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  useEffect(() => {
    const fetchInbox = async () => {
      // Check if user is logged in before attempting authenticated fetch
      if (!isLoggedIn()) {
        setError('You must be logged in to view messages.')
        setLoading(false)
        // No redirect here initially, as the component might be conditionally rendered for logged-out users.
        // The main redirect happens if authFetch actually fails.
        return
      }

      setLoading(true) // Ensure loading is true before fetch
      setError('') // Clear previous errors

      try {
        // CHANGED: Use authFetch for the authenticated call
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/inbox`, {
          method: 'GET',
        })

        const data = await res.json()
        if (!res.ok) {
          // This 'if' block handles non-401/403 errors (e.g., 500 server error)
          throw new Error(data.message || data.error || `Failed to load inbox (Status: ${res.status})`)
        }
        setInbox(data)
      } catch (err: any) {
        console.error('Error loading inbox:', err)
        // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
        if (err.message === 'Authentication required. Please log in again.' || err.message.includes('No authentication token')) {
            handleAuthRedirect(err.message)
        } else {
            setError(err.message || 'Failed to load messages.') // Set other non-auth related errors
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInbox()
  }, [router]) // Add router to dependency array if you use it in handleAuthRedirect

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow"> {/* Added dark mode bg/shadow */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" /> {/* Dark mode bg */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" /> {/* Dark mode bg */}
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" /> {/* Dark mode bg */}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) return <p className="p-4 text-red-500 dark:text-red-400">Error: {error}</p> 
  if (inbox.length === 0) return <p className="p-4 text-gray-500 dark:text-gray-400">No messages yet.</p> 

  return (
    <div className="p-4 space-y-3 bg-white dark:bg-gray-800 rounded-lg shadow"> {/* Added dark mode bg/shadow for container */}
      {inbox.map((chat) => (
        <div
          key={chat.connectionId}
          onClick={() => router.push(`/message?to=${chat.userName}`)}
          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition duration-150 
            ${chat.hasUnread 
                ? 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
          `}
        >
          <div className="flex items-center gap-3">
            <img
              src={chat.profilePictureUrl || '/audio.png'}
              className="w-10 h-10 rounded-full object-cover border dark:border-gray-600" {/* Dark mode border */}
              alt={`@${chat.userName}`}
            />
            <div className="max-w-[70%]">
              <p
                className={`text-sm ${
                  chat.hasUnread 
                    ? 'font-bold text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                @{chat.userName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p> {/* Dark mode text */}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(chat.lastTimestamp)}</span> {/* Dark mode text */}
            {chat.hasUnread && (
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" title="New message" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}