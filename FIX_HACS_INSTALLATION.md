# 🔧 Fix Your HACS Installation

Since you already downloaded via HACS but can't find the files, here's how to fix it:

## 🔍 **Step 1: Find the Files**

The files are in: `/config/www/community/home-assistance/`

**In File Editor:**
1. Click on **"www"** folder
2. Click on **"community"** folder  
3. Click on **"home-assistance"** folder
4. **You should see all the configuration files here**

## 📂 **Step 2: Copy Files to Correct Location**

You need to **move** these files from `www/community/home-assistance/` to your main `/config/` folder:

### **Files to Copy/Move:**
- `configuration.yaml` → Copy to `/config/` (backup your current one first!)
- `ui-lovelace.yaml` → Copy to `/config/`
- `ui-lovelace_mobile.yaml` → Copy to `/config/`
- `secrets_template.yaml` → Copy to `/config/` and rename to `secrets.yaml`
- `button_card_templates.yaml` → Copy to `/config/`
- `themes.yaml` → Copy to `/config/`
- All other `.yaml` files → Copy to `/config/`

### **Folders to Merge:**
- `custom_components/` → Merge with your existing `/config/custom_components/`
- `www/` → Merge contents with your existing `/config/www/`
- `deployment/` → Copy to `/config/`

## 🎯 **Easy Copy Method in File Editor**

1. **Select a file** in `www/community/home-assistance/`
2. **Right-click** → **Copy**
3. **Navigate back** to main config folder
4. **Right-click** → **Paste**
5. **Repeat** for all files

## ⚠️ **Important: Backup First!**

Before copying `configuration.yaml`:
1. **Right-click** your current `configuration.yaml`
2. **Copy** it
3. **Paste** and rename to `configuration_backup.yaml`

## 🚀 **After Copying All Files**

1. **Edit `secrets.yaml`** with your real passwords
2. **Edit `configuration.yaml`** with your IP addresses  
3. **Install frontend cards** from HACS → Frontend
4. **Restart Home Assistant**

## 🆘 **Can't Find the Files?**

If you still can't find `www/community/home-assistance/`, the download might have failed. In that case:

1. **Remove** the HACS installation
2. **Use direct download** instead: Download ZIP from GitHub
3. **Extract** and copy files manually

**Need help with any step?** Let me know which part you're stuck on! 🏠