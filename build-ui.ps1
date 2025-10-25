# Build script for Home Assistant UI with token injection
param(
    [string]$Token = $null
)

Write-Host "🏠 Building Home Assistant UI..." -ForegroundColor Green

# Change to the Angular app directory
Set-Location "dist\www\ui\light-control-app"

# Set the HA_TOKEN environment variable if provided
if ($Token) {
    $env:HA_TOKEN = $Token
    Write-Host "✅ Using provided HA token" -ForegroundColor Green
} elseif (Test-Path "..\..\..\..\ha-config.json") {
    Write-Host "✅ Using token from ha-config.json" -ForegroundColor Green
} elseif ($env:HA_TOKEN) {
    Write-Host "✅ Using token from environment variable" -ForegroundColor Green
} else {
    Write-Host "❌ No HA token found!" -ForegroundColor Red
    Write-Host "Please either:" -ForegroundColor Yellow
    Write-Host "  1. Set HA_TOKEN environment variable" -ForegroundColor Yellow
    Write-Host "  2. Create ha-config.json from ha-config.json.example" -ForegroundColor Yellow
    Write-Host "  3. Pass token as parameter: .\build-ui.ps1 -Token 'your_token'" -ForegroundColor Yellow
    exit 1
}

# Run the build with token injection
npm run build:ha

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
    Write-Host "📁 Output files:" -ForegroundColor Cyan
    Get-ChildItem "dist\browser" | ForEach-Object { Write-Host "   $($_.Name)" -ForegroundColor White }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}