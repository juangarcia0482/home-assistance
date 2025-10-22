# 📥 Simple Download & Install Guide

**HACS doesn't work well for this - use direct download instead!**

## 🎯 **Super Easy Steps**

### **1. Download**
- **Go to:** https://github.com/juangarcia0482/home-assistance
- **Click:** Green **"Code"** button → **"Download ZIP"**
- **Save** the file to your computer

### **2. Extract**
- **Find** the downloaded `home-assistance-main.zip` file
- **Extract/Unzip** it (you'll get a folder called `home-assistance-main`)

### **3. Backup Your Current Setup**
- **In Home Assistant:** Settings → System → Backups
- **Create** a full backup (just in case!)

### **4. Copy Files to Home Assistant**

**Easy method using File Editor:**

1. **Open File Editor** in Home Assistant
2. **Backup your current config:**
   - Right-click `configuration.yaml` → Copy → Paste → Rename to `configuration_backup.yaml`

3. **Upload the new files** one by one:
   - In File Editor, click the **upload** button (📁 icon)
   - **Upload these files** from the extracted folder:
     - `configuration.yaml` (replace your current one)
     - `ui-lovelace.yaml`
     - `ui-lovelace_mobile.yaml`
     - `button_card_templates.yaml`
     - `themes.yaml`
     - `automations.yaml`
     - `scripts.yaml`
     - `scenes.yaml`

4. **Create secrets file:**
   - **Copy** `deployment/templates/secrets_template.yaml`
   - **Paste** in main folder as `secrets.yaml`
   - **Edit** it with your real passwords/IPs

### **5. Install Frontend Cards**
**HACS → Frontend** - Install these:
- Button Card
- Card Mod
- Config Template Card
- Bar Card
- Mini Graph Card
- Mini Media Player

### **6. Edit Your Settings**
**Edit `configuration.yaml`:**
- Change `192.168.0.210` to your Hue bridge IP (if you have Hue)
- Change `192.168.0.248` to your MQTT broker IP (if you use MQTT)
- Replace light names like `light.table` with your actual light entities

### **7. Restart**
**Settings → System → Restart**

## 🎉 **Done!**
Your 3D floorplan dashboard should now appear!

## 🆘 **Problems?**
- **Can't upload files?** Try uploading one at a time
- **Missing cards?** Install all frontend components from step 5
- **Red errors?** Update the IP addresses and light names in step 6

**Still stuck?** Create an issue with your specific error message! 🏠