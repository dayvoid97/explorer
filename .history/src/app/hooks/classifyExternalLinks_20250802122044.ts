export function classifyExternalLink(url: string) {
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
