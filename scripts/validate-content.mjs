#!/usr/bin/env node
/**
 * Content validator for Financial Gurkha.
 *
 * Checks every blog post (src/app/blog/posts) and news brief
 * (src/app/news/items) against docs/content-spec.md, so the mechanical slips
 * that used to need a fix commit are caught before they ship: characters that
 * crash MDX, mixed date formats, broken image paths, hotlinked covers,
 * malformed sources, and so on.
 *
 *   npm run validate:content              all files; exit 1 on any error
 *   npm run validate:content -- --strict  warnings fail too
 *   npm run validate:content -- path/to/file.md [more.md]
 *
 * ERRORS break the page or the build and must be fixed before merging.
 * WARNINGS are house-style or quality issues worth fixing, and do not block.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'src/app/blog/posts')
const NEWS_DIR = path.join(ROOT, 'src/app/news/items')
const PUBLIC_DIR = path.join(ROOT, 'public')
const TIERS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/source-tiers.json'), 'utf8'))

const SITE_URL_RE = /^https?:\/\/(www\.)?financialgurkha\.com(?=\/)/
// Components the MDX renderers provide. Anything else capitalised crashes the page.
const ALLOWED_COMPONENTS = new Set(['Info', 'Paper', 'AdSenseInArticle'])
const ALLOWED_HTML = new Set(
  'a abbr b blockquote br caption cite code del details div em figcaption figure h1 h2 h3 h4 h5 h6 hr i img kbd li mark ol p pre q s small span strong sub summary sup table tbody td th thead tr u ul'.split(' ')
)
// The house format (60-second version / TOC / FAQ) applies to posts from here on.
const HOUSE_FORMAT_FROM = new Date(2026, 8, 20)
const MAX_TITLE = 70
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const only = args.filter((a) => !a.startsWith('--')).map((a) => path.resolve(a))

/* ---------------------------------------------------------------- helpers */

function parseDate(raw) {
  const s = String(raw ?? '').trim()
  let y, mo, d, iso
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) [mo, d, y, iso] = [+m[1], +m[2], +m[3], false]
  else if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) [y, mo, d, iso] = [+m[1], +m[2], +m[3], true]
  else return null
  const date = new Date(y, mo - 1, d)
  // JavaScript silently rolls 13/40 over into a later date; reject impossible ones.
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null
  return { date, iso }
}

/** Body text with fenced code blocks and inline code removed, line numbers kept. */
function proseOnly(body) {
  return body
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (code) => ' '.repeat(code.length))
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function tierOf(url) {
  let host
  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'invalid'
  }
  const matches = (list) => list.some((d) => host === d || host.endsWith('.' + d))
  if (matches(TIERS.tier1) || TIERS.tier1Patterns.some((p) => new RegExp(p).test(host))) return 'tier1'
  if (matches(TIERS.tier2)) return 'tier2'
  return 'tier3'
}

/** Resolve an image reference to a file in /public, or describe why it is not local. */
function imageStatus(ref) {
  const s = String(ref ?? '').trim()
  if (!s) return { kind: 'none' }
  const local = s.startsWith('/') ? s : SITE_URL_RE.test(s) ? s.replace(SITE_URL_RE, '') : null
  if (local) {
    const file = path.join(PUBLIC_DIR, decodeURIComponent(local.split(/[?#]/)[0]))
    if (!fs.existsSync(file)) return { kind: 'missing', path: local }
    return { kind: 'local', path: local, bytes: fs.statSync(file).size }
  }
  if (/^https?:\/\//.test(s)) return { kind: 'external', url: s }
  return { kind: 'relative', path: s }
}

/* ----------------------------------------------------------------- checks */

function checkBody(body, report) {
  const text = proseOnly(body)

  // "<40bp", "< 5%", "<=" — MDX reads "<" as the start of a tag and the page crashes.
  for (const m of text.matchAll(/<(?=[\d\s=$%.,-])/g)) {
    report.error(`line ${lineOf(text, m.index)}: "<" followed by "${text[m.index + 1] === ' ' ? 'space' : text[m.index + 1]}" crashes MDX — write "under", "below" or "less than"`)
  }

  for (const m of text.matchAll(/<\/?([A-Za-z][\w.]*)/g)) {
    const tag = m[1]
    const line = lineOf(text, m.index)
    if (/^[A-Z]/.test(tag)) {
      if (!ALLOWED_COMPONENTS.has(tag)) report.error(`line ${line}: unknown component <${tag}> crashes MDX (allowed: ${[...ALLOWED_COMPONENTS].join(', ')})`)
    } else if (!ALLOWED_HTML.has(tag.toLowerCase())) {
      report.warn(`line ${line}: unusual HTML tag <${tag}> — check it renders`)
    }
  }

  const opens = (text.match(/<Info\b/g) || []).length
  const closes = (text.match(/<\/Info>/g) || []).length
  if (opens !== closes) report.error(`<Info> opened ${opens} times but closed ${closes} times`)

  for (const m of text.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
    const line = lineOf(text, m.index)
    if (!m[1].trim()) report.warn(`line ${line}: image has no alt text`)
    const st = imageStatus(m[2])
    if (st.kind === 'relative') report.error(`line ${line}: relative image path "${m[2]}" breaks on the live page — use "/folder/file.png"`)
    if (st.kind === 'missing') report.error(`line ${line}: image not found in public/: ${st.path}`)
    if (st.kind === 'external') report.warn(`line ${line}: hotlinked image ${st.url} — copy it into public/`)
    if (st.kind === 'local' && st.bytes > MAX_IMAGE_BYTES) report.warn(`line ${line}: ${st.path} is ${(st.bytes / 1048576).toFixed(1)} MB — compress it`)
  }

  if (/^#\s/m.test(text)) report.warn('H1 ("# ") inside the body duplicates the page title — use frontmatter title and start sections at "##"')
}

function checkCover(image, report) {
  const st = imageStatus(image)
  if (st.kind === 'none') report.warn('no cover image — shares will fall back to the logo')
  if (st.kind === 'relative') report.error(`cover "${image}" is a relative path — use "/folder/file.jpg"`)
  if (st.kind === 'missing') report.error(`cover not found in public/: ${st.path}`)
  if (st.kind === 'external') report.warn(`cover is hotlinked (${st.url}) — copy it into public/ so it is optimized and cannot break`)
  if (st.kind === 'local' && /\.svg(\?|$)/i.test(st.path)) report.warn('cover is an SVG — social networks will not show it; use JPG or PNG')
  if (st.kind === 'local' && st.bytes > MAX_IMAGE_BYTES) report.warn(`cover ${st.path} is ${(st.bytes / 1048576).toFixed(1)} MB — compress it`)
}

function checkDate(raw, report) {
  const d = parseDate(raw)
  if (!d) {
    report.error(`date "${raw}" is not a valid MM/DD/YYYY date`)
    return null
  }
  if (d.iso) report.warn(`date "${raw}" uses YYYY-MM-DD — house format is MM/DD/YYYY`)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.date > tomorrow) report.warn(`date ${raw} is in the future`)
  return d.date
}

function checkBlog(file, data, body, report) {
  const slug = path.basename(file, '.md')
  for (const f of ['title', 'subtitle', 'date', 'author']) if (!data[f]) report.error(`missing frontmatter "${f}"`)
  if (!Array.isArray(data.categories) || data.categories.length === 0) report.error('missing frontmatter "categories" (a list)')
  if (data.title && data.title.length > MAX_TITLE) report.warn(`title is ${data.title.length} characters — Google cuts off around ${MAX_TITLE}`)
  if (data.subtitle && data.subtitle.length < 50) report.warn('subtitle is very short — it is the meta description')
  if (data.slug && data.slug !== slug) report.warn(`frontmatter slug "${data.slug}" differs from the filename — the URL is /blog/${slug}`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) report.warn(`filename "${slug}" is not a lowercase-hyphenated slug — it becomes the URL`)
  checkCover(data.image, report)
  const date = checkDate(data.date, report)
  if (date && date >= HOUSE_FORMAT_FROM) {
    if (!/^###\s+What's in this report/m.test(body)) report.warn('no "### What\'s in this report" table of contents')
    if (!/^##\s+Frequently Asked Questions\s*$/m.test(body)) report.warn('no "## Frequently Asked Questions" section (no FAQ data for search and AI answers)')
  }
  checkBody(body, report)
}

function checkNews(file, data, body, report) {
  for (const f of ['headline', 'dek', 'date']) if (!data[f]) report.error(`missing frontmatter "${f}"`)
  if (!Array.isArray(data.tags) || data.tags.length === 0) report.error('missing frontmatter "tags" (a list; the first is the kicker)')
  if (data.headline && data.headline.length > 110) report.warn(`headline is ${data.headline.length} characters — aim for under 110`)
  checkCover(data.image, report)
  checkDate(data.date, report)

  if (!Array.isArray(data.sources) || data.sources.length === 0) {
    report.error('missing frontmatter "sources" — every brief cites its sources')
  } else {
    let strong = 0
    data.sources.forEach((s, i) => {
      if (!s || typeof s !== 'object' || !s.name || !s.url) {
        report.error(`sources[${i}] must have both "name" and "url"`)
        return
      }
      const tier = tierOf(s.url)
      if (tier === 'invalid') report.error(`sources[${i}] url is not a valid URL: ${s.url}`)
      else if (tier === 'tier3') report.warn(`sources[${i}] is not on the Tier 1/2 list (${new URL(s.url).hostname}) — confirm it, or add the outlet to scripts/source-tiers.json`)
      else strong++
    })
    if (strong === 0) report.error('no Tier 1 or Tier 2 source — at least one is required')
  }
  checkBody(body, report)
}

/* -------------------------------------------------------------------- run */

function listMd(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f)) : []
}

const files = [...listMd(BLOG_DIR), ...listMd(NEWS_DIR)].filter((f) => only.length === 0 || only.includes(f))
let errors = 0
let warnings = 0

for (const file of files) {
  const rel = path.relative(ROOT, file)
  const found = { errors: [], warnings: [] }
  const report = { error: (m) => found.errors.push(m), warn: (m) => found.warnings.push(m) }

  let parsed
  try {
    parsed = matter(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    report.error(`frontmatter does not parse: ${e.message.split('\n')[0]}`)
  }
  if (parsed) {
    if (file.startsWith(BLOG_DIR)) checkBlog(file, parsed.data, parsed.content, report)
    else checkNews(file, parsed.data, parsed.content, report)
  }

  if (found.errors.length || found.warnings.length) {
    console.log(`\n${rel}`)
    for (const m of found.errors) console.log(`  ✖ ${m}`)
    for (const m of found.warnings) console.log(`  ⚠ ${m}`)
  }
  errors += found.errors.length
  warnings += found.warnings.length
}

console.log(`\nChecked ${files.length} file(s): ${errors} error(s), ${warnings} warning(s).`)
if (errors > 0 || (strict && warnings > 0)) process.exit(1)
