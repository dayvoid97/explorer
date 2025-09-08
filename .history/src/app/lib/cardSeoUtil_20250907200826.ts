// utils/cardSeoUtils.ts
import { PublicCard, CardItem } from '@/app/hooks/usePublicCard'

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createCardSlug(companyName: string, cardTicker?: string): string {
  const baseSlug = createSlug(companyName)
  if (cardTicker) {
    const tickerSlug = createSlug(cardTicker)
    return `${baseSlug}-${tickerSlug}`
  }
  return baseSlug
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

export function generateCardDescription(card: PublicCard): string {
  // Try to get description from the first item with content
  for (const item of card.items) {
    if (item.description) {
      return item.description
    }
    if (item.paragraphs && item.paragraphs.length > 0) {
      return item.paragraphs[0]
    }
    if (item.content) {
      // Truncate content if it's too long
      return item.content.length > 160 ? item.content.substring(0, 157) + '...' : item.content
    }
  }

  // Fallback description
  return `Explore ${card.companyName} - Company information and resources shared by @${card.username}`
}

export function getCardImage(card: PublicCard): string {
  // Look for the first image in card items
  for (const item of card.items) {
    if (item.mimeType && item.mimeType.startsWith('image/') && item.signedUrl) {
      return item.signedUrl
    }
  }

  // Look for external link preview images (if you add this feature later)
  for (const item of card.items) {
    if (item.externalLink) {
      // You could potentially fetch og:image from external links
      // For now, we'll use a fallback
    }
  }

  // Default fallback image
  return '/logo.png'
}

export function generateCardTitle(card: PublicCard): string {
  const itemTitles = card.items
    .filter((item) => item.title && item.title.trim())
    .map((item) => item.title.trim())

  if (itemTitles.length > 0) {
    const primaryTitle = itemTitles[0]
    if (itemTitles.length > 1) {
      return `${card.companyName}: ${primaryTitle} and ${itemTitles.length - 1} more`
    }
    return `${card.companyName}: ${primaryTitle}`
  }

  return `${card.companyName} - Company Card`
}

export function updateCardMetadata(card: PublicCard) {
  if (typeof window === 'undefined') return // SSR check

  const title = generateCardTitle(card)
  const description = generateCardDescription(card)
  const image = getCardImage(card)
  const absoluteImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`
  const url = window.location.href

  // Update page title
  document.title = title

  // Open Graph tags
  updateMetaTag('og:title', title)
  updateMetaTag('og:description', description)
  updateMetaTag('og:image', absoluteImageUrl)
  updateMetaTag('og:url', url)
  updateMetaTag('og:type', 'article')
  updateMetaTag('og:site_name', 'YourSiteName') // Replace with your actual site name

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', absoluteImageUrl)

  // Additional SEO meta tags
  updateMetaTag('description', description)

  // Schema.org structured data (optional but recommended)
  updateStructuredData(card, title, description, absoluteImageUrl, url)
}

export function updateStructuredData(
  card: PublicCard,
  title: string,
  description: string,
  imageUrl: string,
  url: string
) {
  if (typeof window === 'undefined') return

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]#card-schema')
  if (existingScript) {
    existingScript.remove()
  }

  // Create new structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: card.companyName,
    description: description,
    url: url,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: card.username,
    },
    dateCreated: card.createdAt,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: card.items.length,
      itemListElement: card.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        description: item.description || item.content?.substring(0, 160),
      })),
    },
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'card-schema'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

// Helper function to generate SEO-friendly URLs
export function generateCardUrl(card: PublicCard, baseUrl: string = ''): string {
  const slug = createCardSlug(card.companyName, card.cardTicker)
  return `${baseUrl}/company/${card.cardId}/${slug}`
}

// Helper function for canonical URL
export function updateCanonicalUrl(card: PublicCard) {
  if (typeof window === 'undefined') return

  const canonicalUrl = generateCardUrl(card, window.location.origin)

  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    document.head.appendChild(canonicalLink)
  }

  canonicalLink.href = canonicalUrl
}
