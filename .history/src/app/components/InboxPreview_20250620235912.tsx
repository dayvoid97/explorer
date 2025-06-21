'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/app/lib/auth'

interface ChatSummary {
  connectionId: string
  userName: string // ⬅️ receiverUsername renamed as returned by backend
  profilePictureUrl: string | null
  lastMessage: string
  lastTimestamp: number
  hasUnread: boolean
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

  if (loading) return <p className="p-4">Loading inbox...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (inbox.length === 0) return <p className="p-4 text-gray-500">No messages yet.</p>

  return (
    <div className="p-4 space-y-4">
      {inbox.map((chat) => (
        <div
          key={chat.connectionId}
          className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/message?to=${chat.userName}`)}
        >
          <div className="flex items-center gap-3">
            <img
              src={chat.profilePictureUrl || '/audio.png'}
              className="w-10 h-10 rounded-full"
              alt="pfp"
            />
            <div>
              <p className={`font-medium ${chat.hasUnread ? 'font-bold' : ''}`}>@{chat.userName}</p>
              <p className="text-sm text-gray-500 truncate max-w-xs">{chat.lastMessage}</p>
            </div>
          </div>

          {chat.hasUnread && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="New message" />
          )}
        </div>
      ))}
    </div>
  )
}
