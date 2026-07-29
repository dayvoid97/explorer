import { useState, useEffect, useCallback } from 'react'
import { messageApi } from '../lib/useMessages'

export function useChatActivity(to: string | null) {
  const [chat, setChat] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshChat = useCallback(
    async (isInitial = false) => {
      if (!to) return
      try {
        const data = await messageApi.getChat(to)
        setChat(data)
        if (isInitial) messageApi.markAsRead(data.connectionId)
      } catch (err: any) {
        setError(err.message)
      } finally {
        if (isInitial) setLoading(false)
      }
    },
    [to]
  )

  const sendNewMessage = async (text: string) => {
    if (!chat || !text.trim()) return

    // Optimistic UI Update
    const tempId = `temp-${Date.now()}`
    const optimisticMsg = {
      id: tempId,
      senderId: chat.senderId,
      text,
      timestamp: new Date().toISOString(),
      isOptimistic: true,
    }

    setChat((prev: any) => ({ ...prev, messages: [...prev.messages, optimisticMsg] }))

    try {
      await messageApi.postMessage(chat.connectionId, text)
      await refreshChat() // Sync with server
    } catch (err) {
      setError('Failed to send. Reverting...')
      setChat((prev: any) => ({
        ...prev,
        messages: prev.messages.filter((m: any) => m.id !== tempId),
      }))
    }
  }

  useEffect(() => {
    refreshChat(true)
    const interval = setInterval(() => refreshChat(), 5000)
    return () => clearInterval(interval)
  }, [refreshChat])

  return { chat, loading, error, sendNewMessage }
}
