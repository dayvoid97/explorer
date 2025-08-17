import { useEffect, useRef, useState, useCallback } from 'react'
import { getAccessToken } from '../lib/auth'

interface LiveStreamMessage {
  type: 'stream_created' | 'participant_joined' | 'participant_left' | 'chat_message' | 'drawing_update' | 'ticker_update' | 'audio_level' | 'stream_ended' | 'error'
  data?: any
  streamId?: string
  participantId?: string
  message?: string
  drawingData?: any
  tickerData?: any
  audioLevel?: number
}

interface Participant {
  id: string
  username: string
  isHost: boolean
  joinedAt: string
  isSpeaking: boolean
  audioLevel: number
}

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

interface UseLiveStreamSocketReturn {
  isConnected: boolean
  streamData: LiveStreamData | null
  participants: Participant[]
  messages: any[]
  sendMessage: (message: string) => void
  sendDrawingUpdate: (drawingData: any) => void
  startStream: (title: string, maxParticipants: number) => Promise<void>
  joinStream: (streamId: string) => Promise<void>
  endStream: () => void
  error: string | null
}

export default function useLiveStreamSocket(): UseLiveStreamSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [streamData, setStreamData] = useState<LiveStreamData | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    const token = getAccessToken()
    if (!token) {
      setError('Authentication required')
      return
    }

    const WS_URL = `${process.env.NEXT_PUBLIC_GURKHA_WS_URL}/gurkha/live`
    const socket = new WebSocket(WS_URL)
    wsRef.current = socket

    socket.onopen = () => {
      console.log('[LIVE_STREAM] ✅ Connected to livestream WebSocket')
      setIsConnected(true)
      setError(null)

      // Send authentication
      socket.send(JSON.stringify({
        type: 'authenticate',
        token
      }))

      // Start heartbeat
      heartbeatRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, 30000)
    }

    socket.onmessage = (event) => {
      try {
        const message: LiveStreamMessage = JSON.parse(event.data)
        handleMessage(message)
      } catch (error) {
        console.error('[LIVE_STREAM] Error parsing message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('[LIVE_STREAM] WebSocket error:', error)
      setError('Connection error')
    }

    socket.onclose = (event) => {
      console.log('[LIVE_STREAM] WebSocket closed:', event.code, event.reason)
      setIsConnected(false)
      
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }

      // Attempt to reconnect after 5 seconds
      if (event.code !== 1000) { // Don't reconnect if closed normally
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[LIVE_STREAM] Attempting to reconnect...')
          connect()
        }, 5000)
      }
    }
  }, [])

  const handleMessage = useCallback((message: LiveStreamMessage) => {
    switch (message.type) {
      case 'stream_created':
        setStreamData(message.data)
        break
      
      case 'participant_joined':
        setParticipants(prev => [...prev, message.data])
        break
      
      case 'participant_left':
        setParticipants(prev => prev.filter(p => p.id !== message.participantId))
        break
      
      case 'chat_message':
        setMessages(prev => [...prev, message.data])
        break
      
      case 'drawing_update':
        // Handle drawing updates
        break
      
      case 'ticker_update':
        // Handle ticker updates
        break
      
      case 'audio_level':
        setParticipants(prev => 
          prev.map(p => 
            p.id === message.participantId 
              ? { ...p, audioLevel: message.audioLevel || 0, isSpeaking: (message.audioLevel || 0) > 0.1 }
              : p
          )
        )
        break
      
      case 'stream_ended':
        setStreamData(null)
        setParticipants([])
        setMessages([])
        break
      
      case 'error':
        setError(message.message || 'An error occurred')
        break
      
      default:
        console.log('[LIVE_STREAM] Unknown message type:', message.type)
    }
  }, [])

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        message,
        streamId: streamData?.streamId
      }))
    }
  }, [streamData?.streamId])

  const sendDrawingUpdate = useCallback((drawingData: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'drawing_update',
        drawingData,
        streamId: streamData?.streamId
      }))
    }
  }, [streamData?.streamId])

  const startStream = useCallback(async (title: string, maxParticipants: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'start_stream',
        title,
        maxParticipants
      }))
    }
  }, [])

  const joinStream = useCallback(async (streamId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join_stream',
        streamId
      }))
    }
  }, [])

  const endStream = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'end_stream',
        streamId: streamData?.streamId
      }))
    }
  }, [streamData?.streamId])

  useEffect(() => {
    connect()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  return {
    isConnected,
    streamData,
    participants,
    messages,
    sendMessage,
    sendDrawingUpdate,
    startStream,
    joinStream,
    endStream,
    error
  }
} 