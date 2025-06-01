// hooks/useLaunchCompanyCard.ts
import { ExplorerItem } from './useExplorersearch'
import { getToken } from '../lib/auth'

export async function launchCompanyCard(item: ExplorerItem) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch('/api/companycard/launchOrCreate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error || 'Failed to launch or create card')

  return data.cardId as string
}
