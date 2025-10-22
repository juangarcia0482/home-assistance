/**
 * LAJV 3D Floorplan Configuration Loader
 * Version: 1.0.0
 * 
 * This file serves as the HACS entry point for the complete 
 * Home Assistant configuration package.
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
  `%c LAJV 3D Floorplan Configuration %c v1.0.0`,
  'color: #03A9F4; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: #03A9F4'
);

console.info(
  'Configuration files available in /www/community/home-assistance/\n' +
  'Follow the README.md instructions for complete installation.'
);

// Export empty module to satisfy HACS plugin requirements
export default class LajvFloorplanConfig {
  constructor() {
    console.log('LAJV 3D Floorplan Configuration loaded - Check README.md for installation steps');
  }
}