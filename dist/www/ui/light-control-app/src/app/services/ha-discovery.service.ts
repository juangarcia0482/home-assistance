import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeAssistantDiscoveryService {
    private readonly haUrl = environment.homeAssistant.url;
    private readonly haToken = environment.homeAssistant.token;

    async discoverLightEntities(): Promise<any[]> {
        try {
            const response = await fetch(`${this.haUrl}/api/states`, {
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const states = await response.json();
                // Filter for light entities AND input_boolean entities that act as lights
                const lightEntities = states.filter((state: any) =>
                    state.entity_id.startsWith('light.') ||
                    (state.entity_id.startsWith('input_boolean.') &&
                        (state.entity_id.includes('bedroom') ||
                            state.entity_id.includes('bathroom') ||
                            state.entity_id.includes('kitchen') ||
                            state.entity_id.includes('living') ||
                            state.entity_id.includes('family')))
                );

                console.log('🔍 Discovered Light & Mock Light Entities:', lightEntities);
                return lightEntities;
            } else {
                console.error('Failed to fetch HA states:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Error discovering HA entities:', error);
            return [];
        }
    }

    async generateEntityMapping(): Promise<void> {
        const entities = await this.discoverLightEntities();

        console.log('📋 Light Entity Mapping:');
        console.log('========================');

        entities.forEach(entity => {
            const friendlyName = entity.attributes.friendly_name || entity.entity_id;
            const area = entity.attributes.area_id || 'unknown';
            const deviceClass = entity.attributes.device_class || 'light';

            console.log(`Entity ID: ${entity.entity_id}`);
            console.log(`Friendly Name: ${friendlyName}`);
            console.log(`Area: ${area}`);
            console.log(`State: ${entity.state}`);
            console.log(`Brightness: ${entity.attributes.brightness || 'N/A'}`);
            console.log('---');
        });

        // Generate suggested room mappings
        this.generateRoomMappings(entities);
    }

    private generateRoomMappings(entities: any[]): void {
        console.log('🏠 Suggested Room Mappings:');
        console.log('============================');

        // Group entities by room based on your actual HA configuration
        const roomGroups: { [key: string]: any[] } = {};

        entities.forEach(entity => {
            const entityId = entity.entity_id;
            let room = 'unknown';

            // Map based on your actual entity naming
            if (entityId.includes('bedroom_john')) room = 'bedroom-john';
            else if (entityId.includes('bedroom_guest')) room = 'bedroom-guest';
            else if (entityId.includes('bedroom_master')) room = 'bedroom-master';
            else if (entityId.includes('bathroom_guest')) room = 'bathroom-guest';
            else if (entityId.includes('bathroom_master')) room = 'bathroom-master';
            else if (entityId.includes('living_room')) room = 'living-room';
            else if (entityId.includes('family_room')) room = 'family-room';
            else if (entityId.includes('kitchen')) room = 'kitchen';

            if (!roomGroups[room]) roomGroups[room] = [];
            roomGroups[room].push(entity);
        });

        // Display current mappings
        Object.keys(roomGroups).forEach(room => {
            console.log(`\n📍 ${room.toUpperCase()}:`);
            roomGroups[room].forEach(entity => {
                const friendlyName = entity.attributes.friendly_name || entity.entity_id.replace(/^(light\.|input_boolean\.)/, '');
                const state = entity.state === 'on';
                const brightness = entity.attributes.brightness ? Math.round((entity.attributes.brightness / 255) * 100) : 100;

                console.log(`   ✅ ${entity.entity_id} | ${friendlyName} | ${state ? 'ON' : 'OFF'} | ${brightness}%`);
            });
        });

        console.log('\n🎯 Your entities are now mapped to the Angular UI!');
        console.log('The UI will automatically sync with these HA entities.');
    }
}