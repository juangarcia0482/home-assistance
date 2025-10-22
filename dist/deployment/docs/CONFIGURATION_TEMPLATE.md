# Configuration Template

This file contains the key settings you need to customize for your setup.

## Required Changes

### 1. Device IDs (configuration.yaml)
Update these browser_mod device IDs with your own:
```yaml
browser_mod:
  devices:
    YOUR_DEVICE_ID_1:
      name: mac_chrome
    YOUR_DEVICE_ID_2:
      name: tablet
```

### 2. Network Settings (configuration.yaml)
```yaml
hue:
  bridges:
    - host: YOUR_HUE_BRIDGE_IP  # Change from 192.168.0.210
      allow_unreachable: true
      
mqtt:
  broker: YOUR_MQTT_BROKER_IP  # Change from 192.168.0.248
  port: 1883
  username: !secret mqtt_user_name
  password: !secret mqtt_password
```

### 3. Secrets (secrets.yaml)
Create your secrets.yaml file with:
```yaml
# MQTT
mqtt_user_name: your_mqtt_username
mqtt_password: your_mqtt_password

# Spotify (if using)
spotify_client_id: your_spotify_client_id
spotify_client_secret: your_spotify_client_secret

# Other integrations
# Add your other secret values here
```

### 4. Light Entities
Throughout the configuration files, replace these example entities with your own:
- `light.table` → `light.your_table_light`
- `light.living_room` → `light.your_living_room_light`
- And all other light references

### 5. Floorplan Images
Replace the custom floorplan images in `/www/ui/` with your own:
- Create your floorplan in an image editor
- Export individual light overlay images
- Update the picture-elements configuration with new image paths

## Optional Customizations

### Custom Cards
The configuration includes these custom cards that you may want to modify:
- `buien-rain-card.js` - Netherlands specific, may not be useful elsewhere
- `light-slider-card-lajv.js` - Custom styled light controls
- `nightscout-card.js` - Diabetes monitoring, only needed if you use Nightscout

### Hardware-Specific Components
Remove or modify these if you don't have the hardware:
- Xiaomi Robot Vacuum integration
- Fully Kiosk Browser integration
- Plex integration
- Spotcast integration

## Validation Steps

After customization:
1. Check Configuration → Check Configuration in Home Assistant
2. Fix any entity errors
3. Restart Home Assistant
4. Check logs for any remaining issues
5. Test the UI on your devices

## Getting Help

1. Read the [INSTALLATION.md](INSTALLATION.md) guide
2. Check Home Assistant Community Forum
3. Review component-specific documentation
4. Create an issue in this repository (limited support)