import { Injectable, signal, computed } from '@angular/core';
import { SmartHomeDataService } from './smart-home-data.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SmartHomeService {
    readonly selectedRoom = signal<string | null>(null);
    readonly selectedSystem = signal<string | null>(null);
    readonly securityStatus = signal<string>('Armed Home');
    readonly currentTime = signal<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Home Assistant configuration from environment
    private readonly haUrl = environment.homeAssistant.url;
    private readonly haToken = environment.homeAssistant.token;

    // Computed properties for enhanced UI
    readonly activeLightsCount = computed(() => {
        return this.dataService.rooms()
            .flatMap(room => room.lights)
            .filter(light => light.isOn).length;
    });

    readonly totalEnergyUsage = computed(() => {
        const activeDevices = this.activeLightsCount();
        return (activeDevices * 0.06 + 2.4).toFixed(1); // Base consumption + lights
    });

    constructor(private dataService: SmartHomeDataService) {
        // Update time every minute
        setInterval(() => {
            this.currentTime.set(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
    }

    selectRoom(roomId: string): void {
        this.selectedRoom.set(roomId);
        this.selectedSystem.set(null);
    }

    selectSystem(systemId: string): void {
        this.selectedSystem.set(systemId);
        this.selectedRoom.set(null);
    }

    getCurrentRoom() {
        const roomId = this.selectedRoom();
        return roomId ? this.dataService.getRoomById(roomId) : undefined;
    }

    getCurrentSystem() {
        const systemId = this.selectedSystem();
        return systemId ? this.dataService.getSystemById(systemId) : undefined;
    }

    toggleLight(lightId: string): void {
        const currentRoom = this.getCurrentRoom();
        if (currentRoom) {
            const light = currentRoom.lights.find(l => l.id === lightId);
            if (light) {
                // Update local state immediately for UI responsiveness
                light.isOn = !light.isOn;
                this.dataService.updateRoomStatus(currentRoom.id);

                // Call Home Assistant API
                this.callHaLightService(lightId, light.isOn ? 'turn_on' : 'turn_off', {
                    brightness_pct: light.brightness
                });
            }
        }
    }

    setBrightness(lightId: string, event: any): void {
        const currentRoom = this.getCurrentRoom();
        if (currentRoom) {
            const light = currentRoom.lights.find(l => l.id === lightId);
            if (light) {
                light.brightness = parseInt(event.target.value);

                // Call Home Assistant API if light is on
                if (light.isOn) {
                    this.callHaLightService(lightId, 'turn_on', {
                        brightness_pct: light.brightness
                    });
                }
            }
        }
    }

    private async callHaLightService(entityId: string, service: string, data: any = {}): Promise<void> {
        try {
            // Determine the correct domain and service based on entity type
            let domain = 'light';
            let haService = service;

            if (entityId.startsWith('input_boolean.')) {
                domain = 'input_boolean';
                haService = service === 'turn_on' ? 'turn_on' : 'turn_off';
                // input_boolean doesn't support brightness, so remove it
                delete data.brightness_pct;
            }

            const response = await fetch(`${this.haUrl}/api/services/${domain}/${haService}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entity_id: entityId,
                    ...data
                })
            });

            if (!response.ok) {
                console.warn(`Home Assistant API call failed: ${response.status} for ${entityId}`);
                // In a real app, you might want to revert the UI state here
            } else {
                console.log(`✅ Successfully called ${domain}/${haService} for ${entityId}`);
            }
        } catch (error) {
            console.warn('Failed to communicate with Home Assistant:', error);
            // In a real app, you might want to revert the UI state here
        }
    }

    getSelectedSystemName(): string {
        const system = this.getCurrentSystem();
        return system ? `${system.icon} ${system.name}` : '';
    }

    // Quick scene methods
    activateScene(sceneName: string): void {
        const rooms = this.dataService.rooms();

        switch (sceneName) {
            case 'goodMorning':
                rooms.forEach(room => {
                    if (['living-room', 'kitchen', 'master-bedroom'].includes(room.id)) {
                        room.lights.forEach(light => {
                            if (light.name.includes('Ceiling') || light.name.includes('Main')) {
                                light.isOn = true;
                                light.brightness = 80;
                            }
                        });
                        room.hasActiveDevices = true;
                    }
                });
                break;

            case 'movieNight':
                const livingRoom = rooms.find(r => r.id === 'living-room');
                if (livingRoom) {
                    livingRoom.lights.forEach(light => {
                        if (light.name.includes('Accent') || light.name.includes('TV')) {
                            light.isOn = true;
                            light.brightness = 20;
                        } else {
                            light.isOn = false;
                        }
                    });
                    livingRoom.hasActiveDevices = true;
                }
                break;

            case 'allOff':
                rooms.forEach(room => {
                    room.lights.forEach(light => light.isOn = false);
                    room.hasActiveDevices = false;
                });
                break;
        }

        this.dataService.rooms.set([...rooms]);
    }

    // Additional methods for enhanced UI
    allLightsOn(): boolean {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return false;
        return currentRoom.lights.every(light => light.isOn);
    }

    toggleAllLights(): void {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        const allOn = this.allLightsOn();
        currentRoom.lights.forEach(light => {
            light.isOn = !allOn;
        });
        this.dataService.updateRoomStatus(currentRoom.id);
    }

    setScene(sceneName: string): void {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        switch (sceneName) {
            case 'evening':
                currentRoom.lights.forEach(light => {
                    light.isOn = true;
                    light.brightness = 60;
                });
                break;
            case 'night':
                currentRoom.lights.forEach(light => {
                    if (light.name.includes('Accent') || light.name.includes('Bedside')) {
                        light.isOn = true;
                        light.brightness = 15;
                    } else {
                        light.isOn = false;
                    }
                });
                break;
        }
        this.dataService.updateRoomStatus(currentRoom.id);
    }

    getRoomEnergyUsage(): number {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return 0;

        const activeLights = currentRoom.lights.filter(light => light.isOn);
        return activeLights.reduce((total, light) => {
            return total + (light.brightness * 0.8); // Estimate watts based on brightness
        }, 0);
    }

    getCurrentTime(): string {
        return this.currentTime();
    }

    // Home Assistant integration methods
    async syncWithHomeAssistant(): Promise<void> {
        try {
            const response = await fetch(`${this.haUrl}/api/states`, {
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const states = await response.json();
                this.updateLightStatesFromHA(states);
            } else {
                console.warn('Failed to fetch Home Assistant states');
            }
        } catch (error) {
            console.warn('Failed to sync with Home Assistant:', error);
        }
    }

    private updateLightStatesFromHA(states: any[]): void {
        const rooms = this.dataService.rooms();

        rooms.forEach(room => {
            room.lights.forEach(light => {
                const haState = states.find(state => state.entity_id === light.id);
                if (haState) {
                    // Handle both light and input_boolean entities
                    if (light.id.startsWith('input_boolean.')) {
                        light.isOn = haState.state === 'on';
                        // input_boolean doesn't have brightness, keep current UI value
                    } else if (light.id.startsWith('light.')) {
                        light.isOn = haState.state === 'on';
                        if (haState.attributes.brightness) {
                            light.brightness = Math.round((haState.attributes.brightness / 255) * 100);
                        }
                    }

                    console.log(`🔄 Synced ${light.id}: ${light.isOn ? 'ON' : 'OFF'} (${light.brightness}%)`);
                }
            });

            // Update room active status
            room.hasActiveDevices = room.lights.some(light => light.isOn);
        });

        this.dataService.rooms.set([...rooms]);
        console.log('✅ Home Assistant state sync completed');
    }    // Initialize Home Assistant connection
    initializeHA(): void {
        // Sync immediately
        this.syncWithHomeAssistant();

        // Set up periodic sync every 30 seconds
        setInterval(() => {
            this.syncWithHomeAssistant();
        }, 30000);
    }
}
