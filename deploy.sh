#!/bin/bash

# Daily Vibes Rewards - Quick Deploy Script
# This script helps you deploy your app quickly

set -e

echo "🎵 Daily Vibes Rewards - Deployment Script"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please edit it with your values:"
        echo "   - VITE_WALLETCONNECT_PROJECT_ID"
        echo "   - VITE_REWARDS_CONTRACT_ADDRESS"
        echo ""
        echo "Press Enter after updating .env file..."
        read
    else
        echo "❌ No .env.example found!"
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building production app..."
npm run build

# Check if build succeeded
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "📁 Your production app is in: ./dist"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Deploy to Vercel:"
echo "   npm i -g vercel"
echo "   vercel"
echo ""
echo "2️⃣  Deploy to Netlify:"
echo "   npm i -g netlify-cli"
echo "   netlify deploy --prod --dir=dist"
echo ""
echo "3️⃣  Deploy to GitHub Pages:"
echo "   npm install --save-dev gh-pages"
echo "   npx gh-pages -d dist"
echo ""
echo "4️⃣  Or manually upload ./dist to any static host"
echo ""
echo "🚀 See DEPLOYMENT.md for detailed instructions!"
echo ""
