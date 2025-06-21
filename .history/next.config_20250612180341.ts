/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['http://192.168.1.167:3000', 'local-origin.dev', '*.local-origin.dev', '*'],
}
