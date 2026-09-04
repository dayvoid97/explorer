import fs from 'fs'
import path from 'path'

const SITE_HOST = 'financialgurkha.com'
const SITE_BASE = `https://${SITE_HOST}`
const INDEXNOW_KEY = 'a3f89e2c1d4b7f05e6a98b2c4d1e3f7a'
const KEY_LOCATION = `${SITE_BASE}/${INDEXNOW_KEY}.txt`

// Endpoints for IndexNow
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow']

async function getSiteUrls() {
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
  let postUrls = []

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir)
    postUrls = files
      .filter((f) => f.endsWith('.md'))
      .map((f) => `${SITE_BASE}/blog/${f.replace(/\.md$/, '')}`)
  }

  // Deduplicate URLs
  return Array.from(new Set([...staticUrls, ...postUrls]))
}

async function submitToIndexNow() {
  console.log('🔍 Gathering site URLs for IndexNow submission...')
  const urls = await getSiteUrls()
  console.log(`📌 Found ${urls.length} URLs to submit:`)
  urls.forEach((url) => console.log(`   - ${url}`))

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  for (const endpoint of ENDPOINTS) {
    console.log(`\n🚀 Submitting to ${endpoint}...`)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok || res.status === 202) {
        console.log(`✅ Success! Response Status: ${res.status} (${res.statusText || 'Accepted'})`)
      } else {
        const text = await res.text()
        console.warn(`⚠️ Warning! Endpoint responded with ${res.status}: ${text}`)
      }
    } catch (err) {
      console.error(`❌ Error submitting to ${endpoint}:`, err.message)
    }
  }
}

submitToIndexNow()
