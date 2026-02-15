/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/schemas'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig
