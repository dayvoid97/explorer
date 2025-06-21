'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/app/lib/auth'

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
  const token = getToken()

  useEffect(() => {
    if (!token) return

    const fetchInbox = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/inbox`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to load inbox')
        setInbox(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInbox()
  }, [token])

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (inbox.length === 0) return <p className="p-4 text-gray-500">No messages yet.</p>

  return (
    <div className="p-4 space-y-3">
      {inbox.map((chat) => (
        <div
          key={chat.connectionId}
          onClick={() => router.push(`/message?to=${chat.userName}`)}
          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition duration-150 
            ${chat.hasUnread ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}
          `}
        >
          <div className="flex items-center gap-3">
            <img
              src={chat.profilePictureUrl || '/default-avatar.png'}
              className="w-10 h-10 rounded-full object-cover border"
              alt={`@${chat.userName}`}
            />
            <div className="max-w-[70%]">
              <p
                className={`text-sm ${
                  chat.hasUnread ? 'font-bold text-indigo-600' : 'text-gray-800'
                }`}
              >
                @{chat.userName}
              </p>
              <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-400">{timeAgo(chat.lastTimestamp)}</span>
            {chat.hasUnread && (
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" title="New message" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
