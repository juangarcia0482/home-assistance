# sync-via-ssh-vscode.ps1
# Sync files to Home Assistant via SSH using VS Code settings
# Now includes automatic Angular build before sync!

Write-Host "Syncing to Home Assistant via SSH..." -ForegroundColor Green

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
    Write-Host "Building Angular app..." -ForegroundColor Cyan
    $currentDir = Get-Location
    Set-Location $angularAppPath
    
    ng build --base-href="/local/ui/" --output-path="../light-control-dist"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Angular build successful!" -ForegroundColor Green
        
        # Clean old build files before copying new ones
        Write-Host "Cleaning old build files..." -ForegroundColor Yellow
        Remove-Item "../../js/angular/main-*.js" -Force -ErrorAction SilentlyContinue
        Remove-Item "../../js/angular/styles-*.css" -Force -ErrorAction SilentlyContinue
        Remove-Item "../../js/angular/polyfills-*.js" -Force -ErrorAction SilentlyContinue
        
        # Copy HTML files to ui directory
        Copy-Item "../light-control-dist/browser/index.html" "../." -Force
        Copy-Item "../light-control-dist/browser/favicon.ico" "../." -Force -ErrorAction SilentlyContinue
        
        # Copy JS/CSS files to js/angular directory (following the working pattern)
        New-Item -ItemType Directory -Path "../../js/angular" -Force | Out-Null
        Copy-Item "../light-control-dist/browser/main-*.js" "../../js/angular/" -Force
        Copy-Item "../light-control-dist/browser/styles-*.css" "../../js/angular/" -Force -ErrorAction SilentlyContinue
        Copy-Item "../light-control-dist/browser/polyfills-*.js" "../../js/angular/" -Force -ErrorAction SilentlyContinue
        
        # Update HTML file to reference correct paths for JS/CSS files
        Write-Host "Updating HTML file paths..." -ForegroundColor Cyan
        $indexPath = "../index.html"
        if (Test-Path $indexPath) {
            $htmlContent = Get-Content $indexPath -Raw
            
            # Update script src paths to point to /local/js/angular/
            $htmlContent = $htmlContent -replace 'src="(main-[^"]+\.js)"', 'src="/local/js/angular/$1"'
            $htmlContent = $htmlContent -replace 'src="(polyfills-[^"]+\.js)"', 'src="/local/js/angular/$1"'
            
            # Update CSS href paths to point to /local/js/angular/
            $htmlContent = $htmlContent -replace 'href="(styles-[^"]+\.css)"', 'href="/local/js/angular/$1"'
            
            # Write back the updated content
            Set-Content $indexPath -Value $htmlContent -NoNewline
            Write-Host "HTML file updated with correct asset paths!" -ForegroundColor Green
        }
        
        Remove-Item "../light-control-dist" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Angular app updated with JS files in js/angular directory!" -ForegroundColor Green
    }
    else {
        Write-Host "Angular build failed!" -ForegroundColor Red
        Set-Location $currentDir
        exit 1
    }
    
    Set-Location $currentDir
}
else {
    Write-Host "Angular app not found, skipping build..." -ForegroundColor Yellow
}

Write-Host "Syncing to Home Assistant..." -ForegroundColor Cyan
Write-Host "Host: $HAUser@$HAHost" -ForegroundColor Gray
Write-Host "Source: dist/" -ForegroundColor Gray
Write-Host "Target: $ConfigPath" -ForegroundColor Gray

# Copy files using SCP
Write-Host "Uploading files via SSH..." -ForegroundColor Cyan
Write-Host "Password available in VS Code settings" -ForegroundColor Yellow
Write-Host "If prompted, use password: $HAPassword" -ForegroundColor Yellow

# Use scp (will prompt for password)
scp -o StrictHostKeyChecking=no -r dist/* $HAUser@${HAHost}:$ConfigPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Files synced via SSH!" -ForegroundColor Green
    Write-Host "Test at: http://homeassistant.local:8123/" -ForegroundColor Magenta
    Write-Host "Angular app: http://homeassistant.local:8123/local/ui/index.html" -ForegroundColor Magenta
}
else {
    Write-Host "ERROR: File sync failed (exit code: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "Try entering password manually: $HAPassword" -ForegroundColor Yellow
}