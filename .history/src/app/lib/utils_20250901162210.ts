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
  const getWinImage = (winData: any): string => {
    if (winData.previewImageUrl) {
      return winData.previewImageUrl
    }
    if (winData.externalLink?.previewImage) {
      return winData.externalLink.previewImage
    }
    if (winData.mediaUrls?.length > 0) {
      for (let i = 0; i < winData.mediaUrls.length; i++) {
        const url = winData.mediaUrls[i]
        const mimeType = winData.mimeTypes?.[i]

        if (mimeType && mimeType.startsWith('image/')) {
          return url
        }

        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return url
        }
      }
    }

    return '/logo.png'
  }

  const image = getWinImage(winData)
  const absoluteImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`
  const url = window.location.href

  // Update page title
  document.title = title

  // Update or create meta tags
  updateMetaTag('og:title', title)
  updateMetaTag('og:description', description)
  updateMetaTag('og:image', absoluteImageUrl)
  updateMetaTag('og:url', url)
  updateMetaTag('og:type', 'article')

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', description)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', absoluteImageUrl)
}
