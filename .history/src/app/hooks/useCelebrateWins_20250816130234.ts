// Assuming this is in a file like: app/hooks/useCelebrateWins.ts
import { authFetch } from '../lib/api' // Make sure this path is correct relative to this file

export async function celebrateWin(winId: string): Promise<number> {
  // REMOVED: The 'token' parameter. authFetch will handle getting the token.
  try {
    const res = await authFetch(
      // CHANGED: Use authFetch instead of fetch
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/${winId}/celebrate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await res.json() // Always parse data for more detailed errors

    if (!res.ok) {
      // If authFetch didn't already throw a specific auth error (e.g., if it's a 400/500 from backend)
      throw new Error(data.message || data.error || 'Failed to celebrate win')
    }

    return data.upvotes // Assuming the backend returns { upvotes: number }
  } catch (err: any) {
    console.error('Error celebrating win:', err)
    // RE-THROW the error so the calling component (WinCard) can catch it
    // and decide whether to redirect to login based on authFetch's error messages.
    throw err
  }
}
