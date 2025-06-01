// lib/fetcher.ts
import { ExplorerItem } from '../hooks/useExplorersearch'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// 🔹 Fetch general explorer data (search query + countries)
export async function fetchExplorerData(query: string, countries: string[]): Promise<ExplorerItem> {
  const url = new URL(`${API_URL}/explore`)
  url.searchParams.set('q', query)
  countries.forEach((c) => url.searchParams.append('country', c))

  const res = await fetch(url.toString())
  const json = await res.json()

  if (!res.ok) throw new Error(json.error || 'Unknown error')
  return json.targetCompany
}

// 🔹 Fetch specific company data by ID
export async function fetchCompanyData(companyId: string): Promise<ExplorerItem> {
  const res = await fetch(`${API_URL}/explore/company/${encodeURIComponent(companyId)}`)
  const json = await res.json()

  if (!res.ok) throw new Error(json.error || 'Unknown error')
  return json.data
}
