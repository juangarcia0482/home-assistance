// Home Assistant Configuration - LAJV
// JavaScript resources and utilities for Home Assistant Lovelace UI

console.log('Home Assistant Configuration - LAJV loaded');

// Custom card configurations and utilities
window.homeAssistanceLAJV = {
    version: '2021.5.0',

    // Utility functions for custom cards
    utils: {
        // Helper function for formatting entity states
        formatEntityState: function (entity) {
            if (!entity) return 'Unknown';
            return entity.state + ' ' + (entity.attributes.unit_of_measurement || '');
        },

        // Helper function for entity availability
        isEntityAvailable: function (entity) {
            return entity && entity.state !== 'unavailable' && entity.state !== 'unknown';
        }
    },

    // Custom styling helpers
    styles: {
        // Common CSS classes used in button cards and custom components
        buttonCard: {
            defaultStyle: `
                border-radius: 15px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            `,
            activeStyle: `
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `
        }
    }
};

// Initialize custom components when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('Home Assistant LAJV configuration initialized');
});