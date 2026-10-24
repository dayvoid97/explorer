/**
 * Research papers whose outbound clicks we track, keyed by SSRN abstract ID.
 * Links to these papers, and to their code repositories, are counted wherever
 * they appear on the site (see ResearchLinkTracker). Other SSRN papers are
 * still counted, under paper "other".
 */
export interface ResearchPaper {
  key: string
  title: string
  author: string
}

export const TRACKED_PAPERS: Record<string, ResearchPaper> = {
  '7502499': { key: 'cter', title: 'Conditional Tail Episode Risk', author: 'Niraj Neupane' },
  '7534899': { key: 'ster', title: 'Systemic Tail Episode Risk', author: 'Niraj Neupane' },
}

/** Code repositories that belong to a tracked paper, by GitHub "owner/repo". */
export const PAPER_REPOS: Record<string, string> = {
  'nirajneupane17/systemic-tail-episode-risk': '7534899',
}

export type PaperLink = {
  abstractId: string
  paper: string
  title: string
  destination: 'ssrn' | 'github'
}

/** Identify a research-paper link, or return null if the URL is not one. */
export function identifyPaperLink(href: string): PaperLink | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\./, '')

  if (host === 'papers.ssrn.com' || host === 'ssrn.com') {
    const id = url.searchParams.get('abstract_id') ?? url.searchParams.get('abstractid')
    if (!id) return null
    const known = TRACKED_PAPERS[id]
    return { abstractId: id, paper: known?.key ?? 'other', title: known?.title ?? '', destination: 'ssrn' }
  }

  if (host === 'github.com') {
    const repo = url.pathname.split('/').filter(Boolean).slice(0, 2).join('/').toLowerCase()
    const id = PAPER_REPOS[repo]
    if (!id) return null
    return { abstractId: id, paper: TRACKED_PAPERS[id].key, title: TRACKED_PAPERS[id].title, destination: 'github' }
  }

  return null
}
