import { NextResponse } from 'next/server'
import { getMarkets } from '@/app/lib/markets'

// Refreshed at most every 10 minutes; the homepage strip polls this while open
export const revalidate = 600

export async function GET() {
  return NextResponse.json(await getMarkets(), {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' },
  })
}
