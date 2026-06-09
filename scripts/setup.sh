#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up MUSE development environment..."

cp -n backend/.env.example backend/.env 2>/dev/null || true
cp -n frontend/.env.example frontend/.env 2>/dev/null || true

cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
cd ..

cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo "   Run: npm run dev"
