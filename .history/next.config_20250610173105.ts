/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['http://192.168.1.167:3000'], // <-- your local device IP
}

export default nextConfig
