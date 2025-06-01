import { ExplorerItem } from '../hooks/useExplorersearch'
export async function fetchExplorerData(query: string): Promise<ExplorerItem[] | ExplorerItem> {
  const res = await fetch(`http://localhost:8000/explorer?q=${encodeURIComponent(query)}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Unknown error')
  return json.result || json.results
}
