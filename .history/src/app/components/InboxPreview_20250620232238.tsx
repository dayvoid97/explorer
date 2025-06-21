'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/app/lib/auth'

interface ChatSummary {
  connectionId: string
  receiverUsername: string
  receiverProfileUrl: string
  lastMessage: {
    text: string
    timestamp: string
  }
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
          className="flex items-center gap-4 cursor-pointer p-3 rounded-lg border hover:bg-gray-50"
          onClick={() => router.push(`/message?to=${chat.receiverUsername}`)}
        >
          <img
            src={chat.receiverProfileUrl || '/default-pfp.png'}
            alt="pfp"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex-1">
            <p className="font-semibold">@{chat.receiverUsername}</p>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage.text}</p>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
