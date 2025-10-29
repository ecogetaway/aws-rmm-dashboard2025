/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  images: {
    unoptimized: true, // Required for static export
  },
  
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/aws-rmm-dashboard2025' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aws-rmm-dashboard2025/' : '',

  env: {
    NEXT_PUBLIC_APP_NAME: 'AWS RMM Hackathon',
    NEXT_PUBLIC_VERSION: '1.0.0',
  },
}

module.exports = nextConfig
