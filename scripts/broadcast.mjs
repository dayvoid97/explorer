#!/usr/bin/env node
/**
 * Broadcast new and updated content once it is live on financialgurkha.com.
 *
 *   - IndexNow (api.indexnow.org): Bing, Yandex, Naver, Seznam, Yep and the other
 *     IndexNow engines recrawl the changed URLs within minutes.
 *   - WebSub (pubsubhubbub.appspot.com): feed readers and aggregators subscribed
 *     to our RSS feeds get the new items pushed instead of waiting to poll.
 *
 * Google has no ping: it reads /sitemap.xml (submitted in Search Console), and
 * the accurate lastmod dates there are what tell it what changed.
 *
 * Runs automatically from .github/workflows/broadcast.yml after every
 * successful production deploy, with the content files that deploy changed.
 *
 *   node scripts/broadcast.mjs --files changed.txt   # lines like "A\tsrc/app/news/items/<slug>.md"
 *   node scripts/broadcast.mjs --hours 48            # everything the sitemaps say changed in 48 hours
 *   node scripts/broadcast.mjs --hours 48 --dry-run  # show what would be sent
 */
import fs from 'node:fs'

const SITE = 'https://financialgurkha.com'
const HOST = 'financialgurkha.com'
// IndexNow keys are public by design: engines verify ownership by fetching this file
const INDEXNOW_KEY = 'a3f89e2c1d4b7f05e6a98b2c4d1e3f7a'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const WEBSUB_HUB = 'https://pubsubhubbub.appspot.com/'
// Same list as src/app/lib/feed-links.ts
const FEEDS = ['/rss.xml', '/blog/rss.xml', '/feed.xml']

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const dryRun = args.includes('--dry-run')
const summary = []
const say = (line) => {
  console.log(line)
  summary.push(line)
}

const CONTENT = [
  { dir: 'src/app/news/items/', path: '/news/', front: '/news' },
  { dir: 'src/app/blog/posts/', path: '/blog/', front: '/blog' },
]

// Changed content files -> page URLs, plus the pages that list them
function urlsFromFiles(listFile) {
  const changed = []
  const fronts = new Set()
  for (const line of fs.readFileSync(listFile, 'utf8').split('\n')) {
    const [status, ...rest] = line.trim().split(/\s+/)
    const file = rest.at(-1) // renames list old and new paths; the new one is last
    if (!file || !file.endsWith('.md')) continue
    const section = CONTENT.find((c) => file.startsWith(c.dir))
    if (!section) continue
    const slug = file.slice(section.dir.length, -3)
    changed.push({ url: `${SITE}${section.path}${slug}`, removed: status === 'D' })
    fronts.add(section.front)
  }
  if (fronts.size) for (const front of [...fronts, '/', '/links']) changed.push({ url: front === '/' ? SITE : `${SITE}${front}`, removed: false })
  return changed
}

// Everything the live sitemaps date within the last N hours
async function urlsFromSitemaps(hours) {
  const cutoff = new Date(Date.now() - hours * 3_600_000).toISOString().slice(0, 10)
  const index = await (await fetch(`${SITE}/sitemap.xml`)).text()
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !u.endsWith('/news-sitemap.xml'))
  const urls = []
  for (const child of children) {
    const xml = await (await fetch(child)).text()
    for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]
      const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]
      if (loc && lastmod && lastmod.slice(0, 10) >= cutoff) urls.push({ url: loc.replace(/&amp;/g, '&'), removed: false })
    }
  }
  return urls
}

async function isLive(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual' })
    return res.status === 200
  } catch {
    return false
  }
}

async function indexNow(urlList) {
  const key = await fetch(`${SITE}/${INDEXNOW_KEY}.txt`).then((r) => (r.ok ? r.text() : ''))
  if (key.trim() !== INDEXNOW_KEY) throw new Error(`IndexNow key file ${SITE}/${INDEXNOW_KEY}.txt is missing or wrong`)
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList }),
  })
  // 200 = received, 202 = received and key validation pending
  if (res.status !== 200 && res.status !== 202) throw new Error(`IndexNow answered ${res.status}: ${await res.text()}`)
  return res.status
}

async function websub(feed) {
  const res = await fetch(WEBSUB_HUB, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ 'hub.mode': 'publish', 'hub.url': `${SITE}${feed}` }),
  })
  return res.status // 204 = accepted
}

const candidates = opt('files') ? urlsFromFiles(opt('files')) : await urlsFromSitemaps(Number(opt('hours') || 48))
const unique = [...new Map(candidates.map((c) => [c.url, c])).values()]
if (!unique.length) {
  say('Nothing new to broadcast.')
} else {
  // Removed pages are announced too, so engines drop them; everything else must be live first
  const urls = []
  for (const c of unique) {
    if (c.removed || (await isLive(c.url))) urls.push(c.url)
    else say(`Skipped (not live yet): ${c.url}`)
  }
  say(`${urls.length} URL(s):`)
  urls.forEach((u) => say(`- ${u}`))

  if (dryRun) {
    say('\nDry run: nothing sent.')
  } else {
    if (urls.length) say(`\nIndexNow: ${await indexNow(urls)}`)
    for (const feed of FEEDS) say(`WebSub ${feed}: ${await websub(feed)}`)
  }
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Broadcast\n\n${summary.join('\n')}\n`)
}
