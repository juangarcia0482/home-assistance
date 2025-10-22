# 🚀 SUPER SIMPLE Installation Guide

**Don't want to read a long guide? Follow these basic steps:**

## ⚡ Quick Steps (5 minutes)

### 1. Add to HACS
1. **HACS** → **Integrations** → **⋮** (three dots) → **Custom repositories**
2. **Add**: `https://github.com/juangarcia0482/home-assistance`
3. **Category**: Integration → **Add**

### 2. Download
1. **HACS** → **Integrations** → **Explore & Download**
2. **Search**: "Home Assistant Configuration - LAJV"
3. **Download** it

### 3. Create secrets file
1. **Settings** → **Add-ons** → **File editor**
2. **Copy** `deployment/templates/secrets_template.yaml`
3. **Paste** it in main folder as `secrets.yaml`
4. **Edit** it with your real passwords

### 4. Install cards
**HACS** → **Frontend** → Install these:
- Button Card
- Card Mod  
- Config Template Card
- Bar Card
- Mini Graph Card
- Mini Media Player

### 5. Update your settings
**Edit** `configuration.yaml`:
- Change Hue bridge IP (if you have Hue lights)
- Change MQTT broker IP (if you use MQTT)
- Change light names to match yours

### 6. Restart
**Settings** → **System** → **Restart**

## ❌ Still confused?

**Choose your comfort level:**

- 🟢 **Beginner**: [Complete Step-by-Step Guide](HACS_INSTALLATION.md)
- 🟡 **Intermediate**: [Technical Installation](deployment/docs/INSTALLATION.md)  
- 🔴 **Expert**: [Configuration Template](deployment/docs/CONFIGURATION_TEMPLATE.md)

## 🆘 Something broken?

**Most common fixes:**
1. **Red errors**: Light names don't match → Change them in configuration files
2. **Cards missing**: Install more frontend components from HACS
3. **Nothing works**: Check secrets.yaml has real passwords, not examples

**Still stuck?** [Create an issue](https://github.com/juangarcia0482/home-assistance/issues) and tell us:
- What step you're on
- What error you see
- Your Home Assistant version