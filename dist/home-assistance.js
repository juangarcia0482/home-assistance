/**
 * Home Assistance Configuration Loader
 * Version: 1.0.0
 * 
 * This serves as the HACS Dashboard entry point for the complete 
 * Home Assistant 3D floorplan configuration package.
 * 
 * The main content consists of:
 * - Complete Home Assistant configuration files
 * - 3D floorplan dashboard setup  
 * - Picture Elements cards configuration
 * - Custom themes and components
 * 
 * Installation: Follow the README.md instructions to copy
 * configuration files from /www/community/home-assistance/
 * to your Home Assistant configuration directory.
 */

console.info(
  `%c Home Assistance 3D Floorplan %c v1.0.0`,
  'color: #03A9F4; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: #03A9F4'
);

console.info(
  'Home Assistant configuration files available.\n' +
  'Follow the README.md instructions for complete installation.'
);

// Satisfy HACS plugin requirements
export default class HomeAssistanceConfig {
  constructor() {
    console.log('Home Assistance Configuration loaded - Check README.md for installation steps');
  }
}