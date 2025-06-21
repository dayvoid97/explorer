import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    'http://192.168.1.167', // or whatever device IP you're using
  ],
  /* config options here */
}

export default nextConfig
