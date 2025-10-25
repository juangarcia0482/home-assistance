# Script to discover Home Assistant entities and generate mappings
param(
    [string]$HAUrl = "http://homeassistant.local:8123",
    [string]$Token = $null
)

# Get token from various sources
if (-not $Token) {
    if ($env:HA_TOKEN) {
        $Token = $env:HA_TOKEN
    } elseif (Test-Path "ha-config.json") {
        $config = Get-Content "ha-config.json" | ConvertFrom-Json
        $Token = $config.token
        $HAUrl = $config.url
    } else {
        Write-Host "❌ No HA token found! Please provide -Token parameter or set HA_TOKEN environment variable" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔍 Discovering Home Assistant Entities..." -ForegroundColor Green
Write-Host "URL: $HAUrl" -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$HAUrl/api/states" -Headers $headers -Method GET
    $lightEntities = $response | Where-Object { $_.entity_id -like "light.*" }
    
    Write-Host "✅ Found $($lightEntities.Count) light entities" -ForegroundColor Green
    Write-Host ""
    
    # Group by room/area
    $roomGroups = @{}
    
    foreach ($entity in $lightEntities) {
        $name = $entity.attributes.friendly_name.ToLower()
        $entityId = $entity.entity_id
        
        # Detect room
        $room = "unknown"
        if ($name -match "bedroom|master") { $room = "master-bedroom" }
        elseif ($name -match "guest") { $room = "guest-bedroom" }
        elseif ($name -match "living|lounge") { $room = "living-room" }
        elseif ($name -match "kitchen") { $room = "kitchen" }
        elseif ($name -match "office|study") { $room = "home-office" }
        elseif ($name -match "bathroom|bath") { $room = "bathroom" }
        elseif ($name -match "outdoor|patio|garden") { $room = "outdoor" }
        
        if (-not $roomGroups[$room]) { $roomGroups[$room] = @() }
        $roomGroups[$room] += $entity
    }
    
    # Display mapping
    Write-Host "🏠 DISCOVERED LIGHT ENTITIES BY ROOM:" -ForegroundColor Yellow
    Write-Host "====================================" -ForegroundColor Yellow
    
    foreach ($room in $roomGroups.Keys) {
        Write-Host ""
        Write-Host "📍 $($room.ToUpper()):" -ForegroundColor Cyan
        foreach ($entity in $roomGroups[$room]) {
            $brightness = if ($entity.attributes.brightness) { [math]::Round(($entity.attributes.brightness / 255) * 100) } else { 100 }
            $state = $entity.state -eq "on"
            Write-Host "   • $($entity.entity_id)" -ForegroundColor White
            Write-Host "     Name: $($entity.attributes.friendly_name)" -ForegroundColor Gray
            Write-Host "     State: $($entity.state) | Brightness: $brightness%" -ForegroundColor Gray
        }
    }
    
    # Generate TypeScript code
    Write-Host ""
    Write-Host "📝 GENERATED TYPESCRIPT CODE:" -ForegroundColor Yellow
    Write-Host "=============================" -ForegroundColor Yellow
    
    foreach ($room in $roomGroups.Keys) {
        if ($roomGroups[$room].Count -gt 0) {
            Write-Host ""
            Write-Host "// $($room.ToUpper()) LIGHTS:" -ForegroundColor Green
            foreach ($entity in $roomGroups[$room]) {
                $brightness = if ($entity.attributes.brightness) { [math]::Round(($entity.attributes.brightness / 255) * 100) } else { 100 }
                $state = if ($entity.state -eq "on") { "true" } else { "false" }
                $friendlyName = $entity.attributes.friendly_name -replace "'", "'"
                Write-Host "{ id: '$($entity.entity_id)', name: '$friendlyName', isOn: $state, brightness: $brightness }," -ForegroundColor White
            }
        }
    }
    
    Write-Host ""
    Write-Host "💡 Copy the generated TypeScript code above and replace the mock data in:" -ForegroundColor Yellow
    Write-Host "   dist\www\ui\light-control-app\src\app\services\smart-home-data.service.ts" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Failed to connect to Home Assistant: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your URL and token" -ForegroundColor Yellow
}