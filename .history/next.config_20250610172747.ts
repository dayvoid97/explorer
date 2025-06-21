import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this section to allow your device's IP
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}

export default nextConfig
