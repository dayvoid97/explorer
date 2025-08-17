// lib/notifications.ts
import { authFetch } from './api' // Assuming lib/api.ts is where authFetch is located

interface NotificationParams {
  recipientId: string
  senderId: string
  type: 'follow' | 'comment' | 'like' | 'post' | 'message'
  message: string
  relatedItemId?: string
  relatedItemType?: 'win' | 'card' | 'comment' | 'message' | 'user' // 'user' for follow notifications
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Sends a request to the backend to post a new notification.
 * This function should be called after a successful activity (comment, like, follow, etc.).
 * @param {NotificationParams} params - The parameters for the notification.
 * @param {string | null} accessToken - The current user's access token for authentication.
 * @returns {Promise<any>} A promise that resolves with the backend response.
 */
export const postNotification = async (params: NotificationParams) => {
  if (!API_BASE) {
    console.error('API_BASE is not defined for notification API caller.')
    throw new Error('API Base URL is not configured.')
  }

  try {
    const res = await authFetch(`${API_BASE}/gurkha/notification/postNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = await res.json()

    if (!res.ok) {
      // Re-throw the error so the calling component can handle it
      throw new Error(data.message || data.error || 'Failed to post notification.')
    }

    console.log('Notification posted successfully:', data.message)
    return data
  } catch (error) {
    console.error('Error posting notification:', error)
    // You might want to handle this gracefully in the UI, but it shouldn't
    // prevent the primary action (comment, like, etc.) from completing successfully.
    throw error // Re-throw to propagate to the caller if needed
  }
}
