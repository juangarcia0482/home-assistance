# Deployment Validation Script (PowerShell)
# Checks that all required deployment files are present and valid

Write-Host "🔍 Validating Deployment Package" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$deploymentPath = Split-Path -Parent $PSScriptRoot
$rootPath = Split-Path -Parent $deploymentPath

Set-Location $rootPath

$errors = 0

# Check core files
Write-Host "📋 Checking core files..." -ForegroundColor Yellow
$coreFiles = @("hacs.json", "VERSION", ".gitignore", "README.md", "configuration.yaml")
foreach ($file in $coreFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $errors++
    }
}

# Check deployment structure
Write-Host ""
Write-Host "📁 Checking deployment structure..." -ForegroundColor Yellow
$deploymentDirs = @("deployment\docs", "deployment\scripts", "deployment\templates")
foreach ($dir in $deploymentDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ $dir\" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing directory: $dir\" -ForegroundColor Red
        $errors++
    }
}

# Check documentation
Write-Host ""
Write-Host "📖 Checking documentation..." -ForegroundColor Yellow
$docFiles = @("deployment\docs\INSTALLATION.md", "deployment\docs\CONFIGURATION_TEMPLATE.md", "deployment\docs\info.md")
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $errors++
    }
}

# Check scripts
Write-Host ""
Write-Host "🔧 Checking scripts..." -ForegroundColor Yellow
$scriptFiles = @("deployment\scripts\setup.sh", "deployment\scripts\setup.ps1")
foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $errors++
    }
}

# Check templates
Write-Host ""
Write-Host "📄 Checking templates..." -ForegroundColor Yellow
$templateFiles = @("deployment\templates\secrets_template.yaml")
foreach ($file in $templateFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $errors++
    }
}

# Check HACS configuration
Write-Host ""
Write-Host "🔍 Validating HACS configuration..." -ForegroundColor Yellow
if (Test-Path "hacs.json") {
    try {
        $null = Get-Content "hacs.json" | ConvertFrom-Json
        Write-Host "✅ hacs.json is valid JSON" -ForegroundColor Green
    } catch {
        Write-Host "❌ hacs.json is invalid JSON" -ForegroundColor Red
        $errors++
    }
}

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
if ($errors -eq 0) {
    Write-Host "✅ Deployment validation passed!" -ForegroundColor Green
    Write-Host "📦 Package is ready for distribution" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment validation failed with $errors error(s)" -ForegroundColor Red
    Write-Host "🔧 Please fix the issues above before deploying" -ForegroundColor Red
    exit 1
}