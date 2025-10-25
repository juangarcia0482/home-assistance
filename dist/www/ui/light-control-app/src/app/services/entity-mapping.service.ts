import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface DiscoveredEntity {
    entity_id: string;
    friendly_name: string;
    domain: string;
    state: string;
    attributes: any;
    room?: string;
    mapped: boolean;
}

export interface RoomMapping {
    id: string;
    name: string;
    icon: string;
    entities: string[];
}

@Injectable({
    providedIn: 'root'
})
export class EntityMappingService {
    private readonly haUrl = environment.homeAssistant.url;
    private readonly haToken = environment.homeAssistant.token;

    // Signals for reactive UI
    readonly discoveredEntities = signal<DiscoveredEntity[]>([]);
    readonly availableRooms = signal<RoomMapping[]>([]); // Start with empty rooms - user must create them
    readonly isLoading = signal<boolean>(false);
    readonly error = signal<string | null>(null);

    async discoverEntities(): Promise<void> {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const response = await fetch(`${this.haUrl}/api/states`, {
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const states = await response.json();

            // Filter for all relevant smart home entities
            const relevantEntities = states.filter((state: any) => {
                const domain = state.entity_id.split('.')[0];

                // Include all common smart home device types
                const includedDomains = [
                    'light',           // Lights
                    'switch',          // Switches
                    'input_boolean',   // Input booleans
                    'fan',            // Fans
                    'cover',          // Covers/blinds
                    'camera',         // Cameras
                    'sensor',         // Sensors
                    'binary_sensor',  // Binary sensors
                    'climate',        // Climate control
                    'lock',           // Locks
                    'media_player',   // Media players
                    'alarm_control_panel', // Alarm systems
                    'device_tracker', // Device trackers
                    'person',         // Persons
                    'automation',     // Automations
                    'script',         // Scripts
                    'scene',          // Scenes
                    'input_select',   // Input selects
                    'input_number',   // Input numbers
                    'input_text',     // Input text
                    'input_datetime', // Input datetime
                    'timer',          // Timers
                    'counter',        // Counters
                    'vacuum',         // Vacuum cleaners
                    'water_heater',   // Water heaters
                    'humidifier',     // Humidifiers
                    'air_quality',    // Air quality sensors
                    'weather',        // Weather
                    'sun',            // Sun
                    'zone'            // Zones
                ];

                return includedDomains.includes(domain);
            });

            const discovered: DiscoveredEntity[] = relevantEntities.map((state: any) => ({
                entity_id: state.entity_id,
                friendly_name: state.attributes.friendly_name || state.entity_id.replace(/^[^.]+\./, '').replace(/_/g, ' '),
                domain: state.entity_id.split('.')[0],
                state: state.state,
                attributes: state.attributes,
                room: undefined, // No automatic room assignment - only manual mapping
                mapped: false
            }));

            // Apply any existing mappings
            this.applyExistingMappings(discovered);

            this.discoveredEntities.set(discovered);
            console.log(`🔍 Discovered ${discovered.length} controllable entities`);

        } catch (error) {
            console.error('Failed to discover entities:', error);
            this.error.set(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            this.isLoading.set(false);
        }
    }

    private applyExistingMappings(entities: DiscoveredEntity[]): void {
        const savedMappings = this.loadMappings();
        const rooms = this.availableRooms();

        entities.forEach(entity => {
            for (const room of rooms) {
                if (savedMappings[room.id]?.includes(entity.entity_id)) {
                    entity.room = room.id;
                    entity.mapped = true;
                    break;
                }
            }
        });
    }

    mapEntityToRoom(entityId: string, roomId: string): void {
        const entities = this.discoveredEntities();
        const entity = entities.find(e => e.entity_id === entityId);

        if (entity) {
            // Remove from previous room
            if (entity.room) {
                this.unmapEntityFromRoom(entityId, entity.room);
            }

            // Add to new room
            entity.room = roomId;
            entity.mapped = true;

            const rooms = this.availableRooms();
            const room = rooms.find(r => r.id === roomId);
            if (room && !room.entities.includes(entityId)) {
                room.entities.push(entityId);
            }

            this.discoveredEntities.set([...entities]);
            this.availableRooms.set([...rooms]);
            this.saveMappings();
        }
    }

    unmapEntityFromRoom(entityId: string, roomId: string): void {
        const entities = this.discoveredEntities();
        const entity = entities.find(e => e.entity_id === entityId);

        if (entity) {
            entity.room = undefined;
            entity.mapped = false;
        }

        const rooms = this.availableRooms();
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            room.entities = room.entities.filter(id => id !== entityId);
        }

        this.discoveredEntities.set([...entities]);
        this.availableRooms.set([...rooms]);
        this.saveMappings();
    }

    addCustomRoom(name: string, icon: string): void {
        const rooms = this.availableRooms();
        const id = name.toLowerCase().replace(/\s+/g, '-');

        if (!rooms.find(r => r.id === id)) {
            rooms.push({ id, name, icon, entities: [] });
            this.availableRooms.set([...rooms]);
            this.saveMappings();
        }
    }

    private saveMappings(): void {
        const mappings: { [roomId: string]: string[] } = {};

        this.availableRooms().forEach(room => {
            mappings[room.id] = room.entities;
        });

        localStorage.setItem('ha-entity-mappings', JSON.stringify(mappings));
        localStorage.setItem('ha-room-definitions', JSON.stringify(this.availableRooms()));
    }

    private loadMappings(): { [roomId: string]: string[] } {
        try {
            const saved = localStorage.getItem('ha-entity-mappings');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    loadRoomDefinitions(): void {
        try {
            const saved = localStorage.getItem('ha-room-definitions');
            if (saved) {
                this.availableRooms.set(JSON.parse(saved));
            } else {
                // Start with empty rooms - user must create them via Entity Mapping
                this.availableRooms.set([]);
            }
        } catch {
            // Start with empty rooms if loading fails
            this.availableRooms.set([]);
        }
    }

    getEntitiesForRoom(roomId: string): DiscoveredEntity[] {
        return this.discoveredEntities().filter(entity => entity.room === roomId);
    }

    getUnmappedEntities(): DiscoveredEntity[] {
        return this.discoveredEntities().filter(entity => !entity.mapped);
    }

    exportConfiguration(): string {
        return JSON.stringify({
            rooms: this.availableRooms(),
            mappings: this.loadMappings(),
            timestamp: new Date().toISOString()
        }, null, 2);
    }

    importConfiguration(config: string): boolean {
        try {
            const data = JSON.parse(config);

            if (data.rooms && data.mappings) {
                this.availableRooms.set(data.rooms);
                localStorage.setItem('ha-entity-mappings', JSON.stringify(data.mappings));
                localStorage.setItem('ha-room-definitions', JSON.stringify(data.rooms));

                // Refresh entities with new mappings
                const entities = this.discoveredEntities();
                this.applyExistingMappings(entities);
                this.discoveredEntities.set([...entities]);

                return true;
            }

            return false;
        } catch {
            return false;
        }
    }

    clearAllMappings(): void {
        // Clear localStorage
        localStorage.removeItem('ha-entity-mappings');
        localStorage.removeItem('ha-room-definitions');

        // Reset to empty state
        this.availableRooms.set([]);

        // Clear room assignments from discovered entities
        const entities = this.discoveredEntities();
        entities.forEach(entity => {
            entity.room = undefined;
            entity.mapped = false;
        });
        this.discoveredEntities.set([...entities]);

        console.log('🧹 Cleared all room mappings and definitions');
    }

    updateRoom(roomId: string, newName: string, newIcon: string): void {
        const rooms = this.availableRooms();
        const roomIndex = rooms.findIndex(r => r.id === roomId);

        if (roomIndex !== -1) {
            rooms[roomIndex].name = newName;
            rooms[roomIndex].icon = newIcon;
            this.availableRooms.set([...rooms]);
            this.saveRoomDefinitions();
            console.log(`✏️ Updated room: ${newName}`);
        }
    }

    deleteRoom(roomId: string): void {
        // Remove room from available rooms
        const rooms = this.availableRooms().filter(r => r.id !== roomId);
        this.availableRooms.set(rooms);

        // Remove all mappings for this room
        const mappings = this.loadMappings();
        delete mappings[roomId];
        localStorage.setItem('ha-entity-mappings', JSON.stringify(mappings));

        // Unmap entities that were in this room
        const entities = this.discoveredEntities();
        entities.forEach(entity => {
            if (entity.room === roomId) {
                entity.room = undefined;
                entity.mapped = false;
            }
        });
        this.discoveredEntities.set([...entities]);

        this.saveRoomDefinitions();
        console.log(`🗑️ Deleted room: ${roomId}`);
    }

    private saveRoomDefinitions(): void {
        localStorage.setItem('ha-room-definitions', JSON.stringify(this.availableRooms()));
    }

    /**
     * Set the entities that were selected during the setup wizard
     * This filters the discovered entities to only include user-selected ones
     */
    setSelectedEntities(selectedEntities: DiscoveredEntity[]): void {
        this.discoveredEntities.set([...selectedEntities]);
        console.log(`📱 Applied selected entities: ${selectedEntities.length} devices`);

        // Save the selection to localStorage for persistence
        localStorage.setItem('ha-selected-entities', JSON.stringify(selectedEntities));
    }

    /**
     * Get the currently selected entities from localStorage
     */
    getSelectedEntities(): DiscoveredEntity[] {
        try {
            const saved = localStorage.getItem('ha-selected-entities');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Could not load selected entities:', error);
            return [];
        }
    }
}