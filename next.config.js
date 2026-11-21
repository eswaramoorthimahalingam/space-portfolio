/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [{ source: '/admin', destination: '/', permanent: false }]
  },
}

module.exports = nextConfig
