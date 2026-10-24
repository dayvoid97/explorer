/*
 * Cover images for cards and listings.
 *
 * Covers are full-size originals (some 2–12 MB PNGs) shown at a few hundred
 * pixels wide. Local covers go through Next's image optimizer, which serves a
 * resized WebP/AVIF of a few dozen KB, cached after the first request. Covers
 * written as absolute financialgurkha.com URLs are treated as local.
 *
 * External covers (Reddit, SEC, BEA…) are not on the optimizer's allow-list and
 * some block hotlinking, so they are passed through as-is; callers should keep
 * a fallback for when they fail. SVGs are passed through too, as the optimizer
 * rejects them.
 */
const SITE_URL_RE = /^https?:\/\/(www\.)?financialgurkha\.com(?=\/)/

export function resolveCoverImage(raw: string | undefined | null): { src: string; optimize: boolean } | null {
  const s = String(raw ?? '').trim()
  if (!s) return null
  const local = s.startsWith('/') ? s : SITE_URL_RE.test(s) ? s.replace(SITE_URL_RE, '') : null
  if (local) return { src: local, optimize: !/\.svg(\?|$)/i.test(local) }
  if (/^https?:\/\//.test(s)) return { src: s, optimize: false }
  return null
}
