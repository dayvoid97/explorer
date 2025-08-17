'use client'

import React, { useState, useEffect, useRef } from 'react'
import { getUsernameFromToken, getAccessToken } from '../../lib/auth'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  isHost: boolean
  isSystem: boolean
}

interface LiveChatProps {
  streamId: string
  onSendMessage: (message: string) => void
}

export default function LiveChat({ streamId, onSendMessage }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const [currentUsername, setCurrentUsername] = useState('')

  useEffect(() => {
    const token = getAccessToken()
    const username = getUsernameFromToken(token)
    if (username) {
      setCurrentUsername(username)
    }
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  const addSystemMessage = (message: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'System',
      message,
      timestamp: new Date().toISOString(),
      isHost: false,
      isSystem: true
    }
    setMessages(prev => [...prev, systemMessage])
  }

  const addChatMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  // Simulate receiving messages (replace with actual WebSocket handling)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const mockMessages = [
          'Great analysis! 📈',
          'What do you think about AAPL?',
          'The market is looking bullish today',
          'Thanks for the insights!',
          'When do you think the Fed will cut rates?'
        ]
        
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]
        const mockUsername = ['TraderJohn', 'FinanceGuru', 'MarketWatcher', 'StockMaster'][Math.floor(Math.random() * 4)]
        
        const mockChatMessage: ChatMessage = {
          id: Date.now().toString(),
          username: mockUsername,
          message: randomMessage,
          timestamp: new Date().toISOString(),
          isHost: mockUsername === 'FinanceGuru',
          isSystem: false
        }
        
        addChatMessage(mockChatMessage)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Live Chat</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-400 text-sm">{participantCount} online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.isSystem ? 'items-center' : 'items-start'
              }`}
            >
              {message.isSystem ? (
                <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                  {message.message}
                </div>
              ) : (
                <div className="max-w-[85%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-medium ${
                      message.isHost ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {message.username}
                      {message.isHost && ' (HOST)'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                    {message.message}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Send
          </button>
        </form>
        
        {!isConnected && (
          <p className="text-red-400 text-xs mt-2">Connecting to chat...</p>
        )}
      </div>
    </div>
  )
} 