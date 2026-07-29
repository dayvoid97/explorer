import { authFetch } from '@/app/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const messageApi = {
  /** Fetch conversation history and participant info */
  async getChat(to: string) {
    const res = await authFetch(`${BASE_URL}/gurkha/users/messages?to=${to}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to fetch chat')
    return data
  },

  /** Send a new message */
  async postMessage(connectionId: string, text: string) {
    const res = await authFetch(`${BASE_URL}/gurkha/users/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId, text }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to send')
    return data
  },

  /** Mark chat as read */
  async markAsRead(connectionId: string) {
    return await authFetch(`${BASE_URL}/gurkha/users/messages/markAsRead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId }),
    })
  },
}
