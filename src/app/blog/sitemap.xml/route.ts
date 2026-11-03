import { blogEntries, entryToUrl, urlset, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/** Every research article, newest first, with its cover image. Served at /blog/sitemap.xml. */
export async function GET() {
  return xmlResponse(urlset((await blogEntries()).map(entryToUrl)))
}
