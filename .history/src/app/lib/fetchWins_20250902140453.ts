// app/lib/fetchWins.ts

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
  lastCreatedAt?: string | null
  lastId?: string | null // <--- ADDED lastId here
}

export async function fetchExploreWins({
  sortBy = 'recent',
  limit = 20,
  lastCreatedAt,
  lastId, // <--- Destructure lastId
}: FetchExploreParams): Promise<any[]> {
  try {
    const url = new URL(`${API_BASE_URL}/gurkha/wins/explore`)
    url.searchParams.set('sortBy', sortBy)
    url.searchParams.set('limit', limit.toString())
    if (lastCreatedAt) {
      url.searchParams.set('lastCreatedAt', lastCreatedAt)
    }
    if (lastId) {
      // <--- Send lastId to backend
      url.searchParams.set('lastId', lastId)
    }

    const res = await fetch(url.toString())
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to fetch explore wins')
    }
    return await res.json()
  } catch (err) {
    console.error('❌ Error fetching explore wins:', err)
    return []
  }
}

// Add this to your fetchWins.ts file
// Add this to your fetchWins.ts file
export async function fetchChronology(chronologyId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/gurkha/chronology/${chronologyId}/chain`)
    if (!res.ok) throw new Error('Failed to fetch chronology chain')
    const data = await res.json()
    // Return the wins array from the chain response
    return data.wins || []
  } catch (err) {
    console.error('❌ Error fetching chronology chain:', err)
    return []
  }
}
