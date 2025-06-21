import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this section to allow your device's IP
  allowedDevOrigins: [
    'http://192.168.1.167', // or whatever IP you're testing from
  ],
}

export default nextConfig
