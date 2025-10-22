# 🔄 Installation Flowchart

```
┌─────────────────────────────────────┐
│     Start: Have Home Assistant?     │
└─────────────┬───────────────────────┘
              │ YES
              ▼
┌─────────────────────────────────────┐
│         Have HACS installed?        │
└─────────────┬───────────────────────┘
              │ YES
              ▼
┌─────────────────────────────────────┐
│      1. Open HACS → Integrations    │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   2. Click three dots (⋮) → Custom  │
│         repositories                │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   3. Add repository:                │
│   github.com/juangarcia0482/        │
│   home-assistance                   │
│   Category: Integration             │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   4. Search "Home Assistant         │
│   Configuration - LAJV"             │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   5. Download with HACS             │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   6. Run setup script:              │
│   ./deployment/scripts/setup.sh     │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   7. Edit secrets.yaml              │
│   8. Update configuration.yaml      │
│   9. Install frontend components    │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│   10. Check config & restart HA     │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│        🎉 Installation Complete!    │
│     Enjoy your 3D floorplan HA!    │
└─────────────────────────────────────┘
```

## 📱 Mobile Quick Steps

**For mobile users or quick reference:**

1. **HACS** → **Integrations** → **⋮** → **Custom repositories**
2. **Add**: `https://github.com/juangarcia0482/home-assistance`
3. **Category**: Integration
4. **Search**: "Home Assistant Configuration - LAJV"
5. **Download** → **Setup** → **Configure** → **Restart**

## ❌ If You Don't Have HACS

**Install HACS first:**
1. Visit: https://hacs.xyz/docs/setup/download
2. Follow the HACS installation guide
3. Restart Home Assistant
4. Come back to this guide

## ❌ If You Don't Have Home Assistant

**Install Home Assistant first:**
1. Visit: https://www.home-assistant.io/installation/
2. Choose your installation method
3. Complete the initial setup
4. Install HACS
5. Come back to this guide

## 🆘 Need Help?

- 📖 [Detailed Guide](ADD_TO_HOMEASSISTANT.md)
- 💬 [Create an Issue](https://github.com/juangarcia0482/home-assistance/issues)
- 🏠 [Home Assistant Community](https://community.home-assistant.io/)