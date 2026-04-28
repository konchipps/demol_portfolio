$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

Write-Host ""
Write-Host "Portfolio local setup" -ForegroundColor Cyan
Write-Host "Repo:" $repoRoot
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed. Install Node.js LTS first, then run this script again."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is not available. Install Node.js LTS first, then run this script again."
}

$nodeVersion = (node -v).Trim()
Write-Host "Node version:" $nodeVersion

if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
  Write-Host "Created .env.local from .env.example" -ForegroundColor Green
} else {
  Write-Host ".env.local already exists, leaving it as-is" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Review .env.local if you need to change Firebase values."
Write-Host "2. Start the app with: npm run dev"
Write-Host "3. Open: http://127.0.0.1:5173"
Write-Host ""
Write-Host "Admin login uses Firebase Authentication for project portfolio-demol."
Write-Host "The repo does not store the admin password."
