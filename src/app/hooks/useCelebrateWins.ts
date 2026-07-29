// app/hooks/useCelebrateWins.ts (REPLACED)

import { authFetch } from '../lib/api'
import { getAccessToken } from '../lib/auth'

// Define the expected response structure from the high-scale backend
interface CelebrateResponse {
  action: 'VOTED' | 'UNVOTED' | 'ALREADY_VOTED' | 'ALREADY_UNVOTED'
  change: 1 | -1 | 0 // Represents the net change in count
  message?: string
}

/**
 * Toggles the celebrate/upvote status for a win.
 * @param {string} winId - The ID of the win.
 * @param {'upvote' | 'unvote'} action - The desired action.
 * @returns {Promise<CelebrateResponse>} The backend response detailing the change.
 */
export async function toggleCelebrate(
  winId: string,
  action: 'upvote' | 'unvote'
): Promise<CelebrateResponse> {
  const bodyPayload = { action } // Send the action in the body

  const token = getAccessToken()
  if (!token) {
    throw new Error('Authentication required. Please log in to celebrate this win.')
  }

  try {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/${winId}/celebrate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      }
    )

    const data: CelebrateResponse & { error?: string } = await res.json()

    if (!res.ok) {
      throw new Error(data.error || data.message || `Failed to process action ${action}`)
    }

    // Returns the structured response { action, change }
    return data
  } catch (err: any) {
    console.error(`Error processing ${action} on win ${winId}:`, err)
    throw err
  }
}
