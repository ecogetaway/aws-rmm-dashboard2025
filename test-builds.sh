#!/bin/bash

echo "🧪 Testing Build Configurations"
echo "================================"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Test 1: Vercel Build (SSR)
echo ""
echo "🚀 Testing Vercel Build (SSR)..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Vercel build successful!"
else
    echo "❌ Vercel build failed!"
    exit 1
fi

# Clean for next test
rm -rf .next

# Test 2: Netlify Build (Static Export)
echo ""
echo "🌐 Testing Netlify Build (Static Export)..."
npm run deploy:netlify
if [ $? -eq 0 ]; then
    echo "✅ Netlify build successful!"
    echo "📁 Static files generated in 'out' directory"
    ls -la out/ | head -10
else
    echo "❌ Netlify build failed!"
    exit 1
fi

echo ""
echo "🎉 All builds successful!"
echo "Ready for deployment on both platforms!"
