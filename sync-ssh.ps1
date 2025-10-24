# sync-via-ssh-vscode.ps1
# Sync files to Home Assistant via SSH using VS Code settings
# Now includes automatic Angular build before sync!

Write-Host "🏠 Syncing to Home Assistant via SSH..." -ForegroundColor Green

# Read settings from VS Code settings.json
$settingsPath = ".vscode\settings.json"
if (Test-Path $settingsPath) {
    $settings = Get-Content $settingsPath | ConvertFrom-Json
    $HAHost = $settings.'homeassistant.ssh.host'
    $HAUser = $settings.'homeassistant.ssh.user'
    $HAPassword = $settings.'homeassistant.ssh.password'
    $ConfigPath = $settings.'homeassistant.ssh.configPath'
}
else {
    Write-Host "ERROR: .vscode/settings.json not found" -ForegroundColor Red
    exit 1
}

# Build Angular App First
$angularAppPath = "dist\www\ui\light-control-app"
if (Test-Path $angularAppPath) {
    Write-Host "🔨 Building Angular app..." -ForegroundColor Cyan
    Set-Location $angularAppPath
    
    # Build the Angular app
    ng build --output-path="../light-control-dist"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Angular build successful!" -ForegroundColor Green
        
        # Copy built files to main UI directory
        Write-Host "📂 Copying built files to UI directory..." -ForegroundColor Cyan
        Copy-Item "..\\light-control-dist\\browser\\*" "..\\." -Recurse -Force
        
        # Clean up build directory
        Remove-Item "..\\light-control-dist" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Host "✅ Angular app updated!" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Angular build failed!" -ForegroundColor Red
        Set-Location $PSScriptRoot
        exit 1
    }
    
    # Return to original directory
    Set-Location $PSScriptRoot
}
else {
    Write-Host "⚠️  Angular app not found, skipping build..." -ForegroundColor Yellow
}

Write-Host "🌐 Syncing to Home Assistant..." -ForegroundColor Cyan
Write-Host "Host: $HAUser@$HAHost" -ForegroundColor Gray
Write-Host "Source: dist/" -ForegroundColor Gray
Write-Host "Target: $ConfigPath" -ForegroundColor Gray

# Copy files using SCP
Write-Host "📡 Uploading files via SSH..." -ForegroundColor Cyan
Write-Host "Password available in VS Code settings" -ForegroundColor Yellow
Write-Host "If prompted, use password: $HAPassword" -ForegroundColor Yellow

# Use scp (will prompt for password)
scp -o StrictHostKeyChecking=no -r dist/* $HAUser@${HAHost}:$ConfigPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 SUCCESS: Files synced via SSH!" -ForegroundColor Green
    Write-Host "🔗 Test at: http://homeassistant.local:8123/" -ForegroundColor Magenta
    Write-Host "🏠 Angular app: http://homeassistant.local:8123/local/ui/index.html" -ForegroundColor Magenta
}
else {
    Write-Host "❌ ERROR: File sync failed (exit code: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "Try entering password manually: $HAPassword" -ForegroundColor Yellow
}