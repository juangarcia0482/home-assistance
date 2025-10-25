import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    private readonly roomIcons: { [key: string]: string } = {
        'bedroom-john': '🛏️',
        'bedroom-guest': '🛌',
        'bedroom-master': '🏠',
        'living-room': '🛋️',
        'family-room': '👨‍👩‍👧‍👦',
        'kitchen': '🍳',
        'bathroom-guest': '🚿',
        'bathroom-master': '🛁',
        'outdoor': '🌿',
        'office': '💼',
        'garage': '🚗',
        'basement': '🏠',
        'attic': '🏠'
    };

    private readonly systemIcons: { [key: string]: string } = {
        'security': '🛡️',
        'climate': '🌡️',
        'energy': '⚡',
        'entertainment': '📺',
        'automation': '🎭',
        'network': '🌐',
        'lighting': '💡',
        'camera': '📹',
        'speaker': '🔊'
    };

    private readonly entityIcons: { [key: string]: string } = {
        'light': '💡',
        'switch': '🔌',
        'input_boolean': '🎛️',
        'fan': '🌀',
        'cover': '🚪',
        'sensor': '📊',
        'binary_sensor': '👁️',
        'climate': '🌡️',
        'media_player': '📺',
        'camera': '📹',
        'lock': '🔒',
        'alarm': '🚨'
    };

    private readonly sensorIcons: { [key: string]: string } = {
        'door': '🚪',
        'window': '🪟',
        'motion': '👁️',
        'temperature': '🌡️',
        'humidity': '💧',
        'smoke': '🚨',
        'gas': '⚠️',
        'battery': '🔋',
        'power': '⚡'
    };

    getRoomIcon(roomId: string): string {
        return this.roomIcons[roomId] || '🏠';
    }

    getSystemIcon(systemId: string): string {
        return this.systemIcons[systemId] || '⚙️';
    }

    getEntityIcon(domain: string): string {
        return this.entityIcons[domain] || '⚡';
    }

    getSensorIcon(sensorType: string): string {
        return this.sensorIcons[sensorType.toLowerCase()] || '📊';
    }

    // Generate icon for unknown room types
    generateRoomIcon(roomName: string): string {
        const name = roomName.toLowerCase();

        if (name.includes('bedroom') || name.includes('bed')) return '🛏️';
        if (name.includes('bathroom') || name.includes('bath') || name.includes('toilet')) return '🚿';
        if (name.includes('kitchen') || name.includes('cook')) return '🍳';
        if (name.includes('living') || name.includes('lounge')) return '🛋️';
        if (name.includes('dining') || name.includes('eat')) return '🍽️';
        if (name.includes('office') || name.includes('study') || name.includes('work')) return '💼';
        if (name.includes('garage') || name.includes('car')) return '🚗';
        if (name.includes('basement') || name.includes('cellar')) return '🏠';
        if (name.includes('attic') || name.includes('loft')) return '🏠';
        if (name.includes('outdoor') || name.includes('garden') || name.includes('patio')) return '🌿';
        if (name.includes('entry') || name.includes('foyer') || name.includes('hall')) return '🚪';
        if (name.includes('laundry') || name.includes('wash')) return '🧺';
        if (name.includes('storage') || name.includes('closet')) return '📦';

        return '🏠'; // Default
    }

    // Status indicator icons
    getStatusIcon(status: string): string {
        switch (status.toLowerCase()) {
            case 'online':
            case 'on':
            case 'active':
            case 'normal': return '🟢';

            case 'offline':
            case 'off':
            case 'inactive': return '🔴';

            case 'warning':
            case 'alert': return '🟡';

            case 'error':
            case 'critical': return '🔴';

            default: return '⚪';
        }
    }

    // Navigation icons
    getNavIcon(section: string): string {
        switch (section.toLowerCase()) {
            case 'rooms': return '🏠';
            case 'systems': return '⚙️';
            case 'config':
            case 'configuration': return '🔧';
            case 'settings': return '⚙️';
            case 'mapping': return '🔗';
            default: return '📋';
        }
    }
}