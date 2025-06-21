import { useEffect, useRef } from 'react'

interface MessagePayload {
  type: 'new_message' | 'delivery_receipt' | 'pong' | string
  messageId?: string
  text?: string
  data?: any
  [key: string]: any
}

export const useGurkhaWebSocket = (
  connectionId: string,
  userId: string,
  onMessage: (data: any) => void,
  onDeliveryReceipt?: (data: any) => void
) => {
  const ws = useRef<WebSocket | null>(null)
  const heartbeat = useRef<NodeJS.Timeout | null>(null)
  const HEARTBEAT_INTERVAL = 30000

  useEffect(() => {
    if (!connectionId || !userId) return

    const WS_URL = `${process.env.NEXT_PUBLIC_GURKHA_WS_URL}/gurkha/ws?connectionId=${connectionId}&userId=${userId}`
    const socket = new WebSocket(WS_URL)
    ws.current = socket

    socket.onopen = () => {
      console.log('[GURKHA_WS] ✅ Connected')
      socket.send(JSON.stringify({ type: 'ping' }))

      heartbeat.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, HEARTBEAT_INTERVAL)
    }

    socket.onmessage = (event) => {
      try {
        const payload: MessagePayload = JSON.parse(event.data)

        switch (payload.type) {
          case 'new_message':
            onMessage(payload.data)
            break
          case 'delivery_receipt':
            onDeliveryReceipt?.(payload)
            break
          case 'pong':
            console.log('[GURKHA_WS] 🟢 Pong received')
            break
          default:
            console.warn('[GURKHA_WS] ⚠️ Unknown message type:', payload)
        }
      } catch (error) {
        console.error('[GURKHA_WS] ❌ Error parsing message:', error)
      }
    }

    socket.onerror = (err) => {
      console.error('[GURKHA_WS] 🔴 WebSocket error:', err)
    }

    socket.onclose = (event) => {
      console.log('[GURKHA_WS] ❎ Disconnected', {
        code: event.code,
        reason: event.reason,
      })
      if (heartbeat.current) clearInterval(heartbeat.current)
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close()
      }
      if (heartbeat.current) clearInterval(heartbeat.current)
    }
  }, [connectionId, userId])

  const sendMessage = (text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'new_message',
        text,
        timestamp: new Date().toISOString(),
      }
      ws.current.send(JSON.stringify(payload))
    } else {
      console.warn('[GURKHA_WS] 💤 Tried to send message while socket was not open.')
    }
  }

  const sendDeliveryReceipt = (messageId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'delivery_receipt', messageId }))
    } else {
      console.warn('[GURKHA_WS] 💤 Tried to send delivery receipt while socket was not open.')
    }
  }

  return {
    sendMessage,
    sendDeliveryReceipt,
  }
}
