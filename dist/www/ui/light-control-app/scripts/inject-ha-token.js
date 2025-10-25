const fs = require('fs');
const path = require('path');

// Read HA token from environment variable or config file
let haToken = process.env.HA_TOKEN;

if (!haToken) {
    // Try to read from a config file in the parent directory
    const configPath = path.join(__dirname, '..', '..', '..', '..', 'ha-config.json');
    try {
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            haToken = config.token;
        }
    } catch (error) {
        console.warn('Could not read ha-config.json:', error.message);
    }
}

if (!haToken) {
    console.error('Home Assistant token not found!');
    console.error('Please set HA_TOKEN environment variable or create ha-config.json with {"token": "your_token_here"}');
    process.exit(1);
}

// Update the production environment file
const envProdPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
let envContent = fs.readFileSync(envProdPath, 'utf8');

// Replace the token placeholder
envContent = envContent.replace('YOUR_HA_TOKEN_HERE', haToken);

fs.writeFileSync(envProdPath, envContent);
console.log('✅ Home Assistant token injected successfully');