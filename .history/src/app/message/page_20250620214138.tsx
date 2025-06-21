'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'

interface MessageInitResponse {
  connectionId: string
  receiverId: string
  senderId: string
  userName: string
  profilePictureUrl: string
  lastMessage?: {
    text: string
    timestamp: string
  }
}

export default function MessagePage() {
  const searchParams = useSearchParams()
  const receiverUsername = searchParams.get('to') || ''
  const [chat, setChat] = useState<MessageInitResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token || !receiverUsername) return

    const fetchChat = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/user/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiverUsername }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to load chat')

        setChat(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [receiverUsername])

  if (loading) return <p className="p-6 text-gray-500">Loading chat...</p>
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!chat) return null

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {chat.profilePictureUrl && (
          <img src={chat.profilePictureUrl} className="w-10 h-10 rounded-full" alt="pfp" />
        )}
        <div>
          <p className="font-bold">@{chat.userName}</p>
          {chat.lastMessage && (
            <p className="text-sm text-gray-500">Last: {chat.lastMessage.text}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <textarea
          rows={4}
          className="w-full border p-4 rounded-xl"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          onClick={() => console.log('Send message to:', chat.connectionId)}
        >
          Send
        </button>
      </div>
    </div>
  )
}
