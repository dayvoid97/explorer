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
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const searchParams = useSearchParams()
  const to = searchParams.get('to')
  const token = getToken()

  // ✅ Fetch chat on load
  useEffect(() => {
    if (!to || !token) return

    const fetchChat = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages?to=${to}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to fetch chat')

        setChat(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [to, token])

  // ✅ Mark messages as read
  useEffect(() => {
    if (!chat || !chat.connectionId || !token || chat.messages.length === 0) return

    const markAsRead = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages/markAsRead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ connectionId: chat.connectionId }),
        })
      } catch (err: any) {
        console.error('[markAsRead] Error:', err.message)
      }
    }

    markAsRead()
  }, [chat, token])

  // ✅ Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return
    setSending(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          connectionId: chat.connectionId,
          text: newMessage.trim(),
        }),
      })

      if (!res.ok) throw new Error('Failed to send message')
      const sent = await res.json()

      setChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: sent.id || `temp-${Date.now()}`,
                  senderId: chat.senderId,
                  text: newMessage.trim(),
                  timestamp: new Date().toISOString(),
                  delivered: true,
                },
              ],
            }
          : prev
      )
      setNewMessage('')
    } catch (err: any) {
      console.error('[SendMsg] Error:', err.message)
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="p-4">Loading messages...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!chat) return <div className="p-4 text-gray-500">No chat loaded</div>

  return (
    <div className="p-4 flex flex-col h-[90vh]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={chat.profilePictureUrl || '/audio.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold">@{chat.userName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg text-sm max-w-xs ${
              msg.senderId === chat.senderId ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100'
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-[11px] text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 p-2 border rounded-xl focus:outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
