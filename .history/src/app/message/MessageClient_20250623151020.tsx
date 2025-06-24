'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '@/app/lib/auth' // isLoggedIn for initial check

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  delivered: boolean
}

interface ChatData {
  connectionId: string
  senderId: string // The ID of the current logged-in user
  receiverId: string
  userName: string // The username of the other participant in the chat
  profilePictureUrl?: string
  messages: Message[]
}

export default function MessageClient() {
  const [chat, setChat] = useState<ChatData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const to = searchParams.get('to') // The username of the recipient
  // REMOVED: const token = getToken(); - authFetch handles this internally

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const fetchChat = async () => {
    // Check if user is logged in before attempting authenticated fetch
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to view messages.')
      setLoading(false)
      return // Stop execution if not logged in
    }
    if (!to) {
      setError('Missing recipient for chat.')
      setLoading(false)
      return
    }

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages?to=${to}`,
        {
          method: 'GET',
        }
      )

      const data = await res.json()
      if (!res.ok) {
        // If authFetch didn't handle a token error, then it's a backend logic error
        throw new Error(data.message || data.error || `Server error: ${res.status}`)
      }

      setChat(data)
    } catch (err: any) {
      console.error('Error fetching chat:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else if (err.message.includes('Network error')) {
        // Specific check for network issues
        setError('Network error: Please check your internet connection.')
      } else {
        setError(err.message || 'Something went wrong.') // Set other non-auth related errors
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and polling
  useEffect(() => {
    setLoading(true) // Always show loading when starting fetch
    fetchChat() // Initial fetch

    const interval = setInterval(() => {
      fetchChat() // Poll for new messages
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval) // Cleanup interval
  }, [to, router]) // Depend on 'to' and 'router'

  // Mark as read when chat loads or messages change
  useEffect(() => {
    // Only mark as read if chat data exists, connectionId is known, and user is logged in
    if (!chat || !chat.connectionId || !isLoggedIn() || chat.messages.length === 0) return

    const markAsRead = async () => {
      try {
        // CHANGED: Use authFetch for this authenticated call
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/messages/markAsRead`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }, // authFetch adds Authorization header
            body: JSON.stringify({ connectionId: chat.connectionId }),
          }
        )
        if (!res.ok) {
          const data = await res.json()
          throw new Error(
            data.message || data.error || `Failed to mark messages as read (Status: ${res.status}).`
          )
        }
      } catch (err: any) {
        // For markAsRead, if auth fails, we log it but don't force a user redirect,
        // as it's a background task. The main fetchChat will handle session expiry.
        console.error('[markAsRead] Error:', err.message)
      }
    }
    markAsRead()
  }, [chat?.connectionId, chat?.messages, isLoggedIn()]) // Depend on chat.connectionId, messages, and login status

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return
    setSending(true)
    setError('') // Clear previous errors

    try {
      // Check authentication explicitly before sending to ensure authFetch has token
      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to send messages.')
        return
      }

      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify({
          connectionId: chat.connectionId,
          text: newMessage.trim(),
        }),
      })

      const sent = await res.json()
      if (!res.ok) {
        throw new Error(sent.message || sent.error || 'Failed to send message.')
      }

      setChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: sent.id || `temp-${Date.now()}`, // Use sent.id if provided by backend
                  senderId: chat.senderId, // Assuming chat.senderId is the current user's ID
                  text: newMessage.trim(),
                  timestamp: new Date().toISOString(),
                  delivered: true, // Assuming true after successful post
                },
              ],
            }
          : prev
      )
      setNewMessage('') // Clear input field
    } catch (err: any) {
      console.error('[SendMsg] Error:', err.message)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      setSending(false)
    }
  }

  // Render loading, error, or empty states
  if (loading)
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading messages...</div>
    )
  {
    /* Dark mode text */
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 space-y-4 max-w-md mx-auto">
        {' '}
        {/* Dark mode text */}
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()} // For critical errors, reload might still be an option
          className="inline-block bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition dark:bg-red-700 dark:hover:bg-red-800"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!chat) {
    return <div className="p-4 text-gray-500 dark:text-gray-400 text-center">No chat loaded</div>
    {
      /* Dark mode text */
    }
  }

  // Main chat interface
  return (
    <div className="max-w-2xl mx-auto px-4 py-2 h-screen flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {' '}
      {/* Added dark mode bg/shadow */}
      <div className="flex items-center gap-3 py-3 border-b dark:border-gray-700">
        {' '}
        {/* Dark mode border */}
        <img
          src={chat.profilePictureUrl || '/audio.png'}
          className="w-10 h-10 rounded-full object-cover border dark:border-gray-600"
          alt="Profile"
        />
        <h2
          onClick={() => router.push(`/publicprofile/${chat.userName}`)}
          className="text-md font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
        >
          @{chat.userName}
        </h2>
      </div>
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
                {' '}
                {/* Dark mode text */}
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )
        })}
        <div ref={chatBottomRef} />
      </div>
      <div className="sticky bottom-4 flex gap-2 items-center bg-white dark:bg-gray-900 py-2">
        {' '}
        {/* Dark mode bg */}
        <input
          type="text"
          className="flex-1 p-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
        >
          Send
        </button>
      </div>
    </div>
  )
}
