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

### 3️⃣ Initial Setup

1. **Navigate to Config Directory**:
   - SSH into your Home Assistant or use File Editor
   - Go to your `/config` directory

2. **Run Setup Script**:
   ```bash
   # For Home Assistant OS/Container:
   cd /config
   chmod +x deployment/scripts/setup.sh
   ./deployment/scripts/setup.sh
   
   # Or manually create secrets.yaml:
   cp deployment/templates/secrets_template.yaml secrets.yaml
   ```

3. **Edit Configuration Files**:
   - **Required**: Edit `secrets.yaml` with your actual credentials
   - **Required**: Update IP addresses in `configuration.yaml`
   - **Required**: Replace light entity names with your own

### 4️⃣ Install Required Frontend Components

Install these through **HACS → Frontend**:

- ✅ **Button Card** 
- ✅ **Card Mod**
- ✅ **Config Template Card**
- ✅ **Bar Card**
- ✅ **Mini Graph Card**
- ✅ **Mini Media Player**
- ✅ **Simple Weather Card**
- ✅ **Light Entity Card**
- ✅ **Xiaomi Vacuum Map Card**
- ✅ **Spotify Card**
- ✅ **Upcoming Media Card**
- ✅ **Light Popup Card**
- ✅ **HomeKit Panel Card**

### 5️⃣ Final Steps

1. **Check Configuration**:
   - Developer Tools → Check Configuration
   - Fix any entity errors

2. **Restart Home Assistant**:
   - Configuration → Server Controls → Restart

3. **Verify Installation**:
   - Check that the new Lovelace dashboard loads
   - Test the 3D floorplan functionality

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