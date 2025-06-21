'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'

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
  lastMessage?: Message
}

export default function MessagePage() {
  const searchParams = useSearchParams()
  const receiverUsername = searchParams.get('to') || ''

  const [chat, setChat] = useState<MessageInitResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const bottomRef = useRef<HTMLDivElement>(null)
  const token = getToken()

  useEffect(() => {
    if (!token || !receiverUsername) return

    const initChat = async () => {
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
        if (!res.ok) throw new Error(data.message || 'Failed to initiate chat')

        setChat(data)

        // Use lastMessage as initial payload
        if (data.lastMessage) {
          setMessages([data.lastMessage])
        } else {
          setMessages([])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initChat()
  }, [receiverUsername, token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || !chat || !token) return

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      text: trimmed,
      timestamp: new Date().toISOString(),
      senderId: chat.senderId,
      delivered: false,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          connectionId: chat.connectionId,
          text: trimmed,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to send message')
      }

      const result = await res.json()
      console.log('Message sent:', result)
    } catch (err: any) {
      console.error('Send error:', err.message)
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading chat...</p>
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!chat) return <p className="p-6 text-red-500">Chat not initialized</p>

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-4 mb-4">
        {chat.profilePictureUrl && (
          <img src={chat.profilePictureUrl} className="w-10 h-10 rounded-full" alt="pfp" />
        )}
        <div>
          <p className="font-bold text-lg">@{chat.userName}</p>
        </div>
        <div className="ml-auto text-xs text-gray-500">💬 HTTP Chat</div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col gap-2 mb-4 max-h-[60vh] overflow-y-auto pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id || Math.random()}
            className={`p-3 rounded-xl max-w-[70%] text-sm shadow-sm ${
              msg.senderId === chat.senderId
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-100 self-start'
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-auto">
        <textarea
          rows={2}
          className="w-full border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl disabled:opacity-40"
          onClick={handleSend}
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}
