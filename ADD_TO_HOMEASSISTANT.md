# 🏠 How to Add This Repository to Home Assistant

This guide shows you exactly how to install this Home Assistant configuration through HACS.

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ **Home Assistant** running (version 2021.5+)
- ✅ **HACS** installed and configured ([Install HACS Guide](https://hacs.xyz/docs/setup/download))

## 🎯 Step-by-Step Installation

### Step 1: Open HACS in Home Assistant

1. **Log into your Home Assistant**
2. **Click on "HACS"** in the left sidebar
   - If you don't see HACS, it's not installed yet - [follow this guide](https://hacs.xyz/docs/setup/download)

### Step 2: Navigate to Integrations

1. **In HACS, click on "Integrations"** tab
   - This is where custom integrations and configurations are managed

### Step 3: Add Custom Repository

1. **Click the three dots (⋮)** in the top right corner of HACS
2. **Select "Custom repositories"** from the dropdown menu

### Step 4: Enter Repository Information

1. **In the "Add custom repository" dialog:**
   - **Repository URL**: `https://github.com/juangarcia0482/home-assistance`
   - **Category**: Select **"Integration"** from the dropdown
   - **Click "ADD"**

### Step 5: Find and Download the Configuration

1. **Go back to HACS → Integrations**
2. **Click "EXPLORE & DOWNLOAD REPOSITORIES"** (the big blue button)
3. **Search for**: `Home Assistant Configuration - LAJV`
4. **Click on the search result**
5. **Click "DOWNLOAD THIS REPOSITORY WITH HACS"**
6. **Click "DOWNLOAD"** to confirm

### Step 6: Initial Configuration Setup

After HACS downloads the repository:

1. **Navigate to your Home Assistant configuration folder**
   - Usually `/config` or `/homeassistant`
   - You can use the File Editor add-on or SSH

2. **Run the setup script** (choose your method):

   **Option A: Using File Editor Add-on**
   ```bash
   # Open Terminal in File Editor, then run:
   cd /config
   chmod +x deployment/scripts/setup.sh
   ./deployment/scripts/setup.sh
   ```

   **Option B: Manual Setup**
   ```bash
   # Copy the secrets template:
   cp deployment/templates/secrets_template.yaml secrets.yaml
   
   # Create known_devices.yaml:
   touch known_devices.yaml
   ```

### Step 7: Configure Your Settings

1. **Edit `secrets.yaml`** with your actual credentials:
   ```yaml
   mqtt_user_name: "your_actual_username"
   mqtt_password: "your_actual_password"
   spotify_client_id: "your_spotify_id"
   spotify_client_secret: "your_spotify_secret"
   ```

2. **Update `configuration.yaml`** with your network settings:
   - Replace `192.168.0.210` with your Hue bridge IP
   - Replace `192.168.0.248` with your MQTT broker IP
   - Update browser_mod device IDs

3. **Replace light entity names** throughout the configuration files with your actual light entities

### Step 8: Install Required Frontend Components

Install these through **HACS → Frontend**:

1. **Go to HACS → Frontend**
2. **Search and install each of these:**
   - Button Card
   - Card Mod
   - Config Template Card
   - Bar Card
   - Mini Graph Card
   - Mini Media Player
   - Simple Weather Card
   - Light Entity Card
   - Xiaomi Vacuum Map Card
   - Spotify Card
   - Upcoming Media Card
   - Light Popup Card
   - HomeKit Panel Card

### Step 9: Validate and Restart

1. **Check your configuration:**
   - Go to **Developer Tools → YAML → Check Configuration**
   - Fix any errors shown

2. **Restart Home Assistant:**
   - **Configuration → Server Controls → Restart**

3. **Verify the installation:**
   - The new Lovelace dashboard should load
   - Check that the 3D floorplan appears

## 🔧 Troubleshooting

### "Repository not found" Error
- **Check the URL**: Make sure you used `https://github.com/juangarcia0482/home-assistance`
- **Check category**: Make sure you selected "Integration" not "Plugin"

### "Entity not found" Errors
- **Light entities**: Replace all `light.table`, `light.living_room`, etc. with your actual light entity names
- **Check entity names**: Go to Developer Tools → States to see your available entities

### "HACS not loading the repository"
- **Refresh HACS**: Restart Home Assistant and check HACS again
- **Clear HACS cache**: Settings → Integrations → HACS → Configure → Reload

### Frontend Cards Not Loading
- **Install all required components**: See Step 8 above
- **Clear browser cache**: Hard refresh your browser (Ctrl+F5)

## 🎉 What You'll Get

After successful installation:
- ✨ **3D Dynamic Floorplan** with real-time light mapping
- 🏠 **Custom Picture Elements** UI approach
- 📱 **Mobile-optimized** dashboard
- 🤖 **Xiaomi Robot Vacuum** controls (if you have one)
- 🌤️ **Weather integration** with rain forecast
- 💡 **Advanced light controls** with hue and brightness mapping

## 📚 Additional Resources

- 📖 [Complete Installation Guide](deployment/docs/INSTALLATION.md)
- 🔧 [Configuration Template](deployment/docs/CONFIGURATION_TEMPLATE.md)
- 💬 [Create an Issue](https://github.com/juangarcia0482/home-assistance/issues) if you need help

---

**Need more help?** Create an issue in this repository with:
- Your Home Assistant version
- HACS version
- Error messages (if any)
- What step you're stuck on