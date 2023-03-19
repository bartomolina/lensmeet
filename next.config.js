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
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lens.infura-ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
