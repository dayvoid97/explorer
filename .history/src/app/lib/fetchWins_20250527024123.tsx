cosnt API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
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
