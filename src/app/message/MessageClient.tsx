'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useChatActivity } from '../hooks/useChatActivity'
import { ArrowLeft, Send } from 'lucide-react'

export default function MessageClient() {
  const to = useSearchParams().get('to')
  const router = useRouter()
  const { chat, loading, error, sendNewMessage } = useChatActivity(to)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const navigateToProfile = () => {
    if (chat?.userName) {
      router.push(`/publicprofile/${chat.userName}`)
    }
  }

  // Track message count to prevent unnecessary scrolling during polling
  const lastMessageCount = useRef(0)

  useEffect(() => {
    if (chat?.messages?.length && chat.messages.length > lastMessageCount.current) {
      // Only scroll if a NEW message arrived
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      lastMessageCount.current = chat.messages.length
    }
  }, [chat?.messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendNewMessage(input)
    setInput('')
  }

  if (loading)
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>

  return (
    /* Changed h-screen to calc to account for a typical navbar height (e.g., 64px) */
    <div className="flex flex-col  max-w-2xl mx-auto bg-white border-x border-gray-100 relative">
      {/* HEADER: Added higher z-index and relative positioning */}
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between  shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/inbox')}
            className="hover:bg-gray-800 p-1 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <div onClick={navigateToProfile} className="group flex flex-col cursor-pointer">
            <h2 className="font-bold text-lg leading-none group-hover:text-blue-400 transition-colors">
              @{chat?.userName}
            </h2>
            <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
              View Profile
            </span>
          </div>
        </div>
        <div onClick={navigateToProfile} className="group flex flex-col cursor-pointer">
          {chat?.profilePictureUrl && (
            <img
              src={chat.profilePictureUrl}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-700"
              alt=""
            />
          )}
        </div>
      </header>

      {/* MESSAGE LIST: Added custom scrollbar hiding if needed */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdfdfd] scroll-smooth">
        {chat?.messages.map((m: any, idx: number) => {
          const isMe = m.senderId === chat.senderId
          return (
            <div key={m.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-2 shadow-sm text-[14px] ${
                  isMe
                    ? 'bg-black text-white rounded-2xl rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} className="h-2" />
      </main>

      {/* INPUT */}
      <footer className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1 border border-gray-200 focus-within:border-black transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent py-2.5 outline-none text-sm text-gray-800"
            placeholder="Message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="text-black disabled:opacity-20 transition-opacity p-1"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  )
}
