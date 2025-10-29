/** @type {import('next').NextConfig} */
// Support GitHub Pages when GITHUB_PAGES=true by setting basePath/assetPrefix
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const repoName = process.env.REPO_NAME || 'aws-rmm-dashboard2025'

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
  
  // Always set basePath for GitHub Pages (hardcoded for this repo)
  basePath: '/aws-rmm-dashboard2025',
  assetPrefix: '/aws-rmm-dashboard2025/',

  env: {
    NEXT_PUBLIC_APP_NAME: 'AWS RMM Hackathon',
    NEXT_PUBLIC_VERSION: '1.0.0',
  },
  
  // Static export optimizations
}

module.exports = nextConfig
