# sync-via-ssh-vscode.ps1
# Sync files to Home Assistant via SSH using VS Code settings

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

Write-Host "Host: $HAUser@$HAHost" -ForegroundColor Gray
Write-Host "Source: dist/" -ForegroundColor Gray
Write-Host "Target: $ConfigPath" -ForegroundColor Gray

# Copy files using SCP
Write-Host "Copying files..." -ForegroundColor Cyan
Write-Host "Password available in VS Code settings" -ForegroundColor Yellow
Write-Host "If prompted, use password: $HAPassword" -ForegroundColor Yellow

# Use scp (will prompt for password)
scp -o StrictHostKeyChecking=no -r dist/* $HAUser@${HAHost}:$ConfigPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Files synced via SSH!" -ForegroundColor Green
    Write-Host "Test at: http://homeassistant.local:8123/" -ForegroundColor Magenta
}
else {
    Write-Host "ERROR: File sync failed (exit code: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "Try entering password manually: $HAPassword" -ForegroundColor Yellow
}