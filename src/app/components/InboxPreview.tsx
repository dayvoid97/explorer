'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/app/lib/api'
import { removeTokens, isLoggedIn } from '@/app/lib/auth'
import { MessageSquare, Circle } from 'lucide-react' // Lucide icons for extra polish

interface ChatSummary {
  connectionId: string
  userName: string
  profilePictureUrl: string | null
  lastMessage: string
  lastTimestamp: number
  hasUnread: boolean
}

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

export default function InboxPreview() {
  const [inbox, setInbox] = useState<ChatSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuthRedirect = (errMessage: string = 'Session expired.') => {
    setError(errMessage)
    removeTokens()
    router.push('/login')
  }

  useEffect(() => {
    const fetchInbox = async () => {
      if (!isLoggedIn()) {
        setError('Login required.')
        setLoading(false)
        return
      }
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/inbox`, {
          method: 'GET',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to load inbox')
        setInbox(data)
      } catch (err: any) {
        if (err.message.includes('Authentication')) {
          handleAuthRedirect(err.message)
        } else {
          setError(err.message || 'Failed to load messages.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchInbox()
  }, [router])

  if (loading) {
    return (
      <div className="p-4 space-y-4 bg-[#111] border border-white/5 rounded-2xl shadow-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-white/5 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error)
    return (
      <div className="p-6 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
        <p className="text-sm text-red-400">Error: {error}</p>
      </div>
    )

  if (inbox.length === 0)
    return (
      <div className="p-10 text-center bg-[#111] border border-white/5 rounded-2xl">
        <MessageSquare className="mx-auto text-white/10 mb-3" size={32} />
        <p className="text-sm text-white/40">Your inbox is clear</p>
      </div>
    )

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-sm font-bold tracking-widest uppercase text-white/50">Messages</h2>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
          {inbox.filter((c) => c.hasUnread).length} NEW
        </span>
      </div>

      <div className="p-2 space-y-1">
        {inbox.map((chat) => (
          <div
            key={chat.connectionId}
            onClick={() => router.push(`/message?to=${chat.userName}`)}
            className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]
              ${chat.hasUnread ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'hover:bg-white/[0.02]'}
            `}
          >
            {/* Unread Accent Bar */}
            {chat.hasUnread && (
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            )}

            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={chat.profilePictureUrl || '/audio.png'}
                  className="w-12 h-12 rounded-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all border border-white/10"
                  alt={chat.userName}
                />
                {chat.hasUnread && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-sm tracking-tight ${
                    chat.hasUnread ? 'text-white font-semibold' : 'text-white/70'
                  }`}
                >
                  @{chat.userName}
                </span>
                <p
                  className={`text-xs truncate max-w-[180px] mt-0.5 ${
                    chat.hasUnread ? 'text-white/90' : 'text-white/40'
                  }`}
                >
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <span className="text-[10px] font-mono uppercase text-white/30 tracking-tighter">
                {timeAgo(chat.lastTimestamp)}
              </span>
              {chat.hasUnread && (
                <div className="px-1.5 py-0.5 bg-indigo-500 rounded text-[9px] font-black text-white uppercase">
                  New
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
