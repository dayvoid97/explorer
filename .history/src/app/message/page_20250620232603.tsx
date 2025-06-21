'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  delivered: boolean
}

interface ChatData {
  connectionId: string
  senderId: string
  receiverId: string
  userName: string
  profilePictureUrl?: string
  messages: Message[]
}

export default function MessagePage() {
  const [chat, setChat] = useState<ChatData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const to = searchParams.get('to')
  const token = getToken()

  useEffect(() => {
    if (!token || !to) return

    const loadConversation = async () => {
      try {
        // Step 1: Try GET
        const getRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages?to=${to}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (getRes.status === 200) {
          const data = await getRes.json()
          setChat(data)
        } else if (getRes.status === 204) {
          // Step 2: Fallback to POST if no chat found
          const postRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ receiverUsername: to }),
            }
          )

          if (!postRes.ok) throw new Error('Chat creation failed')
          const data = await postRes.json()
          setChat(data)
        } else {
          const errData = await getRes.json()
          throw new Error(errData.message || 'Failed to load chat')
        }
      } catch (err: any) {
        console.error('[ChatLoad] Error:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadConversation()
  }, [token, to])

  if (loading) return <div className="p-4">Loading messages...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!chat) return <div className="p-4 text-gray-500">No chat loaded</div>

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={chat.profilePictureUrl || '/defaultpfp.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold">@{chat.userName}</h2>
      </div>

      <div className="space-y-3">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm ${
              msg.senderId === chat.senderId ? 'bg-blue-100 self-end' : 'bg-gray-100'
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
