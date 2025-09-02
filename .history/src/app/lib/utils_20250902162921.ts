export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}

import { Win } from '../winners/page'

// Updated interfaces based on your actual structure
export interface CardItem {
  title: string
  description?: string
  type: string
  mimeType?: string
  externalLink?: string
  paragraphs?: string[]
  content?: string
  categories?: string
  unitId?: string
  uploadedAt?: string
  viewCount?: number
  saveCount?: number
  signedUrl?: string
}

export interface PublicCard {
  cardId: string
  cardTicker: string
  companyName: string
  username: string
  createdAt: string
  items: CardItem[]
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

// Generic image extraction for any content type
function getContentImage(data: any): string {
  // Check for direct preview image
  if (data.previewImageUrl) {
    return data.previewImageUrl
  }

  // Check external link preview
  if (data.externalLink?.previewImage) {
    return data.externalLink.previewImage
  }

  // For wins - check media URLs array
  if (data.mediaUrls?.length > 0) {
    for (let i = 0; i < data.mediaUrls.length; i++) {
      const url = data.mediaUrls[i]
      const mimeType = data.mimeTypes?.[i]

      if (mimeType && mimeType.startsWith('image/')) {
        return url
      }

      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return url
      }
    }
  }

  // For cards - check items array
  if (data.items?.length > 0) {
    for (const item of data.items) {
      // Check if item has an image mime type and signed URL
      if (item.mimeType?.startsWith('image/') && item.signedUrl) {
        return item.signedUrl
      }

      // Check if signedUrl looks like an image
      if (item.signedUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return item.signedUrl
      }
    }
  }

  // For individual card items - check if it's an image
  if (data.mimeType?.startsWith('image/') && data.signedUrl) {
    return data.signedUrl
  }

  // Default fallback
  return '/logo.png'
}

// Original win metadata function
export function updatePageMetadata(winData: Win) {
  if (typeof window === 'undefined') return // SSR check

  const title = winData.title
  const description = winData.paragraphs?.[0] || `A win by ${winData.username}: ${title}`
  const image = getContentImage(winData)
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
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', absoluteImageUrl)
}

// Full card metadata update
export function updateCardMetadata(cardData: PublicCard) {
  if (typeof window === 'undefined') return // SSR check

  const title = `${cardData.companyName} (${cardData.cardTicker}) - Company Card`

  // Create description from first item with content
  let description = `Company card for ${cardData.companyName}`
  if (cardData.items?.length > 0) {
    const firstItemWithContent = cardData.items.find(
      (item) => item.description || item.content || item.paragraphs?.[0]
    )
    if (firstItemWithContent) {
      description =
        firstItemWithContent.description ||
        firstItemWithContent.content?.substring(0, 160) ||
        firstItemWithContent.paragraphs?.[0]?.substring(0, 160) ||
        description
    }
  }

  const image = getContentImage(cardData)
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
  updateMetaTag('og:site_name', 'Your Site Name') // Replace with your actual site name

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', absoluteImageUrl)

  // Additional card-specific meta tags
  updateMetaTag('article:author', `@${cardData.username}`)
  updateMetaTag('og:article:author', `@${cardData.username}`)
  updateMetaTag('article:published_time', cardData.createdAt)
}

// Individual card item metadata update
export function updateCardItemMetadata(cardData: PublicCard, itemIndex: number, item?: CardItem) {
  if (typeof window === 'undefined') return // SSR check

  const targetItem = item || cardData.items[itemIndex]
  if (!targetItem) return

  const title = `${targetItem.title} | ${cardData.companyName} (${cardData.cardTicker})`

  const description =
    targetItem.description ||
    targetItem.content?.substring(0, 160) ||
    targetItem.paragraphs?.[0]?.substring(0, 160) ||
    `${targetItem.title} from ${cardData.companyName}'s company card by @${cardData.username}`

  const image =
    getContentImage(targetItem) !== '/logo.png'
      ? getContentImage(targetItem)
      : getContentImage(cardData) // Fallback to card image

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
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', absoluteImageUrl)

  // Additional item-specific meta tags
  updateMetaTag('article:author', `@${cardData.username}`)
  updateMetaTag('og:article:author', `@${cardData.username}`)
  if (targetItem.categories) {
    updateMetaTag('article:tag', targetItem.categories)
  }
  if (targetItem.uploadedAt) {
    updateMetaTag('article:published_time', targetItem.uploadedAt)
  }
}

// Helper function to generate card URLs
export function generateCardUrls(cardData: PublicCard) {
  const baseSlug = createSlug(cardData.companyName)

  return {
    // Full card URL
    cardUrl: `/company/${cardData.cardId}/${baseSlug}`,

    // Individual item URLs
    itemUrls: cardData.items.map((item, index) => ({
      itemIndex: index,
      itemSlug: createSlug(item.title),
      url: `/company/${cardData.cardId}/${baseSlug}/item/${index}/${createSlug(item.title)}`,
      item,
    })),
  }
}

// Generic content metadata updater
export function updateContentMetadata(
  contentData: Win | PublicCard,
  contentType: 'win' | 'card',
  itemIndex?: number
) {
  switch (contentType) {
    case 'win':
      updatePageMetadata(contentData as Win)
      break
    case 'card':
      if (itemIndex !== undefined && itemIndex >= 0) {
        updateCardItemMetadata(contentData as PublicCard, itemIndex)
      } else {
        updateCardMetadata(contentData as PublicCard)
      }
      break
    default:
      console.warn('Unknown content type for metadata update:', contentType)
  }
}
