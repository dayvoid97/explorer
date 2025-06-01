export async function fetchWins(): Promise<any[]> {
  try {
    const res = await fetch('/api/wins')
    if (!res.ok) throw new Error('Failed to fetch wins')
    return await res.json()
  } catch (err) {
    console.error('❌ Error fetching wins:', err)
    return []
  }
}
