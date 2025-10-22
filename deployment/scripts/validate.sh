#!/bin/bash

# Deployment Validation Script
# Checks that all required deployment files are present and valid

echo "🔍 Validating Deployment Package"
echo "================================"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DEPLOYMENT_PATH="$(dirname "$SCRIPT_DIR")"
ROOT_PATH="$(dirname "$DEPLOYMENT_PATH")"

cd "$ROOT_PATH"

ERRORS=0

# Check core files
echo "📋 Checking core files..."
for file in "hacs.json" "VERSION" ".gitignore" "README.md" "configuration.yaml"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check deployment structure
echo ""
echo "📁 Checking deployment structure..."
for dir in "deployment/docs" "deployment/scripts" "deployment/templates"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/"
    else
        echo "❌ Missing directory: $dir/"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check documentation
echo ""
echo "📖 Checking documentation..."
for file in "deployment/docs/INSTALLATION.md" "deployment/docs/CONFIGURATION_TEMPLATE.md" "deployment/docs/info.md"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check scripts
echo ""
echo "🔧 Checking scripts..."
for file in "deployment/scripts/setup.sh" "deployment/scripts/setup.ps1"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
        # Check if bash script is executable
        if [[ "$file" == *.sh ]] && [ ! -x "$file" ]; then
            echo "⚠️  Warning: $file is not executable"
        fi
    else
        echo "❌ Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check templates
echo ""
echo "📄 Checking templates..."
for file in "deployment/templates/secrets_template.yaml"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check HACS configuration
echo ""
echo "🔍 Validating HACS configuration..."
if [ -f "hacs.json" ]; then
    if command -v jq &> /dev/null; then
        if jq empty hacs.json 2>/dev/null; then
            echo "✅ hacs.json is valid JSON"
        else
            echo "❌ hacs.json is invalid JSON"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo "⚠️  jq not installed, skipping JSON validation"
    fi
fi

# Summary
echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo "✅ Deployment validation passed!"
    echo "📦 Package is ready for distribution"
else
    echo "❌ Deployment validation failed with $ERRORS error(s)"
    echo "🔧 Please fix the issues above before deploying"
    exit 1
fi