/**
 * The site's feeds, linked from every page's <head> for feed-reader discovery.
 * Kept apart from feeds.ts so the root layout doesn't import the content loaders.
 */
export const FEEDS = [
  { path: '/rss.xml', title: 'Financial Gurkha — The Daily Brief' },
  { path: '/blog/rss.xml', title: 'Financial Gurkha — Research' },
  { path: '/feed.xml', title: 'Financial Gurkha — Everything' },
] as const

// Google's public WebSub hub: feed readers subscribed through it (Feedly,
// Inoreader, Google) get new items pushed instead of waiting for their next poll
export const WEBSUB_HUB = 'https://pubsubhubbub.appspot.com/'
