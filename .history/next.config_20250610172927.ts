/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    'http://192.168.1.167:3000', // <-- your phone or second machine accessing Next.js
  ],
}

export default nextConfig
