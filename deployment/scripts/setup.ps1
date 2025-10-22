# Home Assistant Configuration Setup Script (PowerShell)
# This script helps set up the configuration for first-time users

Write-Host "🏠 Home Assistant Configuration Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Determine if we're running from deployment folder or root
$deploymentPath = Split-Path -Parent $PSScriptRoot
$rootPath = Split-Path -Parent $deploymentPath

# Check if we can find configuration.yaml
if (Test-Path "$rootPath\configuration.yaml") {
    Set-Location $rootPath
    Write-Host "📍 Found configuration in: $rootPath" -ForegroundColor Green
} elseif (Test-Path "configuration.yaml") {
    Write-Host "📍 Using current directory" -ForegroundColor Green
} else {
    Write-Host "❌ Error: configuration.yaml not found. Please run this script from the Home Assistant configuration directory or the deployment scripts folder." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Setting up configuration files..." -ForegroundColor Yellow

# Create secrets.yaml if it doesn't exist
if (!(Test-Path "secrets.yaml")) {
    Write-Host "📝 Creating secrets.yaml from template..." -ForegroundColor Green
    if (Test-Path "$deploymentPath\templates\secrets_template.yaml") {
        Copy-Item "$deploymentPath\templates\secrets_template.yaml" "secrets.yaml"
    } elseif (Test-Path "deployment\templates\secrets_template.yaml") {
        Copy-Item "deployment\templates\secrets_template.yaml" "secrets.yaml"
    } else {
        Write-Host "⚠️  Could not find secrets template. Please copy deployment/templates/secrets_template.yaml to secrets.yaml manually." -ForegroundColor Yellow
    }
    Write-Host "✅ secrets.yaml created. Please edit this file with your actual credentials." -ForegroundColor Green
} else {
    Write-Host "⚠️  secrets.yaml already exists. Skipping..." -ForegroundColor Yellow
}

# Create known_devices.yaml if it doesn't exist
if (!(Test-Path "known_devices.yaml")) {
    Write-Host "📝 Creating empty known_devices.yaml..." -ForegroundColor Green
    "# Known devices will be populated automatically by Home Assistant" | Out-File -FilePath "known_devices.yaml" -Encoding UTF8
    Write-Host "✅ known_devices.yaml created." -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit secrets.yaml with your actual credentials"
Write-Host "2. Update IP addresses in configuration.yaml"
Write-Host "3. Replace light entity names with your own entities"
Write-Host "4. Install required HACS components (see INSTALLATION.md)"
Write-Host "5. Restart Home Assistant"
Write-Host ""
Write-Host "📖 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - deployment/docs/INSTALLATION.md"
Write-Host "   - deployment/docs/CONFIGURATION_TEMPLATE.md"
Write-Host ""
Write-Host "✨ Setup complete! Happy automating!" -ForegroundColor Green