import { ExplorerItem } from '../hooks/useExplorersearch'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function fetchExplorerData(query: string, countries: string[]): Promise<ExplorerItem> {
  const url = new URL('http://localhost:8000/api/explore')
  url.searchParams.set('q', query)
  countries.forEach((c) => url.searchParams.append('country', c))

  const res = await fetch(url.toString())
  const json = await res.json()

  if (!res.ok) throw new Error(json.error || 'Unknown error')

  return json.targetCompany
}

export async function fetchCompanyData(query: string, countries: string[]): Promise<ExplorerItem> {
  const url = new URL('http://localhost:8000/api/explore')
  url.searchParams.set('q', query)
  countries.forEach((c) => url.searchParams.append('country', c))

  const res = await fetch(url.toString())
  const json = await res.json()

  if (!res.ok) throw new Error(json.error || 'Unknown error')

  return json.targetCompany
}
