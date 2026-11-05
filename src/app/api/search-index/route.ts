import { searchDocs } from '@/app/lib/search/index-data'

export const dynamic = 'force-static'

/** The site search index, built on every deploy and loaded by the search box on first use. */
export async function GET() {
  return new Response(JSON.stringify(await searchDocs()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  })
}
