// app/lib/api.ts (or wherever your fetch functions are)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchWins(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/gurkha/wins`)
    if (!res.ok) throw new Error('Failed to fetch wins')
    return await res.json()
  } catch (err) {
    console.error('❌ Error fetching wins:', err)
    return []
  }
}

interface FetchExploreParams {
  sortBy?: 'recent' | 'celebrated' | 'hottest'
  limit?: number
  // lastCreatedAt will be a string representing the ISO date string or timestamp
  lastCreatedAt?: string | null
}

export async function fetchExploreWins({
  sortBy = 'recent',
  limit = 20,
  lastCreatedAt,
}: FetchExploreParams): Promise<any[]> {
  try {
    const url = new URL(`${API_BASE_URL}/gurkha/wins/explore`)
    url.searchParams.set('sortBy', sortBy)
    url.searchParams.set('limit', limit.toString())
    if (lastCreatedAt) {
      // Simplified check, as 'null' string is handled by backend if present
      url.searchParams.set('lastCreatedAt', lastCreatedAt)
    }

    const res = await fetch(url.toString())
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to fetch explore wins')
    }
    return await res.json()
  } catch (err) {
    console.error('❌ Error fetching explore wins:', err)
    // Return empty array on error to prevent breaking the UI
    return []
  }
}
