import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const SITE = 'https://financialgurkha.com'

// Routes that currently redirect to /winners, plus authenticated areas.
// Crawling these wastes budget and produces redirect errors in Search Console.
const DISALLOWED = [
  '/api/',
  '/login',
  '/signup',
  '/recover',
  '/profile',
  '/inbox',
  '/message',
  '/publicprofile',
  '/explorer',
  '/chronoW',
  '/chronology',
  '/companycard',
  '/spinthewheel',
]

/**
 * robots.txt served at /robots.txt.
 *
 * Note the explicit allow-list for AI crawlers. Answer engines (ChatGPT,
 * Perplexity, Claude, Gemini) will not cite content they cannot fetch, and
 * several of them respect a named user-agent block over the wildcard rule.
 * For a research publication that wants to be quoted as a source, being
 * readable by these agents is the whole GEO play — so they are named
 * explicitly rather than left to inherit the default.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED,
      },
      // Search engine crawlers — explicit for clarity.
      {
        userAgent: ['Googlebot', 'Googlebot-News', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot'],
        allow: '/',
        disallow: DISALLOWED,
      },
      // AI answer engines / retrieval agents. These are the GEO surface.
      {
        userAgent: [
          'GPTBot', // OpenAI training + browsing
          'OAI-SearchBot', // ChatGPT search
          'ChatGPT-User', // ChatGPT on-demand fetch
          'PerplexityBot',
          'Perplexity-User',
          'ClaudeBot',
          'Claude-User',
          'Claude-SearchBot',
          'anthropic-ai',
          'Google-Extended', // Gemini / AI Overviews grounding
          'Applebot',
          'Applebot-Extended',
          'CCBot', // Common Crawl — feeds many downstream models
          'Amazonbot',
          'meta-externalagent',
          'cohere-ai',
        ],
        allow: '/',
        disallow: DISALLOWED,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
