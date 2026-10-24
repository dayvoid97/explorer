'use client'

import { useEffect } from 'react'
import { track } from '@/app/lib/analytics'
import { identifyPaperLink } from '@/app/lib/research-papers'

/**
 * Counts clicks on research-paper links (SSRN, and the papers' code repos)
 * anywhere on the site: inside article text, "Read the research" boxes, paper
 * cards, author pages. One document-level listener instead of tagging each
 * link, so new articles are covered automatically.
 *
 * Event: research_paper_click
 *   paper        cter | ster | other
 *   paper_title  e.g. "Conditional Tail Episode Risk"
 *   abstract_id  SSRN abstract ID
 *   destination  ssrn | github
 *   placement    paper_card | inline
 *   page         path of the page the click came from
 *   link_text    the visible link text (first 80 characters)
 */
export function ResearchLinkTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Left click (click event) and middle click (auxclick, opening a new tab).
      if (e.type === 'auxclick' && e.button !== 1) return
      const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const link = identifyPaperLink(anchor.href)
      if (!link) return

      track('research_paper_click', {
        paper: link.paper,
        paper_title: link.title || undefined,
        abstract_id: link.abstractId,
        destination: link.destination,
        placement: anchor.closest('[data-paper-card]') ? 'paper_card' : 'inline',
        page: window.location.pathname,
        link_text: (anchor.textContent ?? '').trim().slice(0, 80) || undefined,
      })
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('auxclick', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('auxclick', onClick, true)
    }
  }, [])

  return null
}
