#!/bin/bash

# Home Assistant Configuration Setup Script
# This script helps set up the configuration for first-time users

echo "🏠 Home Assistant Configuration Setup"
echo "====================================="

# Determine if we're running from deployment folder or root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DEPLOYMENT_PATH="$(dirname "$SCRIPT_DIR")"
ROOT_PATH="$(dirname "$DEPLOYMENT_PATH")"

# Check if we can find configuration.yaml
if [ -f "$ROOT_PATH/configuration.yaml" ]; then
    cd "$ROOT_PATH"
    echo "📍 Found configuration in: $ROOT_PATH"
elif [ -f "configuration.yaml" ]; then
    echo "📍 Using current directory"
else
    echo "❌ Error: configuration.yaml not found. Please run this script from the Home Assistant configuration directory or the deployment scripts folder."
    exit 1
fi

echo "📋 Setting up configuration files..."

# Create secrets.yaml if it doesn't exist
if [ ! -f "secrets.yaml" ]; then
    echo "📝 Creating secrets.yaml from template..."
    if [ -f "$DEPLOYMENT_PATH/templates/secrets_template.yaml" ]; then
        cp "$DEPLOYMENT_PATH/templates/secrets_template.yaml" secrets.yaml
    elif [ -f "deployment/templates/secrets_template.yaml" ]; then
        cp "deployment/templates/secrets_template.yaml" secrets.yaml
    else
        echo "⚠️  Could not find secrets template. Please copy deployment/templates/secrets_template.yaml to secrets.yaml manually."
    fi
    echo "✅ secrets.yaml created. Please edit this file with your actual credentials."
else
    echo "⚠️  secrets.yaml already exists. Skipping..."
fi

# Create known_devices.yaml if it doesn't exist
if [ ! -f "known_devices.yaml" ]; then
    echo "📝 Creating empty known_devices.yaml..."
    echo "# Known devices will be populated automatically by Home Assistant" > known_devices.yaml
    echo "✅ known_devices.yaml created."
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Edit secrets.yaml with your actual credentials"
echo "2. Update IP addresses in configuration.yaml"
echo "3. Replace light entity names with your own entities"
echo "4. Install required HACS components (see INSTALLATION.md)"
echo "5. Restart Home Assistant"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - deployment/docs/INSTALLATION.md"
echo "   - deployment/docs/CONFIGURATION_TEMPLATE.md"
echo ""
echo "✨ Setup complete! Happy automating!"