import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SITE_HOST = 'financialgurkha.com'
const SITE_BASE = `https://${SITE_HOST}`
const INDEXNOW_KEY = 'a3f89e2c1d4b7f05e6a98b2c4d1e3f7a'
const KEY_LOCATION = `${SITE_BASE}/${INDEXNOW_KEY}.txt`

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
]

function getSiteUrls() {
  const staticUrls = [
    `${SITE_BASE}/`,
    `${SITE_BASE}/blog`,
    `${SITE_BASE}/consult`,
    `${SITE_BASE}/about`,
    `${SITE_BASE}/about/kanchan`,
    `${SITE_BASE}/track-record`,
    `${SITE_BASE}/legal/editorial`,
    `${SITE_BASE}/legal/terms`,
    `${SITE_BASE}/legal/privacy`,
    `${SITE_BASE}/winners`,
  ]

  const postsDir = path.join(process.cwd(), 'src', 'app', 'blog', 'posts')
  let postUrls: string[] = []

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir)
    postUrls = files
      .filter((f) => f.endsWith('.md'))
      .map((f) => `${SITE_BASE}/blog/${f.replace(/\.md$/, '')}`)
  }

  return Array.from(new Set([...staticUrls, ...postUrls]))
}

async function triggerIndexNow() {
  const urls = getSiteUrls()
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  const results: Record<string, { status: number; ok: boolean }> = {}

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      })
      results[endpoint] = { status: res.status, ok: res.ok || res.status === 202 }
    } catch (err: any) {
      results[endpoint] = { status: 500, ok: false }
    }
  }

  return { urlsCount: urls.length, results }
}

export async function GET() {
  const data = await triggerIndexNow()
  return NextResponse.json({ success: true, ...data })
}

export async function POST() {
  const data = await triggerIndexNow()
  return NextResponse.json({ success: true, ...data })
}
