export async function celebrateWin(winId: string, token: string): Promise<number> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/${winId}/celebrate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) throw new Error('Failed to celebrate')

  const data = await res.json()
  return data.upvotes
}
