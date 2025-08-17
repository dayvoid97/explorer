export interface ExternalLinkInfo {
  url: string
  type: 'channel' | 'content'
  platform: 'youtube' | 'tiktok' | 'other'
  previewImage?: string | null
}

export function classifyExternalLink(url: string): Omit<ExternalLinkInfo, 'url'> {
  const lower = url.toLowerCase()
  if (lower.includes('youtube.com/channel') || lower.includes('youtube.com/@')) {
    return { platform: 'youtube', type: 'channel' }
  }
  if (lower.includes('youtube.com/watch') || lower.includes('youtu.be')) {
    return { platform: 'youtube', type: 'content' }
  }
  if (lower.includes('tiktok.com/@') && !lower.includes('/video')) {
    return { platform: 'tiktok', type: 'channel' }
  }
  if (lower.includes('tiktok.com') && lower.includes('/video')) {
    return { platform: 'tiktok', type: 'content' }
  }
  return { platform: 'other', type: 'content' }
}

export function extractYouTubeThumbnail(url: string): string | null {
  let videoId = ''
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1)
    } else if (u.searchParams.has('v')) {
      videoId = u.searchParams.get('v') || ''
    } else if (u.pathname.includes('/embed/')) {
      videoId = u.pathname.split('/embed/')[1]
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  } catch {
    return null
  }
}
