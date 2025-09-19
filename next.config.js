/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations for development
  productionBrowserSourceMaps: false,
  reactStrictMode: false, // Disable in dev for faster startup
  swcMinify: true,
  
  images: {
    unoptimized: true, // Skip image optimization for faster dev builds
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_APP_NAME: 'AWS RMM Hackathon',
    NEXT_PUBLIC_VERSION: '1.0.0',
  },
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      // Enable faster refresh
      optimizePackageImports: ['lucide-react', 'recharts'],
    },
  }),
}

module.exports = nextConfig
