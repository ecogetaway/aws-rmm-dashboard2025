/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    unoptimized: true,
  },
  
  env: {
    NEXT_PUBLIC_APP_NAME: 'AWS RMM Hackathon',
    NEXT_PUBLIC_VERSION: '1.0.0',
  },
}

module.exports = nextConfig
