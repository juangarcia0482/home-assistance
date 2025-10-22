# Deployment Resources

This folder contains all the files needed to deploy and install this Home Assistant configuration.

## 📁 Folder Structure

### `/docs/`
Documentation for installation and configuration:
- **`INSTALLATION.md`** - Complete step-by-step installation guide
- **`CONFIGURATION_TEMPLATE.md`** - What users need to customize
- **`info.md`** - Summary information for HACS

### `/scripts/`
Setup automation scripts:
- **`setup.sh`** - Bash setup script (Linux/macOS)
- **`setup.ps1`** - PowerShell setup script (Windows)

### `/templates/`
Configuration templates for users:
- **`secrets_template.yaml`** - Template for creating secrets.yaml

## 🚀 For End Users

### Quick Start
1. **Follow the complete guide**: [How to Add This to Home Assistant](../ADD_TO_HOMEASSISTANT.md)
2. **Or use HACS directly:**
   - Add `https://github.com/juangarcia0482/home-assistance` as custom repository
   - Download "Home Assistant Configuration - LAJV"
3. **Run setup script:**
   - **Windows**: `.\deployment\scripts\setup.ps1`
   - **Linux/macOS**: `./deployment/scripts/setup.sh`
4. **Follow instructions in** `deployment/docs/INSTALLATION.md`

### What the Setup Script Does
- Creates `secrets.yaml` from template
- Creates empty `known_devices.yaml`
- Provides next-step instructions

## 🔧 For Developers

### Deployment Checklist
- [ ] Update `VERSION` file in root
- [ ] Update `hacs.json` configuration
- [ ] Test installation scripts
- [ ] Verify documentation is current
- [ ] Check that all sensitive data is in .gitignore

### Adding New Deployment Files
Place files in the appropriate subfolder:
- Documentation → `/docs/`
- Scripts → `/scripts/`
- Templates → `/templates/`

## 📋 Related Files (in root)
- **`hacs.json`** - HACS integration configuration
- **`VERSION`** - Version tracking
- **`.gitignore`** - Git ignore rules

---

*This deployment structure keeps installation resources organized and separate from the main Home Assistant configuration files.*