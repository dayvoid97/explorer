import { appItems, appJson } from '@/app/lib/app-content'

export const dynamic = 'force-static'

/** Every brief and article for the mobile app, newest first: /api/app/v1/feed */
export async function GET() {
  const items = await appItems()
  // The newest content date doubles as a version, so the app can tell when to refresh its cache
  return appJson({ version: items[0]?.date ?? null, items })
}
