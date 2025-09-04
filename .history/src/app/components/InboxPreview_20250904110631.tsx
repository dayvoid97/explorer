'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/app/lib/api'
import { removeTokens, isLoggedIn } from '@/app/lib/auth'

interface ChatSummary {
  connectionId: string
  userName: string
  profilePictureUrl: string | null
  lastMessage: string
  lastTimestamp: number
  hasUnread: boolean
}

const timeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const LoadingSkeleton = () => (
  <div className="p-4 space-y-3 animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

const ChatItem = ({ chat, onClick }: { chat: ChatSummary; onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors duration-150 
      ${
        chat.hasUnread
          ? 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      }
    `}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <img
        src={chat.profilePictureUrl || '/audio.png'}
        className="w-10 h-10 rounded-full object-cover border dark:border-gray-600 flex-shrink-0"
        alt={`@${chat.userName}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm truncate ${
            chat.hasUnread
              ? 'font-bold text-indigo-600 dark:text-indigo-400'
              : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          @{chat.userName}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
      </div>
    </div>

    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {timeAgo(chat.lastTimestamp)}
      </span>
      {chat.hasUnread && <div className="w-3 h-3 bg-red-500 rounded-full" title="New message" />}
    </div>
  </div>
)

export default function InboxPreview() {
  const [inbox, setInbox] = useState<ChatSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuthRedirect = useCallback(
    (errMessage = 'Session expired. Please log in again.') => {
      setError(errMessage)
      removeTokens()
      router.push('/login')
    },
    [router]
  )

  const fetchInbox = useCallback(async () => {
    if (!isLoggedIn()) {
      setError('You must be logged in to view messages.')
      setLoading(false)
      return
    }

    try {
      setError('') // Clear previous errors

      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/inbox`, {
        method: 'GET',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || data.error || `Failed to load inbox (Status: ${res.status})`
        )
      }

      setInbox(data)
    } catch (err: any) {
      console.error('Error loading inbox:', err)

      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || 'Failed to load messages.')
      }
    } finally {
      setLoading(false)
    }
  }, [handleAuthRedirect])

  useEffect(() => {
    fetchInbox()
  }, [fetchInbox])

  const handleChatClick = useCallback(
    (userName: string) => {
      router.push(`/message?to=${userName}`)
    },
    [router]
  )

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    )
  }

  if (inbox.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400 text-center">No messages yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages</h2>
        <div className="space-y-1">
          {inbox.map((chat) => (
            <ChatItem
              key={chat.connectionId}
              chat={chat}
              onClick={() => handleChatClick(chat.userName)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
