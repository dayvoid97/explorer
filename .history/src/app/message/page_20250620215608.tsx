'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'
import { useGurkhaWebSocket } from '../hooks/useGurkhaSocket'

interface Message {
  id?: string
  text: string
  timestamp: string
  senderId: string
  delivered?: boolean
}

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
  const [messages, setMessages] = useState<Message[]>([])

  const token = getToken()

  // Fetch chat connection
  useEffect(() => {
    if (!token || !receiverUsername) return

    const fetchChat = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages`, {
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
        // Optionally set the last message
        if (data.lastMessage) {
          setMessages([{ ...data.lastMessage, senderId: data.receiverId }])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [receiverUsername, token])

  // Setup socket hook once chat is ready
  const { sendMessage, sendDeliveryReceipt } = useGurkhaWebSocket(
    chat?.connectionId || '',
    chat?.senderId || '',
    (data) => {
      if (data.data) {
        setMessages((prev) => [...prev, data.data])
        // Optionally mark as delivered
        sendDeliveryReceipt(data.messageId)
      }
    },
    (receipt) => {
      // Optional: Update delivery status on frontend
      setMessages((prev) =>
        prev.map((msg) => (msg.id === receipt.messageId ? { ...msg, delivered: true } : msg))
      )
    }
  )

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim())
      setMessage('')
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading chat...</p>
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!chat) return null

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen">
      {/* Chat Header */}
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

      {/* Messages */}
      <div className="flex flex-col gap-2 mb-6 max-h-[60vh] overflow-y-auto pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[70%] ${
              msg.senderId === chat.senderId ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className="text-xs text-right text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {msg.delivered ? ' ✓' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Text Area */}
      <div className="mt-auto">
        <textarea
          rows={2}
          className="w-full border p-4 rounded-xl"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          onClick={handleSend}
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}
