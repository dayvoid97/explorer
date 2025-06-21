'use client'

import { useEffect, useState, useRef } from 'react'
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
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const to = searchParams.get('to')
  const token = getToken()

  // ✅ Fetch chat on load
  useEffect(() => {
    if (!to || !token) {
      setError('Missing recipient or token.')
      setLoading(false)
      return
    }

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

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`User "@${to}" not found or no conversation exists.`)
          } else {
            throw new Error(`Server error: ${res.status}`)
          }
        }

        const data = await res.json()
        setChat(data)
      } catch (err: any) {
        if (err.name === 'TypeError') {
          setError('Network error: Please check your internet connection.')
        } else {
          setError(err.message || 'Something went wrong.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [to, token])

  // ✅ Mark as read
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

  // ✅ Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  // ✅ Send new message
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

  // ✅ Render
  if (loading) return <div className="p-4 text-center">Loading messages...</div>

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 space-y-4 max-w-md mx-auto">
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!chat) {
    return <div className="p-4 text-gray-500 text-center">No chat loaded</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 border-b dark:border-gray-700">
        <img
          src={chat.profilePictureUrl || '/audio.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <h2 className="text-md font-semibold dark:text-white">@{chat.userName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {chat.messages.map((msg) => {
          const isSender = msg.senderId === chat.senderId
          return (
            <div
              key={msg.id}
              className={`max-w-[80%] p-2 rounded-xl text-sm shadow-sm ${
                isSender
                  ? 'bg-blue-100 dark:bg-blue-600 dark:text-white ml-auto text-right'
                  : 'bg-gray-200 dark:bg-gray-800 dark:text-white'
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-4 flex gap-2 items-center bg-white dark:bg-gray-900 py-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none"
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
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
