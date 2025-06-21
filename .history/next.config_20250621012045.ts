/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['http://192.168.1.206:3000', 'local-origin.dev', '*.local-origin.dev', '*'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gurkhaaws.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
}
