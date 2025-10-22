# Deployment Manifest

## Files Included in Deployment Package

### Core Configuration (Root)
- `hacs.json` - HACS integration configuration
- `VERSION` - Version tracking  
- `.gitignore` - Git ignore rules
- `README.md` - Main project documentation

### Documentation (`/deployment/docs/`)
- `INSTALLATION.md` - Complete installation guide
- `CONFIGURATION_TEMPLATE.md` - Customization template
- `info.md` - Project summary for HACS

### Setup Scripts (`/deployment/scripts/`)
- `setup.sh` - Bash setup script (Linux/macOS)
- `setup.ps1` - PowerShell setup script (Windows)

### Templates (`/deployment/templates/`)
- `secrets_template.yaml` - Template for creating secrets.yaml

### Supporting Files
- `deployment/README.md` - Deployment folder documentation
- `deployment/MANIFEST.md` - This file

## Installation Flow

1. **Repository Download** (via HACS or git clone)
2. **Run Setup Script** (`setup.ps1` or `setup.sh`)
3. **Follow Documentation** (`INSTALLATION.md`)
4. **Customize Configuration** (using `CONFIGURATION_TEMPLATE.md`)
5. **Install Dependencies** (HACS components)
6. **Test and Validate**

## Version History

- `2021.5.1` - Initial deployment package
  - Organized deployment structure
  - Added comprehensive documentation
  - Created setup automation scripts
  - Added configuration templates

## Maintenance

### Adding New Deployment Files
- Documentation → `deployment/docs/`
- Scripts → `deployment/scripts/`  
- Templates → `deployment/templates/`

### Before Release
- [ ] Update VERSION file
- [ ] Test setup scripts on clean installation
- [ ] Verify all documentation is current
- [ ] Check HACS integration works
- [ ] Validate .gitignore excludes sensitive files