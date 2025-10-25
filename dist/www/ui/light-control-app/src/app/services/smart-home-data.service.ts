import { Injectable, signal } from '@angular/core';
import { Room, System, SecuritySensor } from '../models/interfaces';
import { EntityMappingService } from './entity-mapping.service';

@Injectable({
    providedIn: 'root'
})
export class SmartHomeDataService {

    readonly rooms = signal<Room[]>([]);

    constructor(private entityMappingService: EntityMappingService) {
        this.loadDynamicRooms();
        this.loadDynamicSystems();
    }

    private loadDynamicRooms(): void {
        // Load room definitions from entity mapping service
        this.entityMappingService.loadRoomDefinitions();

        const roomDefinitions = this.entityMappingService.availableRooms();
        const discoveredEntities = this.entityMappingService.discoveredEntities();

        const dynamicRooms: Room[] = roomDefinitions.map(roomDef => {
            const roomEntities = this.entityMappingService.getEntitiesForRoom(roomDef.id);

            return {
                id: roomDef.id,
                name: roomDef.name,
                icon: roomDef.icon,
                hasActiveDevices: false,
                lights: roomEntities.map(entity => ({
                    id: entity.entity_id,
                    name: entity.friendly_name,
                    isOn: entity.state === 'on',
                    brightness: entity.attributes.brightness ?
                        Math.round((entity.attributes.brightness / 255) * 100) : 100
                }))
            };
        });

        this.rooms.set(dynamicRooms);
    }

    async refreshFromEntityMappings(): Promise<void> {
        // Discover entities first
        await this.entityMappingService.discoverEntities();

        // Then reload rooms and systems with fresh data
        this.loadDynamicRooms();
        this.loadDynamicSystems();
    }

    readonly systems = signal<System[]>([]);

    private loadDynamicSystems(): void {
        // Load systems from discovered Home Assistant entities
        const discoveredEntities = this.entityMappingService.discoveredEntities();
        const dynamicSystems: System[] = [];

        // Security system - look for door/window sensors, motion sensors
        const securitySensors = discoveredEntities.filter(entity =>
            entity.entity_id.includes('door') ||
            entity.entity_id.includes('window') ||
            entity.entity_id.includes('motion') ||
            entity.entity_id.includes('sensor')
        );

        if (securitySensors.length > 0) {
            dynamicSystems.push({
                id: 'security',
                name: 'Security System',
                icon: '�️',
                active: true,
                status: 'online',
                description: 'Home security monitoring with sensors',
                sensors: securitySensors.map(entity => ({
                    id: entity.entity_id,
                    name: entity.friendly_name,
                    location: this.extractLocation(entity.friendly_name),
                    status: entity.state === 'on' ? 'triggered' : 'normal',
                    icon: this.getSecurityIcon(entity.entity_id)
                }))
            });
        }

        // Climate system - look for thermostats, temperature sensors
        const climateSensors = discoveredEntities.filter(entity =>
            entity.entity_id.includes('climate') ||
            entity.entity_id.includes('thermostat') ||
            entity.entity_id.includes('temperature')
        );

        if (climateSensors.length > 0) {
            dynamicSystems.push({
                id: 'climate',
                name: 'Climate Control',
                icon: '🌡️',
                active: true,
                status: 'online',
                description: 'Temperature and climate control'
            });
        }

        this.systems.set(dynamicSystems);
    }

    private extractLocation(friendlyName: string): string {
        // Extract room/location from friendly name
        const parts = friendlyName.toLowerCase().split(' ');
        return parts.slice(0, 2).join(' ') || 'Unknown';
    }

    private getSecurityIcon(entityId: string): string {
        if (entityId.includes('door')) return '🚪';
        if (entityId.includes('window')) return '🪟';
        if (entityId.includes('motion')) return '👁️';
        if (entityId.includes('sensor')) return '📡';
        return '🔍';
    }

    readonly securitySensors = signal<SecuritySensor[]>([
        { id: 'front-door', name: 'Front Door', location: 'Front Entry', status: 'normal', icon: '🚪' },
        { id: 'back-door', name: 'Back Door', location: 'Back Patio', status: 'normal', icon: '🚪' },
        { id: 'master-window', name: 'Master Bedroom Window', location: 'Master Bedroom', status: 'normal', icon: '🪟' },
        { id: 'living-motion', name: 'Living Room Motion', location: 'Living Room', status: 'normal', icon: '👁️' }
    ]);

    getRoomById(roomId: string): Room | undefined {
        return this.rooms().find(room => room.id === roomId);
    }

    getSystemById(systemId: string): System | undefined {
        return this.systems().find(system => system.id === systemId);
    }

    updateRoomStatus(roomId: string): void {
        const rooms = this.rooms();
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            room.hasActiveDevices = room.lights.some(light => light.isOn);
            this.rooms.set([...rooms]);
        }
    }
}
