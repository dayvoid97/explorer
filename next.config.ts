const fs = require('node:fs')
const path = require('node:path')

// The Wall Street postcards on the homepage (see src/app/lib/street-photos.ts).
// Read here, once per build, because the functions that regenerate the homepage
// cannot see public/ on Vercel. Listed in captions.json first, then by name.
function streetPhotos() {
  const dir = path.join(__dirname, 'public', 'wall-street')
  if (!fs.existsSync(dir)) return []
  let captions: Record<string, { caption?: string; location?: string }> = {}
  try {
    captions = JSON.parse(fs.readFileSync(path.join(dir, 'captions.json'), 'utf8'))
  } catch {}
  const listed = Object.keys(captions)
  const files = fs
    .readdirSync(dir)
    .filter((f: string) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort((a: string, b: string) => {
      const ia = listed.indexOf(a)
      const ib = listed.indexOf(b)
      if (ia >= 0 || ib >= 0) return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib)
      return a.localeCompare(b, 'en', { numeric: true })
    })
  // "charging-bull-at-dawn.jpg" -> "Charging bull at dawn"; camera names (IMG_1234) get none
  const fromName = (f: string) => {
    const base = f.replace(/\.[^.]+$/, '')
    if (/^(img|dsc|dscf|pxl|photo|image|screenshot)[-_ ]?\d/i.test(base) || !/[a-z]{3}/i.test(base)) return ''
    const words = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
    return words.charAt(0).toUpperCase() + words.slice(1)
  }
  return files.map((f: string) => ({
    src: `/wall-street/${f}`,
    caption: captions[f]?.caption ?? fromName(f),
    location: captions[f]?.location ?? 'Financial District, New York',
  }))
}

/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    STREET_PHOTOS: JSON.stringify(streetPhotos()),
  },
  output: 'standalone',
  outputFileTracingIncludes: {
    '/blog': ['./src/app/blog/posts/**/*'], // Include posts for the blog route
    '/': ['./src/app/blog/posts/**/*'], // Include them if you also render on the home page
  },

  // Frontend-only mode: every route that talks to the API is blocked and
  // sent to /winners. Remove these redirects when the backend comes back.
  async redirects() {
    const blocked = [
      '/login',
      '/signup',
      '/recover',
      '/profile',
      '/explorer',
      '/inbox',
      '/message',
      '/chronoW',
      '/chronology',
      '/company',
      '/companycard',
      '/cryptodividend',
      '/genznepal',
      '/publicprofile',
      '/quotesearch',
      '/road-to-10k',
      '/spinthewheel',
      '/wins',
      '/winners/wincard',
      '/winners/date',
    ]

    return blocked.flatMap((route) => [
      { source: route, destination: '/winners', permanent: false },
      { source: `${route}/:path*`, destination: '/winners', permanent: false },
    ])
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gurkhaaws.s3.amazonaws.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'img.youtube.com', // ✅ Add this
        pathname: '/**',
      },
    ],
  },
}
