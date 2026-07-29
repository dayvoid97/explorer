/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
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
