/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/lenslists/:path*',
        destination: 'https://lists.inlens.xyz/api/:path*',
      },
    ]
  },
  transpilePackages: ['@lens-protocol'],
}

module.exports = nextConfig
