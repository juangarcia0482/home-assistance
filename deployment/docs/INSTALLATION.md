# Installation Instructions

## Prerequisites

Before installing this configuration, ensure you have:

1. **Home Assistant Core 2021.5+** installed
2. **HACS (Home Assistant Community Store)** installed
3. **Git** access to clone repositories

## Installation Methods

### Method 1: HACS Installation (Recommended)

#### Step 1: Add Custom Repository
1. **Open Home Assistant** and navigate to **HACS**
2. **Click on "Integrations"**
3. **Click the three dots** (⋮) in the top right corner
4. **Select "Custom repositories"**
5. **Add this repository:**
   - Repository URL: `https://github.com/juangarcia0482/home-assistance`
   - Category: `Integration`
   - Click **"Add"**

#### Step 2: Download Configuration
1. **Go back to HACS Integrations**
2. **Click "+ Explore & Download repositories"**
3. **Search for "Home Assistant Configuration - LAJV"**
4. **Click "Download this repository with HACS"**
5. **Home Assistant Configuration is now added to your HA setup**

#### Step 3: Run Setup Script
1. **Navigate to your Home Assistant config directory**
2. **Run the setup script:**
   - **Windows**: `.\deployment\scripts\setup.ps1`
   - **Linux/macOS**: `./deployment/scripts/setup.sh`
3. **Follow the prompts to complete initial setup**

#### Step 4: Restart Home Assistant
- Restart Home Assistant to apply the new configuration

### Method 2: Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/home-assistance.git
   ```

2. Copy the contents to your Home Assistant configuration directory

3. Install required custom components (if not using HACS):
   - Browser Mod
   - FullyKiosk Browser
   - Plex Recently Added
   - Spotcast
   - Xiaomi Cloud Map Extractor

## Required HACS Frontend Components

Install these through HACS → Frontend:

- **Card Mod**
- **Button Card** 
- **Config Template Card**
- **Bar Card**
- **Mini Graph Card**
- **Mini Media Player**
- **Simple Weather Card**
- **Light Entity Card**
- **Xiaomi Vacuum Map Card**
- **Spotify Card**
- **Upcoming Media Card**
- **Light Popup Card**
- **HomeKit Panel Card**

## Configuration Steps

### 1. Update Entity References

⚠️ **Important**: This configuration contains specific entity references that you must update:

1. **Light Entities**: Replace all `light.*` references with your actual light entity IDs
2. **Device IDs**: Update browser_mod device IDs in `configuration.yaml`
3. **IP Addresses**: Update Hue bridge and MQTT broker IPs
4. **Secrets**: Configure your `secrets.yaml` file

### 2. Hardware-Specific Configuration

Update these sections based on your hardware:

- **Philips Hue Bridge IP** in `configuration.yaml`
- **MQTT Broker settings** if you use MQTT
- **Xiaomi Robot configuration** if you have one
- **Spotify integration** credentials

### 3. Frontend Resources

The configuration includes custom frontend resources in the `/www/js/` directory:

- `buien-rain-card.js` - Custom rain forecast card
- `light-slider-card-lajv.js` - Custom light control
- `nightscout-card.js` - Nightscout integration
- Custom styling modifications

### 4. Mobile Configuration

A separate mobile-optimized dashboard is included in `ui-lovelace_mobile.yaml`.

## Customization

### Picture Elements Styling

This configuration heavily uses Picture Elements cards with custom CSS. You'll need:

1. **CSS Knowledge**: For position and styling adjustments
2. **Custom Images**: Replace floorplan images in `/www/ui/` with your own
3. **Resolution Scaling**: Adjust CSS for your display resolution

### Light Mapping

The 3D floorplan uses advanced light mapping. To customize:

1. Create your own floorplan images
2. Update light positions in the Lovelace configuration
3. Adjust CSS blend modes and positioning

## Troubleshooting

### Common Issues

1. **Missing Entities**: Update all entity references to match your setup
2. **Custom Cards Not Loading**: Ensure all HACS components are installed
3. **CSS Not Displaying**: Check browser compatibility and cache
4. **Light Mapping Issues**: Verify light entity names and states

### Support

This is a personal configuration shared for inspiration. Limited support is available, but you can:

1. Check the original repository issues
2. Refer to individual component documentation
3. Use Home Assistant community forums

## Credits

- Original configuration by Luke Vink
- Inspired by Mattias Persson's approach
- Uses various HACS community components
- Custom rain card for Netherlands Buienradar service

---

**Note**: This configuration is designed for specific hardware and use cases. Expect to spend time customizing it for your environment.