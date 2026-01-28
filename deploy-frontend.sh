#!/bin/bash
# 🚀 Frontend Deployment Script

echo "🔨 Building React Frontend..."
npm run build

echo ""
echo "✅ Build complete! Files in: my-react-app/dist/"
echo ""
echo "📦 Deployment Options:"
echo ""
echo "1️⃣  Vercel (Recommended - Fastest):"
echo "   cd my-react-app"
echo "   npm i -g vercel"
echo "   vercel --prod"
echo ""
echo "2️⃣  Netlify:"
echo "   cd my-react-app"
echo "   npm i -g netlify-cli"
echo "   netlify deploy --prod --dir=dist"
echo ""
echo "3️⃣  Manual Upload:"
echo "   Upload the 'dist' folder contents to your hosting provider"
echo ""
echo "⚠️  IMPORTANT: After deployment, update your frontend URL in:"
echo "   - Backend CORS settings (if needed)"
echo "   - Environment variables"
