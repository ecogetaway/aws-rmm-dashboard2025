/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Static export configuration for Netlify
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  images: {
    unoptimized: true, // Required for static export
  },
  
  env: {
    NEXT_PUBLIC_APP_NAME: 'AWS RMM Hackathon',
    NEXT_PUBLIC_VERSION: '1.0.0',
  },
  
  // Disable server-side features for static export
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig
