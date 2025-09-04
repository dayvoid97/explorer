'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authFetch } from '@/app/lib/api'
import { removeTokens, isLoggedIn } from '@/app/lib/auth'
import { ArrowLeft, Send, User, Loader2 } from 'lucide-react'

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

// Loading skeleton for messages
const MessageSkeleton = () => (
  <div className="space-y-3 p-4">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
        <div className="animate-pulse">
          <div
            className={`h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl ${
              i % 2 === 0 ? 'w-48' : 'w-32'
            }`}
          />
        </div>
      </div>
    ))}
  </div>
)

// Message bubble component
const MessageBubble = ({ message, isSender }: { message: Message; isSender: boolean }) => (
  <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
    <div
      className={`
      max-w-[75%] sm:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm
      ${
        isSender
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-md'
      }
    `}
    >
      <p className="text-sm leading-relaxed break-words">{message.text}</p>
      <p
        className={`text-xs mt-1 ${
          isSender ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  </div>
)

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
      <User className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
    >
      Try Again
    </button>
  </div>
)

export default function MessageClient() {
  const [chat, setChat] = useState<ChatData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const to = searchParams.get('to')

  const handleAuthRedirect = useCallback(
    (errMessage = 'Session expired. Please log in again.') => {
      setError(errMessage)
      removeTokens()
      router.push('/login')
    },
    [router]
  )

  const fetchChat = useCallback(async () => {
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to view messages.')
      setLoading(false)
      return
    }

    if (!to) {
      setError('Missing recipient for chat.')
      setLoading(false)
      return
    }

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages?to=${to}`,
        { method: 'GET' }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || `Server error: ${res.status}`)
      }

      setChat(data)
      setError('')
    } catch (err: any) {
      console.error('Error fetching chat:', err)

      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else if (err.message.includes('Network error')) {
        setError('Network error: Please check your internet connection.')
      } else {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }, [to, handleAuthRedirect])

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!chat?.connectionId || !isLoggedIn() || chat.messages.length === 0) return

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages/markAsRead`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ connectionId: chat.connectionId }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to mark messages as read')
      }
    } catch (err: any) {
      console.error('[markAsRead] Error:', err.message)
    }
  }, [chat?.connectionId, chat?.messages])

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !chat || sending) return

    setSending(true)
    setError('')

    try {
      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to send messages.')
        return
      }

      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId: chat.connectionId,
          text: newMessage.trim(),
        }),
      })

      const sent = await res.json()
      if (!res.ok) {
        throw new Error(sent.message || sent.error || 'Failed to send message.')
      }

      // Add message to local state
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

      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || 'Failed to send message.')
      }
    } finally {
      setSending(false)
    }
  }, [newMessage, chat, sending, handleAuthRedirect])

  // Effects
  useEffect(() => {
    setLoading(true)
    fetchChat()

    const interval = setInterval(fetchChat, 5000)
    return () => clearInterval(interval)
  }, [fetchChat])

  useEffect(() => {
    markAsRead()
  }, [markAsRead])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white dark:bg-gray-900">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        </div>
        <MessageSkeleton />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white dark:bg-gray-900">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  // No chat loaded
  if (!chat) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">No chat loaded</p>
      </div>
    )
  }

  // Main chat interface
  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <img
            src={chat.profilePictureUrl || '/audio.png'}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            alt="Profile"
          />

          <div className="flex-1 min-w-0">
            <h2
              onClick={() => router.push(`/publicprofile/${chat.userName}`)}
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              @{chat.userName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chat.messages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950"
      >
        <div className="p-4 space-y-1">
          {chat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send a message to @{chat.userName}
              </p>
            </div>
          ) : (
            chat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isSender={msg.senderId === chat.senderId} />
            ))
          )}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 min-h-[48px]"
              placeholder={`Message @${chat.userName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{
                height: 'auto',
                minHeight: '48px',
                maxHeight: '128px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 128) + 'px'
              }}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-2xl transition-colors disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    </div>
  )
}
