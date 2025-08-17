'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../../lib/api'
import { getAccessToken, getUsernameFromToken } from '../../lib/auth'
import LiveVideo from './LiveVideo'
import LiveChat from './LiveChat'
import TickerFeed from './TickerFeed'
import DrawingCanvas from './DrawingCanvas'
import LiveControls from './LiveControls'
import ParticipantList from './ParticipantList'

interface LiveStreamData {
  streamId: string
  hostId: string
  hostUsername: string
  title: string
  maxParticipants: number
  currentParticipants: number
  isLive: boolean
  startedAt: string
  tickers: string[]
}

interface Participant {
  id: string
  username: string
  isHost: boolean
  joinedAt: string
  isSpeaking: boolean
}

export default function LiveStreamHub() {
  const router = useRouter()
  const [streamData, setStreamData] = useState<LiveStreamData | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isHost, setIsHost] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDrawing, setShowDrawing] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  
  const wsRef = useRef<WebSocket | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({})

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }

    const username = getUsernameFromToken(token)
    if (!username) {
      router.push('/login')
      return
    }

    // Initialize WebSocket connection
    initializeWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const initializeWebSocket = () => {
    const token = getAccessToken()
    const username = getUsernameFromToken(token)
    const isHostValue = isHost // Use the isHost state variable directly
    const roomId = streamData?.streamId || 'new'
    const userId = username // Assuming username is the user ID
    const userType = isHost ? 'host' : 'participant'
    const maxConnections = streamData?.maxParticipants || 10 // Assuming maxParticipants is available

    const wsUrl = `${process.env.NEXT_PUBLIC_GURKHA_WS_URL}/gurkha/wsConnect?roomId=${roomId}&userId=${userId}&userType=${userType}&maxConnections=${maxConnections}`;
    const socket = new WebSocket(wsUrl)
    wsRef.current = socket

    socket.onopen = () => {
      console.log('[LIVE_STREAM] ✅ Connected to livestream')
      setIsConnected(true)
      setLoading(false)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (error) {
        console.error('[LIVE_STREAM] Error parsing message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('[LIVE_STREAM] WebSocket error:', error)
      setError('Connection error. Please try again.')
    }

    socket.onclose = () => {
      console.log('[LIVE_STREAM] Disconnected from livestream')
      setIsConnected(false)
    }
  }

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'stream_created':
        setStreamData(data.stream)
        setIsHost(data.isHost)
        break
      case 'participant_joined':
        setParticipants(prev => [...prev, data.participant])
        break
      case 'participant_left':
        setParticipants(prev => prev.filter(p => p.id !== data.participantId))
        break
      case 'ticker_update':
        // Handle real-time ticker updates
        break
      case 'chat_message':
        // Handle chat messages
        break
      case 'drawing_update':
        // Handle drawing updates
        break
      default:
        console.log('[LIVE_STREAM] Unknown message type:', data.type)
    }
  }

  const startStream = async (maxParticipants: number, title: string) => {
    try {
      setLoading(true)
      setError(null)

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      streamRef.current = stream

      // Create stream on backend
      const response = await authFetch('/api/gurkha/live/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          maxParticipants,
          tickers: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'] // Default tickers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create stream')
      }

      const data = await response.json()
      setStreamData(data.stream)
      setIsHost(true)
      setIsConnected(true)

      // Send stream start message via WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'start_stream',
          streamId: data.stream.id
        }))
      }

    } catch (error: any) {
      console.error('Error starting stream:', error)
      setError(error.message || 'Failed to start stream')
    } finally {
      setLoading(false)
    }
  }

  const joinStream = async (streamId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authFetch(`/api/gurkha/live/join/${streamId}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to join stream')
      }

      const data = await response.json()
      setStreamData(data.stream)
      setIsHost(false)

      // Send join message via WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'join_stream',
          streamId
        }))
      }

    } catch (error: any) {
      console.error('Error joining stream:', error)
      setError(error.message || 'Failed to join stream')
    } finally {
      setLoading(false)
    }
  }

  const endStream = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'end_stream',
          streamId: streamData?.streamId
        }))
      }

      setStreamData(null)
      setParticipants([])
      setIsHost(false)
      setIsConnected(false)

    } catch (error: any) {
      console.error('Error ending stream:', error)
      setError(error.message || 'Failed to end stream')
    }
  }

  const sendChatMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        message,
        streamId: streamData?.streamId
      }))
    }
  }

  const sendDrawingUpdate = (drawingData: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'drawing_update',
        drawingData,
        streamId: streamData?.streamId
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing livestream...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  if (!streamData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Financial Gurkha Live</h1>
          <p className="text-gray-600 mb-8">Start or join a live trading session</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Stream */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Start New Stream</h2>
            <StartStreamForm onStart={startStream} />
          </div>

          {/* Join Stream */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Join Stream</h2>
            <JoinStreamForm onJoin={joinStream} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <h1 className="text-xl font-bold">{streamData.title}</h1>
            <span className="text-sm text-gray-400">
              {participants.length}/{streamData.maxParticipants} participants
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="bg-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Participants
            </button>
            <button
              onClick={() => setShowDrawing(!showDrawing)}
              className="bg-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Drawing
            </button>
            {isHost && (
              <button
                onClick={endStream}
                className="bg-red-600 px-4 py-1 rounded text-sm hover:bg-red-700"
              >
                End Stream
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <LiveVideo
            stream={streamRef.current}
            isHost={isHost}
            participants={participants}
          />
          
          {/* Ticker Feed */}
          <div className="h-24 bg-gray-800 border-t border-gray-700">
            <TickerFeed streamId={streamData.streamId} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Live Chat */}
          <div className="flex-1">
            <LiveChat
              streamId={streamData.streamId}
              onSendMessage={sendChatMessage}
            />
          </div>

          {/* Live Controls */}
          <div className="border-t border-gray-700">
            <LiveControls
              isHost={isHost}
              stream={streamRef.current}
              onToggleDrawing={() => setShowDrawing(!showDrawing)}
            />
          </div>
        </div>

        {/* Drawing Canvas Overlay */}
        {showDrawing && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <DrawingCanvas
              onClose={() => setShowDrawing(false)}
              onUpdate={sendDrawingUpdate}
            />
          </div>
        )}

        {/* Participants Panel */}
        {showParticipants && (
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 z-40">
            <ParticipantList
              participants={participants}
              isHost={isHost}
              onClose={() => setShowParticipants(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Start Stream Form Component
function StartStreamForm({ onStart }: { onStart: (maxParticipants: number, title: string) => void }) {
  const [title, setTitle] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(10)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onStart(maxParticipants, title.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Stream Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter stream title..."
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Max Participants</label>
        <select
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5 participants</option>
          <option value={10}>10 participants</option>
          <option value={20}>20 participants</option>
          <option value={50}>50 participants</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Start Stream
      </button>
    </form>
  )
}

// Join Stream Form Component
function JoinStreamForm({ onJoin }: { onJoin: (streamId: string) => void }) {
  const [streamId, setStreamId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (streamId.trim()) {
      onJoin(streamId.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Stream ID</label>
        <input
          type="text"
          value={streamId}
          onChange={(e) => setStreamId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter stream ID..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Join Stream
      </button>
    </form>
  )
} 