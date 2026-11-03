import { entryToUrl, newsEntries, urlset, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/** Every Daily Brief, newest first, with its cover image. Served at /news/sitemap.xml. */
export async function GET() {
  return xmlResponse(urlset((await newsEntries()).map(entryToUrl)))
}
