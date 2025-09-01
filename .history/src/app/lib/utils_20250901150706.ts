export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}

import { Win } from '../winners/page'

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function updateMetaTag(property: string, content: string) {
  if (typeof window === 'undefined') return // SSR check

  let tag = document.querySelector(
    `meta[property="${property}"], meta[name="${property}"]`
  ) as HTMLMetaElement

  if (!tag) {
    tag = document.createElement('meta')
    if (property.startsWith('twitter:')) {
      tag.name = property
    } else {
      tag.setAttribute('property', property)
    }
    document.head.appendChild(tag)
  }

  tag.content = content
}

export function updatePageMetadata(winData: Win) {
  if (typeof window === 'undefined') return // SSR check

  const title = winData.title
  const description = winData.paragraphs?.[0] || `A win by ${winData.username}: ${title}`
  const image = winData.previewImageUrl || winData.mediaUrls?.[0] || '/logo.png' // Use previewImageUrl or first media, fallback to logo
  const url = window.location.href

  // Update page title
  document.title = title

  // Update or create meta tags
  updateMetaTag('og:title', title)
  updateMetaTag('og:description', description)
  updateMetaTag('og:image', image)
  updateMetaTag('og:url', url)
  updateMetaTag('og:type', 'article')

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', image)
}
