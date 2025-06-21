import { useEffect, useRef } from 'react'

interface MessagePayload {
  type: string
  [key: string]: any
}

export const useGurkhaWebSocket = (
  connectionId: string,
  userId: string,
  onMessage: (data: any) => void,
  onDeliveryReceipt?: (data: any) => void
) => {
  const ws = useRef<WebSocket | null>(null)
  const HEARTBEAT_INTERVAL = 30000
  const heartbeat = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!connectionId || !userId) return

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_GURKHA_WS_URL}?connectionId=${connectionId}&userId=${userId}`
    )
    ws.current = socket

    socket.onopen = () => {
      console.log('[GURKHA_WS] Connected')
      // Optional: Send initial ping
      socket.send(JSON.stringify({ type: 'ping' }))

      heartbeat.current = setInterval(() => {
        socket.send(JSON.stringify({ type: 'ping' }))
      }, HEARTBEAT_INTERVAL)
    }

    socket.onmessage = (event) => {
      const data: MessagePayload = JSON.parse(event.data)
      switch (data.type) {
        case 'new_message':
          onMessage(data)
          break
        case 'delivery_receipt':
          if (onDeliveryReceipt) onDeliveryReceipt(data)
          break
        case 'pong':
          console.log('[GURKHA_WS] Pong received')
          break
        default:
          console.log('[GURKHA_WS] Unknown message:', data)
      }
    }

    socket.onclose = () => {
      console.log('[GURKHA_WS] Connection closed')
      clearInterval(heartbeat.current)
    }

    return () => {
      socket.close()
      clearInterval(heartbeat.current)
    }
  }, [connectionId, userId])

  const sendMessage = (text: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'new_message',
        text,
        timestamp: new Date().toISOString(),
      }
      ws.current.send(JSON.stringify(payload))
    }
  }

  const sendDeliveryReceipt = (messageId: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'delivery_receipt', messageId }))
    }
  }

  return {
    sendMessage,
    sendDeliveryReceipt,
  }
}
