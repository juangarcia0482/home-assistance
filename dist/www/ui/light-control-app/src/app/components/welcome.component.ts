import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SmartHomeDataService } from '../services/smart-home-data.service';
import { EntityMappingService } from '../services/entity-mapping.service';
import { HomeAssistantDiscoveryService } from '../services/ha-discovery.service';
import { ThemeService } from '../services/theme.service';
import { environment } from '../../environments/environment';

interface SetupStep {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
}

interface DeviceCategory {
    type: string;
    name: string;
    icon: string;
    count: number;
    devices: any[];
}

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
    Math = Math; // For template usage
    currentStep = signal(0);
    isDiscovering = signal(false);
    discoveryStatus = signal('');
    discoveryProgress = signal(0);
    setupComplete = signal(false);
    selectedTheme = signal('modern-dark');
    newRoomName = signal('');
    expandedCategories = signal<Set<string>>(new Set());
    selectedDevices = signal<Set<string>>(new Set());
    mobileAppUsers = signal<any[]>([]);
    selectedPerson = signal<string | null>(null);

    steps: SetupStep[] = [
        { id: 'welcome', title: 'Welcome to Your Smart Home', subtitle: 'Let\'s create something amazing together', icon: '🏠' },
        { id: 'themes', title: 'Choose Your Style', subtitle: 'Personalize your interface', icon: '🎨' },
        { id: 'discovery', title: 'Discovering Your Devices', subtitle: 'Finding all your smart home devices', icon: '🔍' },
        { id: 'rooms', title: 'Organize by Rooms', subtitle: 'Group your devices for better control', icon: '🏠' },
        { id: 'complete', title: 'Setup Complete!', subtitle: 'Your smart home is ready', icon: '🎉' }
    ];

    availableThemes = [
        { id: 'modern-dark', name: 'Modern Dark', preview: '#1a1a1a' },
        { id: 'modern-light', name: 'Modern Light', preview: '#ffffff' },
        { id: 'ocean-blue', name: 'Ocean Blue', preview: '#0066cc' },
        { id: 'forest-green', name: 'Forest Green', preview: '#2d5a27' },
        { id: 'sunset-orange', name: 'Sunset Orange', preview: '#ff6b35' }
    ];

    defaultRooms = [
        { name: 'Living Room', icon: '🛋️', suggested: true },
        { name: 'Kitchen', icon: '🍳', suggested: true },
        { name: 'Bedroom', icon: '🛏️', suggested: true },
        { name: 'Bathroom', icon: '🚿', suggested: true },
        { name: 'Office', icon: '💻', suggested: true }
    ];

    customRooms = signal<any[]>([]);

    // Computed properties
    selectedPersonDisplayName = computed(() => {
        const person = this.selectedPerson();
        if (!person) return '';
        const user = this.mobileAppUsers().find(u => u.entity_id === person);
        return user ? this.getUserDisplayName(user) : '';
    });

    constructor(
        public smartHomeService: SmartHomeDataService,
        private entityMappingService: EntityMappingService,
        private discoveryService: HomeAssistantDiscoveryService,
        private themeService: ThemeService,
        private router: Router
    ) { }

    ngOnInit() {
        // Initialize with current theme
        this.selectedTheme.set(this.themeService.currentTheme().id);
        // Load mobile app users on initialization
        this.loadMobileAppUsers();
    }

    async loadMobileAppUsers(): Promise<void> {
        console.log('🔍 Loading person entities from Home Assistant...');
        try {
            const response = await fetch(`${environment.homeAssistant.url}/api/states`, {
                headers: {
                    'Authorization': `Bearer ${environment.homeAssistant.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 API Response status:', response.status);

            if (response.ok) {
                const states = await response.json();
                console.log('📊 Total entities received:', states.length);

                // Filter for person entities
                const persons = states.filter((state: any) =>
                    state.entity_id.startsWith('person.')
                );

                console.log('👤 Person entities found:', persons);
                console.log('👤 Number of persons:', persons.length);

                this.mobileAppUsers.set(persons);

                if (persons.length > 0) {
                    console.log(`✅ Loaded ${persons.length} person entities from Home Assistant`);
                } else {
                    console.warn('⚠️ No person entities found in Home Assistant');
                }
            } else {
                console.error('❌ API request failed:', response.status, response.statusText);
                this.mobileAppUsers.set([]);
            }
        } catch (error) {
            console.error('💥 Error loading persons from Home Assistant:', error);
            this.mobileAppUsers.set([]);
        }
    }

    selectPerson(personEntityId: string): void {
        this.selectedPerson.set(personEntityId);
        console.log(`Selected person: ${personEntityId}`);
    }

    isPersonSelected(personEntityId: string): boolean {
        return this.selectedPerson() === personEntityId;
    } get discoveredEntities() {
        return this.entityMappingService.discoveredEntities;
    }

    deviceCategories = computed(() => {
        const entities = this.discoveredEntities();
        const categories = new Map<string, DeviceCategory>();

        entities.forEach(entity => {
            const domain = entity.entity_id.split('.')[0];
            const categoryInfo = this.getCategoryInfo(domain);

            if (categories.has(domain)) {
                const category = categories.get(domain)!;
                category.count++;
                category.devices.push(entity);
            } else {
                categories.set(domain, {
                    type: domain,
                    name: categoryInfo.name,
                    icon: categoryInfo.icon,
                    count: 1,
                    devices: [entity]
                });
            }
        });

        return Array.from(categories.values()).sort((a, b) => b.count - a.count);
    });

    allRooms = computed(() => [
        ...this.defaultRooms,
        ...this.customRooms()
    ]);

    currentStepInfo = computed(() => this.steps[this.currentStep()]);

    canProceedToNextStep = computed(() => {
        const current = this.currentStep();

        // Welcome step: require person selection if persons are available
        if (current === 0 && this.mobileAppUsers().length > 0) {
            return this.selectedPerson() !== null;
        }

        // Discovery step: require at least one device selected (now step 2)
        if (current === 2 && this.discoveredEntities().length > 0) {
            return this.selectedDevices().size > 0;
        }

        // Other steps can proceed normally
        return true;
    });

    async nextStep(): Promise<void> {
        const current = this.currentStep();

        // Validation: Check if person is selected on welcome step
        if (current === 0 && this.mobileAppUsers().length > 0 && !this.selectedPerson()) {
            alert('Please select who you are before continuing.');
            return;
        }

        // Validation: Check if devices are selected on discovery step (now step 2)
        if (current === 2 && this.discoveredEntities().length > 0 && this.selectedDevices().size === 0) {
            alert('Please select at least one device before continuing to the next step.');
            return;
        }

        if (current === 1) { // Theme step (moved to step 1)
            const theme = this.availableThemes.find(t => t.id === this.selectedTheme());
            if (theme) {
                const themeObj = this.themeService.getThemeById(theme.id);
                if (themeObj) {
                    this.themeService.setTheme(themeObj);
                }
            }
        } else if (current === 2) { // Discovery step (now step 2)
            await this.performDiscovery();
            // After discovery, automatically select devices if none are selected
            if (this.selectedDevices().size === 0) {
                return; // Don't proceed if no devices are discovered
            }
        } if (current < this.steps.length - 1) {
            this.currentStep.set(current + 1);
        }

        if (current === this.steps.length - 2) { // Last step before complete
            this.setupComplete.set(true);
        }
    }

    previousStep(): void {
        const current = this.currentStep();
        if (current > 0) {
            this.currentStep.set(current - 1);
        }
    }

    async performDiscovery(): Promise<void> {
        this.isDiscovering.set(true);
        this.discoveryProgress.set(0);

        try {
            // Simulate progressive discovery with realistic stages
            const stages = [
                { message: 'Connecting to Home Assistant...', progress: 10 },
                { message: 'Scanning for lights...', progress: 25 },
                { message: 'Finding sensors...', progress: 45 },
                { message: 'Discovering switches...', progress: 65 },
                { message: 'Checking climate controls...', progress: 80 },
                { message: 'Organizing devices...', progress: 95 },
                { message: 'Discovery complete!', progress: 100 }
            ];

            for (const stage of stages) {
                this.discoveryStatus.set(stage.message);
                this.discoveryProgress.set(stage.progress);
                await this.delay(800);
            }

            // Perform actual discovery
            await this.discoveryService.generateEntityMapping();

        } catch (error) {
            console.error('Discovery failed:', error);
            this.discoveryStatus.set('Discovery completed with some issues');
        } finally {
            this.isDiscovering.set(false);
            await this.delay(1000);
        }
    }

    addCustomRoom(): void {
        const roomName = this.newRoomName().trim();
        if (roomName && !this.allRooms().some(room => room.name.toLowerCase() === roomName.toLowerCase())) {
            this.customRooms.update(rooms => [...rooms, {
                name: roomName,
                icon: '🏠',
                suggested: false
            }]);
            this.newRoomName.set('');
        }
    }

    removeRoom(roomToRemove: any): void {
        if (!roomToRemove.suggested) {
            this.customRooms.update(rooms => rooms.filter(room => room !== roomToRemove));
        }
    }

    selectTheme(themeId: string): void {
        this.selectedTheme.set(themeId);
    }

    finishSetup(): void {
        // Apply final settings
        const theme = this.availableThemes.find(t => t.id === this.selectedTheme());
        if (theme) {
            const themeObj = this.themeService.getThemeById(theme.id);
            if (themeObj) {
                this.themeService.setTheme(themeObj);
            }
        }

        // Save selected devices configuration
        const selectedDeviceIds = Array.from(this.selectedDevices());
        const selectedEntities = this.discoveredEntities().filter(entity =>
            selectedDeviceIds.includes(entity.entity_id)
        );

        // Pass selected devices to entity mapping service
        this.entityMappingService.setSelectedEntities(selectedEntities);

        // Save room configuration with device assignments
        const roomConfig = this.allRooms().map(room => ({
            name: room.name,
            icon: room.icon,
            devices: [] // TODO: Could add room-device assignment logic here
        }));

        // Save setup configuration
        const setupConfig = {
            selectedPerson: this.selectedPerson(),
            selectedPersonName: this.selectedPersonDisplayName(),
            selectedTheme: this.selectedTheme(),
            selectedDeviceCount: this.selectedDevices().size,
            rooms: roomConfig,
            setupCompleted: new Date().toISOString()
        };

        // Store configuration (could be localStorage, service, etc.)
        localStorage.setItem('smartHomeSetup', JSON.stringify(setupConfig));

        console.log('🎉 Setup completed:', setupConfig);
        console.log('📱 Selected devices:', selectedEntities.length);

        // Navigate to main app
        this.router.navigate(['/entity-mapping']);
    }

    getCategoryInfo(domain: string): { name: string; icon: string } {
        const categoryMap: Record<string, { name: string; icon: string }> = {
            light: { name: 'Lights', icon: '💡' },
            switch: { name: 'Switches', icon: '🔌' },
            input_boolean: { name: 'Input Booleans', icon: '🎚️' },
            sensor: { name: 'Sensors', icon: '📊' },
            binary_sensor: { name: 'Binary Sensors', icon: '🔘' },
            climate: { name: 'Climate Control', icon: '🌡️' },
            cover: { name: 'Covers & Blinds', icon: '🪟' },
            fan: { name: 'Fans', icon: '🌀' },
            lock: { name: 'Locks', icon: '🔒' },
            camera: { name: 'Cameras', icon: '📹' },
            media_player: { name: 'Media Players', icon: '📺' },
            alarm_control_panel: { name: 'Alarm Systems', icon: '🚨' },
            device_tracker: { name: 'Device Trackers', icon: '📍' },
            person: { name: 'Persons', icon: '👤' },
            automation: { name: 'Automations', icon: '⚙️' },
            script: { name: 'Scripts', icon: '📜' },
            scene: { name: 'Scenes', icon: '🎭' },
            input_select: { name: 'Input Selects', icon: '📋' },
            input_number: { name: 'Input Numbers', icon: '🔢' },
            input_text: { name: 'Input Text', icon: '📝' },
            input_datetime: { name: 'Input DateTime', icon: '📅' },
            timer: { name: 'Timers', icon: '⏲️' },
            counter: { name: 'Counters', icon: '🔢' },
            vacuum: { name: 'Vacuum Cleaners', icon: '🤖' },
            water_heater: { name: 'Water Heaters', icon: '🚿' },
            humidifier: { name: 'Humidifiers', icon: '💧' },
            air_quality: { name: 'Air Quality', icon: '🌬️' },
            weather: { name: 'Weather', icon: '🌤️' },
            sun: { name: 'Sun', icon: '☀️' },
            zone: { name: 'Zones', icon: '🗺️' }
        };

        return categoryMap[domain] || { name: domain.charAt(0).toUpperCase() + domain.slice(1), icon: '📱' };
    }

    getSelectedThemeName(): string {
        const theme = this.availableThemes.find(t => t.id === this.selectedTheme());
        return theme?.name || 'Default';
    }

    toggleCategoryExpansion(categoryType: string): void {
        const expanded = new Set(this.expandedCategories());
        if (expanded.has(categoryType)) {
            expanded.delete(categoryType);
        } else {
            expanded.add(categoryType);
        }
        this.expandedCategories.set(expanded);
    }

    isCategoryExpanded(categoryType: string): boolean {
        return this.expandedCategories().has(categoryType);
    }

    toggleDeviceSelection(deviceId: string): void {
        const selected = new Set(this.selectedDevices());
        if (selected.has(deviceId)) {
            selected.delete(deviceId);
        } else {
            selected.add(deviceId);
        }
        this.selectedDevices.set(selected);
    }

    isDeviceSelected(deviceId: string): boolean {
        return this.selectedDevices().has(deviceId);
    }

    selectAllInCategory(category: DeviceCategory): void {
        const selected = new Set(this.selectedDevices());
        category.devices.forEach(device => {
            selected.add(device.entity_id);
        });
        this.selectedDevices.set(selected);
    }

    deselectAllInCategory(category: DeviceCategory): void {
        const selected = new Set(this.selectedDevices());
        category.devices.forEach(device => {
            selected.delete(device.entity_id);
        });
        this.selectedDevices.set(selected);
    }

    getSelectedDeviceCount(): number {
        return this.selectedDevices().size;
    }

    getUserDisplayName(user: any): string {
        return user.attributes?.friendly_name ||
            user.entity_id.split('.')[1].replace(/_/g, ' ');
    }

    // TrackBy functions for *ngFor loops
    trackStep(index: number, step: SetupStep): string {
        return step.id;
    }

    trackPerson(index: number, person: any): string {
        return person.entity_id;
    }

    trackTheme(index: number, theme: any): string {
        return theme.id;
    }

    trackCategory(index: number, category: DeviceCategory): string {
        return category.type;
    }

    trackDevice(index: number, device: any): string {
        return device.entity_id;
    }

    trackRoom(index: number, room: any): string {
        return room.name;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
