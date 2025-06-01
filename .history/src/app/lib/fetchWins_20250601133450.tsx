const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchWins(): Promise<any[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/wins`)
    if (!res.ok) throw new Error('Failed to fetch wins')
    return await res.json()
  } catch (err) {
    console.error('❌ Error fetching wins:', err)
    return []
  }
}

export async function fetchExploreWins({ sortBy = 'recent', limit = 20, lastCreatedAt = null }) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/explore`)
  url.searchParams.set('sortBy', sortBy)
  url.searchParams.set('limit', limit.toString())
  if (lastCreatedAt) url.searchParams.set('lastCreatedAt', lastCreatedAt)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch explore wins')
  return await res.json()
}
