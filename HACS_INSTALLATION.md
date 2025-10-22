# 📦 HACS Installation Guide

Follow these exact steps to install this Home Assistant configuration through HACS:

## Prerequisites
- ✅ Home Assistant Core 2021.5+ installed
- ✅ [HACS (Home Assistant Community Store)](https://hacs.xyz/) installed and configured

## Step-by-Step Installation

### 1️⃣ Add Custom Repository

1. **Open Home Assistant** in your browser
2. **Navigate to HACS**:
   - Sidebar → HACS
3. **Go to Integrations**:
   - Click on "**Integrations**" tab
4. **Open Custom Repositories**:
   - Click the **three dots** (⋮) in the top right corner
   - Select "**Custom repositories**"
5. **Add This Repository**:
   - Repository: `https://github.com/juangarcia0482/home-assistance`
   - Category: Select "**Integration**"
   - Click "**Add**"

### 2️⃣ Download Configuration

1. **Go Back to HACS Integrations**
2. **Browse Repositories**:
   - Click "**+ Explore & Download repositories**"
3. **Search and Install**:
   - Search for "**Home Assistant Configuration - LAJV**"
   - Click on the result
   - Click "**Download this repository with HACS**"
   - Confirm the download

### 3️⃣ Initial Setup (Easy Way)

After HACS downloads the repository, you need to set up a few files:

#### **Option A: Using Home Assistant File Editor (Easiest)**

1. **Install File Editor Add-on** (if you don't have it):
   - Go to **Settings** → **Add-ons** → **Add-on Store**
   - Search for "**File editor**" and install it
   - Start the File editor add-on

2. **Open File Editor**:
   - Go to **Settings** → **Add-ons** → **File editor** → **Open Web UI**

3. **Create your secrets file**:
   - In File Editor, navigate to the main folder
   - Find the folder `deployment/templates/`
   - **Right-click** on `secrets_template.yaml`
   - Select **"Copy"**
   - **Right-click** in the main folder (where configuration.yaml is)
   - Select **"Paste"**
   - **Rename** the copied file from `secrets_template.yaml` to `secrets.yaml`

4. **Edit the secrets.yaml file**:
   - **Double-click** on `secrets.yaml` to open it
   - **Replace the example values** with your real information:
     ```yaml
     # Change these to your real values:
     mqtt_user_name: "your_actual_mqtt_username"
     mqtt_password: "your_actual_mqtt_password"
     spotify_client_id: "your_real_spotify_id"
     spotify_client_secret: "your_real_spotify_secret"
     ```
   - **Save** the file (Ctrl+S)

#### **Option B: Using Terminal Add-on** (For advanced users)

1. **Install Terminal & SSH add-on** (if you don't have it)
2. **Open Terminal** and run these commands:
   ```bash
   cd /config
   cp deployment/templates/secrets_template.yaml secrets.yaml
   ```

#### **Important: Update Your Configuration**

You **MUST** change these settings or the configuration won't work:

1. **Edit `configuration.yaml`**:
   - Find this line: `host: 192.168.0.210` (Hue bridge)
   - **Change it** to your Hue bridge IP address
   - Find this line: `broker: 192.168.0.248` (MQTT)
   - **Change it** to your MQTT broker IP address

2. **Replace light names** throughout the configuration:
   - Find all mentions of `light.table`, `light.living_room`, etc.
   - **Replace them** with your actual light entity names
   - **Tip**: Go to **Developer Tools** → **States** to see your light names

### 4️⃣ Install Required Frontend Components

**You need to install these cards through HACS, or the dashboard won't work:**

1. **Go to HACS** → **Frontend** (not Integrations this time!)
2. **For each card below**, click "**Explore & Download repositories**" and search for it:

**Essential Cards** (install all of these):
- ✅ **Button Card** - Search: "button-card"
- ✅ **Card Mod** - Search: "lovelace-card-mod" 
- ✅ **Config Template Card** - Search: "config-template-card"
- ✅ **Bar Card** - Search: "bar-card"
- ✅ **Mini Graph Card** - Search: "mini-graph-card"
- ✅ **Mini Media Player** - Search: "mini-media-player"
- ✅ **Simple Weather Card** - Search: "simple-weather-card"
- ✅ **Light Entity Card** - Search: "light-entity-card"

**Optional Cards** (only if you have the hardware):
- **Xiaomi Vacuum Map Card** - (only if you have Xiaomi robot)
- **Spotify Card** - (only if you use Spotify)
- **Upcoming Media Card** - (only if you use Plex)
- **Light Popup Card** - Search: "light-popup-card"
- **HomeKit Panel Card** - Search: "homekit-panel-card"

### 5️⃣ Final Steps

1. **Check your configuration**:
   - Go to **Developer Tools** → **Check Configuration**
   - **Fix any red errors** that appear

2. **Restart Home Assistant**:
   - Go to **Settings** → **System** → **Restart**
   - Wait for Home Assistant to come back online

3. **Check if it worked**:
   - Your dashboard should now show the 3D floorplan
   - If you see errors, check the troubleshooting section below

## 🆘 Troubleshooting

### Common Issues:

**❌ "Entity not found" errors**
- **Solution**: Update all light entity names in configuration files to match your setup

**❌ "Frontend cards not loading"**
- **Solution**: Ensure all required HACS frontend components are installed

**❌ "MQTT not working"** 
- **Solution**: Update MQTT broker IP in `configuration.yaml` and credentials in `secrets.yaml`

**❌ "Hue bridge not found"**
- **Solution**: Update Hue bridge IP address in `configuration.yaml`

### Need Help?
- 📖 Read the [complete installation guide](deployment/docs/INSTALLATION.md)
- 📋 Check the [configuration template](deployment/docs/CONFIGURATION_TEMPLATE.md)
- 💬 Create an issue in this repository

---

**🎉 Enjoy your new 3D floorplan Home Assistant setup!**