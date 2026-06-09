Write-Host "Setting up MUSE development environment..." -ForegroundColor Cyan

if (-not (Test-Path "backend\.env")) { Copy-Item "backend\.env.example" "backend\.env" }
if (-not (Test-Path "frontend\.env")) { Copy-Item "frontend\.env.example" "frontend\.env" }

Set-Location backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
Set-Location ..

Set-Location frontend
npm install
Set-Location ..

Write-Host "Setup complete! Run: npm run dev" -ForegroundColor Green
