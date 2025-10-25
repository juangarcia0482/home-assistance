import { Component, signal, computed, OnInit, effect } from '@angular/core';
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
    discoveryCompleted = signal(false);
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
        { name: 'Living Room', icon: '🛋️', suggested: true, id: 'default_living_room' },
        { name: 'Kitchen', icon: '🍳', suggested: true, id: 'default_kitchen' },
        { name: 'Bedroom', icon: '🛏️', suggested: true, id: 'default_bedroom' },
        { name: 'Bathroom', icon: '🚿', suggested: true, id: 'default_bathroom' },
        { name: 'Office', icon: '💻', suggested: true, id: 'default_office' }
    ];

    customRooms = signal<any[]>([]);

    // Enhanced room organization features
    organizationMode = signal<'setup' | 'assign' | 'preview'>('setup');
    previewView = signal<'grid' | 'list' | 'compact'>('grid');
    deviceRoomAssignments = signal<Map<string, string>>(new Map());
    dragOverRoom = signal<string | null>(null);
    editingRoom = signal<string | null>(null);
    activeRoomMenu = signal<string | null>(null);

    // Dialog states
    showAddRoomDialog = signal(false);
    showEditRoomDialog = signal(false);
    editingRoomData = signal<any | null>(null);
    editRoomName = signal('');
    editRoomIcon = signal('🏠');
    editRoomType = signal('other');
    newRoomIcon = signal('🏠');
    newRoomType = signal('other');
    deviceTypeFilter = signal('');
    selectedTemplate = signal<any | null>(null);

    // Smart suggestions
    smartSuggestions = signal<any[]>([]);
    dismissedSuggestions = signal<Set<string>>(new Set());

    // Room templates for quick setup
    roomTemplates = [
        {
            name: 'Apartment (Studio/1-2BR)',
            icon: '🏠',
            rooms: [
                { name: 'Entry/Hallway', icon: '🚪' },
                { name: 'Living Room', icon: '🛋️' },
                { name: 'Kitchen', icon: '🍳' },
                { name: 'Bedroom', icon: '🛏️' },
                { name: 'Bathroom', icon: '🚿' },
                { name: 'Closet/Storage', icon: '🧺' },
                { name: 'Balcony', icon: '🌿' }
            ]
        },
        {
            name: 'Small House (2-3BR)',
            icon: '🏠',
            rooms: [
                { name: 'Entry/Foyer', icon: '🚪' },
                { name: 'Living Room', icon: '🛋️' },
                { name: 'Dining Area', icon: '🍽️' },
                { name: 'Kitchen', icon: '🍳' },
                { name: 'Master Bedroom', icon: '🛏️' },
                { name: 'Bedroom 2', icon: '🛏️' },
                { name: 'Bathroom', icon: '🚿' },
                { name: 'Laundry', icon: '🧺' },
                { name: 'Garage', icon: '🚗' },
                { name: 'Backyard', icon: '🌱' }
            ]
        },
        {
            name: 'Medium House (3-4BR)',
            icon: '🏡',
            rooms: [
                { name: 'Entry/Foyer', icon: '🚪' },
                { name: 'Living Room', icon: '🛋️' },
                { name: 'Dining Room', icon: '🍽️' },
                { name: 'Kitchen', icon: '🍳' },
                { name: 'Master Suite', icon: '🛏️' },
                { name: 'Bedroom 2', icon: '🛏️' },
                { name: 'Bedroom 3', icon: '🛏️' },
                { name: 'Master Bath', icon: '🚿' },
                { name: 'Bathroom 2', icon: '🚿' },
                { name: 'Family Room', icon: '📺' },
                { name: 'Home Office', icon: '💻' },
                { name: 'Laundry Room', icon: '🧺' },
                { name: 'Garage (2-car)', icon: '🚗' },
                { name: 'Pantry', icon: '🥫' },
                { name: 'Deck/Backyard', icon: '�' }
            ]
        },
        {
            name: 'Big House (4-6BR)',
            icon: '🏘️',
            rooms: [
                { name: 'Grand Foyer', icon: '🚪' },
                { name: 'Formal Living Room', icon: '🛋️' },
                { name: 'Family Room', icon: '📺' },
                { name: 'Formal Dining Room', icon: '🍽️' },
                { name: 'Kitchen', icon: '🍳' },
                { name: 'Breakfast Nook', icon: '☕' },
                { name: 'Master Suite', icon: '🛏️' },
                { name: 'Master Bath', icon: '🚿' },
                { name: 'Master Closet', icon: '👔' },
                { name: 'Bedroom 2', icon: '🛏️' },
                { name: 'Bedroom 3', icon: '🛏️' },
                { name: 'Bedroom 4', icon: '🛏️' },
                { name: 'Guest Room', icon: '🛏️' },
                { name: 'Bathroom 2', icon: '🚿' },
                { name: 'Bathroom 3', icon: '🚿' },
                { name: 'Office/Study', icon: '💻' },
                { name: 'Game Room', icon: '🎮' },
                { name: 'Laundry Room', icon: '🧺' },
                { name: 'Garage (3-car)', icon: '🚗' },
                { name: 'Mudroom', icon: '🥾' },
                { name: 'Pantry', icon: '🥫' },
                { name: 'Patio/Deck', icon: '🪴' }
            ]
        },
        {
            name: 'Mansion (6+ BR)',
            icon: '🏰',
            rooms: [
                { name: 'Grand Foyer', icon: '✨' },
                { name: 'Formal Living Room', icon: '🛋️' },
                { name: 'Family Room', icon: '📺' },
                { name: 'Formal Dining Room', icon: '🍽️' },
                { name: 'Breakfast Room', icon: '☕' },
                { name: 'Chef\'s Kitchen', icon: '🍳' },
                { name: 'Butler\'s Pantry', icon: '�' },
                { name: 'Master Wing', icon: '👑' },
                { name: 'Master Bath', icon: '🛁' },
                { name: 'His Closet', icon: '👔' },
                { name: 'Her Closet', icon: '👗' },
                { name: 'Guest Suite 1', icon: '🛏️' },
                { name: 'Guest Suite 2', icon: '🛏️' },
                { name: 'Guest Suite 3', icon: '🛏️' },
                { name: 'Bedroom 4', icon: '🛏️' },
                { name: 'Bedroom 5', icon: '🛏️' },
                { name: 'Bedroom 6', icon: '🛏️' },
                { name: 'Library/Study', icon: '�' },
                { name: 'Home Office', icon: '💻' },
                { name: 'Game Room', icon: '🎮' },
                { name: 'Home Theater', icon: '🎬' },
                { name: 'Wine Cellar', icon: '🍷' },
                { name: 'Gym/Fitness', icon: '🏋️' },
                { name: 'Spa/Sauna', icon: '🧖' },
                { name: 'Indoor Pool', icon: '🏊' },
                { name: 'Ballroom', icon: '💃' },
                { name: 'Laundry Room', icon: '🧺' },
                { name: 'Staff Quarters', icon: '🛏️' },
                { name: 'Garage (4-car)', icon: '🚗' },
                { name: 'Pool House', icon: '🏖️' },
                { name: 'Guest House', icon: '🏡' },
                { name: 'Tennis Court', icon: '🎾' },
                { name: 'Gardens', icon: '🌺' }
            ]
        },
        {
            name: 'Smart Office',
            icon: '🏢',
            rooms: [
                { name: 'Main Office', icon: '💻' },
                { name: 'Meeting Room', icon: '🤝' },
                { name: 'Break Room', icon: '☕' },
                { name: 'Reception', icon: '🎫' }
            ]
        }
    ];

    // Available room icons
    availableRoomIcons = [
        '🏠', '🛋️', '🛏️', '🍳', '🚿', '💻', '🧸', '🚗', '🌱', '🏃‍♂️',
        '📚', '🎵', '🎮', '🍽️', '☕', '🧺', '🔧', '🌿', '🎭', '🎨'
    ];

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
    ) {
        // Add effect to track step changes
        effect(() => {
            const currentStep = this.currentStep();
            console.log('🔄 Step changed to:', currentStep);
            console.log('📋 Step info:', this.steps[currentStep]);
            console.log('🎯 Is step 3 (rooms)?', currentStep === 3);

            if (currentStep === 3) {
                console.log('🏠 ROOMS STEP IS ACTIVE!');
                console.log('🔍 defaultRooms length:', this.defaultRooms.length);
                console.log('🔍 customRooms length:', this.customRooms().length);
                console.log('🔍 allRooms length:', this.allRooms().length);

                // Auto-select first template if none selected
                if (!this.selectedTemplate() && this.roomTemplates.length > 0) {
                    this.selectedTemplate.set(this.roomTemplates[0]);
                    console.log('🎯 Auto-selected first template:', this.roomTemplates[0].name);
                }
            }
        });
    }

    ngOnInit() {
        // Initialize with current theme
        this.selectedTheme.set(this.themeService.currentTheme().id);
        // Load mobile app users on initialization
        this.loadMobileAppUsers();

        // Debug logging
        console.log('🚀 WelcomeComponent initialized');
        console.log('📊 Initial currentStep:', this.currentStep());
        console.log('📝 Steps array:', this.steps);

        // Watch for step changes
        setInterval(() => {
            console.log('⏰ Current step check:', this.currentStep());
        }, 2000);
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

    allRooms = computed(() => {
        // If a template is selected, show template rooms + custom rooms
        const template = this.selectedTemplate();
        if (template) {
            const templateIndex = this.roomTemplates.indexOf(template);
            const templateRooms = template.rooms.map((room: any, i: number) => ({
                ...room,
                suggested: true,
                id: `suggested_${templateIndex}_${i}_${room.name.replace(/\s+/g, '_').toLowerCase()}`
            }));
            return [...templateRooms, ...this.customRooms()];
        }
        // Otherwise show default + custom rooms
        return [
            ...this.defaultRooms,
            ...this.customRooms()
        ];
    });

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

        // Rooms step: require at least one room to proceed
        if (current === 3) {
            return this.allRooms().length > 0;
        }

        // Other steps can proceed normally
        return true;
    });

    // Computed to check if user can proceed within room organization wizard
    canProceedInRoomWizard = computed(() => {
        const mode = this.organizationMode();

        // From setup mode: need at least 1 room
        if (mode === 'setup') {
            return this.allRooms().length > 0;
        }

        // From assign mode: can always go to preview
        if (mode === 'assign') {
            return true;
        }

        // From preview mode: should be ready to continue
        return true;
    });

    async nextStep(): Promise<void> {
        const current = this.currentStep();
        console.log('🔄 nextStep() called from step:', current);

        // Validation: Check if person is selected on welcome step
        if (current === 0 && this.mobileAppUsers().length > 0 && !this.selectedPerson()) {
            console.log('❌ Validation failed: No person selected');
            alert('Please select who you are before continuing.');
            return;
        }

        // Validation: Check if devices are selected on discovery step (now step 2)
        if (current === 2 && this.discoveredEntities().length > 0 && this.selectedDevices().size === 0) {
            console.log('❌ Validation failed: No devices selected');
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
        }

        // Move to next step (this should happen for all steps)
        if (current < this.steps.length - 1) {
            console.log('✅ Moving to next step:', current + 1);
            this.currentStep.set(current + 1);
            console.log('📍 New currentStep value:', this.currentStep());
        } else {
            console.log('🚫 Already at last step, cannot proceed');
        }

        if (current === this.steps.length - 2) { // Last step before complete
            this.setupComplete.set(true);
        }
    }

    previousStep(): void {
        const current = this.currentStep();
        console.log('⬅️ previousStep() called from step:', current);
        if (current > 0) {
            console.log('✅ Moving to previous step:', current - 1);
            this.currentStep.set(current - 1);
            console.log('📍 New currentStep value:', this.currentStep());
        } else {
            console.log('🚫 Already at first step, cannot go back');
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

            // Mark discovery as completed
            this.discoveryCompleted.set(true);
            console.log('✅ Discovery completed and marked as complete');

        } catch (error) {
            console.error('Discovery failed:', error);
            this.discoveryStatus.set('Discovery completed with some issues');
            // Still mark as completed even if there were issues
            this.discoveryCompleted.set(true);
        } finally {
            this.isDiscovering.set(false);
            await this.delay(1000);
        }
    }

    async retryDiscovery(): Promise<void> {
        console.log('🔄 Retrying discovery...');
        // Reset discovery state
        this.discoveryCompleted.set(false);
        this.selectedDevices.set(new Set());

        // Perform discovery again
        await this.performDiscovery();
        this.discoveryCompleted.set(true);
    }

    addCustomRoom(): void {
        const roomName = this.newRoomName().trim();
        if (roomName && !this.allRooms().some(room => room.name.toLowerCase() === roomName.toLowerCase())) {
            this.customRooms.update(rooms => [...rooms, {
                name: roomName,
                icon: '🏠',
                suggested: false,
                id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }]);
            this.newRoomName.set('');
        }
    }

    // Enhanced room management methods
    addCustomRoomAdvanced(): void {
        const roomName = this.newRoomName().trim();
        if (roomName && !this.allRooms().some(room => room.name.toLowerCase() === roomName.toLowerCase())) {
            this.customRooms.update(rooms => [...rooms, {
                name: roomName,
                icon: this.newRoomIcon(),
                type: this.newRoomType(),
                suggested: false,
                id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }]);
            this.newRoomName.set('');
            this.newRoomIcon.set('🏠');
            this.newRoomType.set('other');
            this.showAddRoomDialog.set(false);
        }
    }

    applyRoomTemplate(template: any): void {
        // Set the selected template - this will dynamically update allRooms()
        this.selectedTemplate.set(template);
        console.log(`Applied template: ${template.name}`);
    }

    clearAllRooms(): void {
        if (confirm('Are you sure you want to remove all custom rooms? This will also unassign all devices.')) {
            this.customRooms.set([]);
            this.deviceRoomAssignments.set(new Map());
            this.selectedTemplate.set(null);
        }
    }

    editRoom(room: any): void {
        // Open edit dialog for any room (suggested or custom)
        this.editingRoomData.set(room);
        this.editRoomName.set(room.name);
        this.editRoomIcon.set(room.icon || '🏠'); // Ensure there's always an icon
        this.editRoomType.set(room.type || 'other'); // Ensure there's always a type
        this.showEditRoomDialog.set(true);
        this.activeRoomMenu.set(null);
    }

    saveEditedRoom(): void {
        const room = this.editingRoomData();
        const newName = this.editRoomName().trim();
        const newIcon = this.editRoomIcon();
        const newType = this.editRoomType();

        if (!newName) {
            alert('Room name cannot be empty');
            return;
        }

        if (!newIcon) {
            alert('Room icon cannot be empty');
            return;
        }

        // Check for duplicate names (excluding current room)
        const duplicate = this.allRooms().find(r =>
            r.id !== room.id && r.name.toLowerCase() === newName.toLowerCase()
        );
        if (duplicate) {
            alert('A room with this name already exists');
            return;
        }

        // If editing a suggested room, create a custom copy
        if (room.suggested) {
            const customRoom = {
                name: newName,
                icon: newIcon,
                type: newType,
                suggested: false,
                id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
            this.customRooms.update(rooms => [...rooms, customRoom]);

            // Transfer device assignments from old room to new room
            const assignments = new Map(this.deviceRoomAssignments());
            const devicesToMove: string[] = [];
            assignments.forEach((roomId, deviceId) => {
                if (roomId === room.id) {
                    devicesToMove.push(deviceId);
                }
            });
            devicesToMove.forEach(deviceId => {
                assignments.set(deviceId, customRoom.id);
            });
            this.deviceRoomAssignments.set(assignments);
        } else {
            // Update custom room
            this.customRooms.update(rooms =>
                rooms.map(r => r.id === room.id ? { ...r, name: newName, icon: newIcon, type: newType } : r)
            );
        }

        // Close dialog
        this.showEditRoomDialog.set(false);
        this.editingRoomData.set(null);
    }

    cancelEditRoom(): void {
        this.showEditRoomDialog.set(false);
        this.editingRoomData.set(null);
    }

    duplicateRoom(room: any): void {
        const newRoom = {
            name: `${room.name} Copy`,
            icon: room.icon,
            suggested: false,
            id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        this.customRooms.update(rooms => [...rooms, newRoom]);
        this.activeRoomMenu.set(null);
    }

    toggleRoomMenu(roomId: string): void {
        this.activeRoomMenu.set(this.activeRoomMenu() === roomId ? null : roomId);
    }

    // Organization mode methods
    setOrganizationMode(mode: 'setup' | 'assign' | 'preview'): void {
        // Wizard logic: can't skip setup if no rooms exist
        if (mode !== 'setup' && this.allRooms().length === 0) {
            alert('Please set up at least one room before proceeding.');
            return;
        }

        this.organizationMode.set(mode);
        this.activeRoomMenu.set(null);
    }

    // Navigate forward in room organization wizard
    nextRoomWizardStep(): void {
        const current = this.organizationMode();

        if (current === 'setup') {
            if (this.allRooms().length === 0) {
                alert('Please set up at least one room before continuing.');
                return;
            }
            this.setOrganizationMode('assign');
        } else if (current === 'assign') {
            this.setOrganizationMode('preview');
        }
        // From preview, user clicks main "Continue" button
    }

    // Navigate backward in room organization wizard
    previousRoomWizardStep(): void {
        const current = this.organizationMode();

        if (current === 'preview') {
            this.setOrganizationMode('assign');
        } else if (current === 'assign') {
            this.setOrganizationMode('setup');
        }
    }

    setPreviewView(view: 'grid' | 'list' | 'compact'): void {
        this.previewView.set(view);
    }

    // Device assignment methods
    getRoomDevices(room: any): any[] {
        const assignments = this.deviceRoomAssignments();
        return this.discoveredEntities().filter(device =>
            this.selectedDevices().has(device.entity_id) &&
            assignments.get(device.entity_id) === (room.id || room.name)
        );
    }

    getRoomDeviceCount(room: any): number {
        return this.getRoomDevices(room).length;
    }

    getUnassignedDevices(): any[] {
        const assignments = this.deviceRoomAssignments();
        return this.discoveredEntities().filter(device =>
            this.selectedDevices().has(device.entity_id) &&
            !assignments.has(device.entity_id)
        );
    }

    getFilteredUnassignedDevices(): any[] {
        const unassigned = this.getUnassignedDevices();
        if (!this.deviceTypeFilter()) {
            return unassigned;
        }
        return unassigned.filter(device =>
            device.entity_id.startsWith(this.deviceTypeFilter() + '.')
        );
    }

    getAssignedDeviceCount(): number {
        return this.deviceRoomAssignments().size;
    }

    getOrganizationCompletionRate(): number {
        const totalDevices = this.selectedDevices().size;
        const assignedDevices = this.deviceRoomAssignments().size;
        return totalDevices === 0 ? 100 : Math.round((assignedDevices / totalDevices) * 100);
    }

    // Drag and drop methods
    onDeviceDragStart(event: DragEvent, device: any): void {
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', device.entity_id);
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    onRoomDragOver(event: DragEvent, room: any): void {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        this.dragOverRoom.set(room.id || room.name);
    }

    onRoomDrop(event: DragEvent, room: any): void {
        event.preventDefault();
        const deviceId = event.dataTransfer!.getData('text/plain');
        if (deviceId) {
            this.assignDeviceToRoom(deviceId, room.id || room.name);
        }
        this.dragOverRoom.set(null);
    }

    onRoomDragLeave(event: DragEvent, room: any): void {
        this.dragOverRoom.set(null);
    }

    isDragOver(roomId: string): boolean {
        return this.dragOverRoom() === roomId;
    }

    // Device assignment utility methods
    assignDeviceToRoom(deviceId: string, roomId: string): void {
        const assignments = new Map(this.deviceRoomAssignments());
        assignments.set(deviceId, roomId);
        this.deviceRoomAssignments.set(assignments);
    }

    removeDeviceFromRoom(device: any, room: any): void {
        const assignments = new Map(this.deviceRoomAssignments());
        assignments.delete(device.entity_id);
        this.deviceRoomAssignments.set(assignments);
    }

    quickAssignDevice(device: any, event: any): void {
        const roomId = event.target.value;
        if (roomId) {
            this.assignDeviceToRoom(device.entity_id, roomId);
            event.target.value = '';
        }
    }

    clearRoomDevices(room: any): void {
        const assignments = new Map(this.deviceRoomAssignments());
        this.getRoomDevices(room).forEach(device => {
            assignments.delete(device.entity_id);
        });
        this.deviceRoomAssignments.set(assignments);
    }

    // Smart suggestions methods
    getSmartAssignmentSuggestions(): any[] {
        const suggestions: any[] = [];
        const dismissedSet = this.dismissedSuggestions();

        this.getUnassignedDevices().forEach(device => {
            const suggestionKey = `${device.entity_id}`;
            if (dismissedSet.has(suggestionKey)) return;

            const deviceName = (device.attributes?.friendly_name || device.entity_id).toLowerCase();
            const deviceDomain = device.entity_id.split('.')[0];

            // Smart matching logic
            this.allRooms().forEach(room => {
                const roomName = room.name.toLowerCase();
                let confidence = 0;

                // Name-based matching
                if (deviceName.includes(roomName.replace(' ', '_')) ||
                    deviceName.includes(roomName.replace(' ', ''))) {
                    confidence += 80;
                }

                // Room type matching
                if (roomName.includes('bedroom') && deviceName.includes('bed')) confidence += 70;
                if (roomName.includes('kitchen') && deviceName.includes('kitchen')) confidence += 70;
                if (roomName.includes('living') && deviceName.includes('living')) confidence += 70;
                if (roomName.includes('bathroom') && deviceName.includes('bath')) confidence += 70;

                // Device type matching
                if (deviceDomain === 'light' && !roomName.includes('outdoor')) confidence += 30;
                if (deviceDomain === 'switch' && roomName.includes('garage')) confidence += 40;
                if (deviceDomain === 'sensor' && deviceName.includes('door')) confidence += 50;

                if (confidence >= 60) {
                    suggestions.push({
                        device,
                        room,
                        confidence: Math.min(confidence, 95),
                        key: suggestionKey
                    });
                }
            });
        });

        return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    }

    acceptSuggestion(suggestion: any): void {
        this.assignDeviceToRoom(suggestion.device.entity_id, suggestion.room.id || suggestion.room.name);
        this.dismissSuggestion(suggestion);
    }

    dismissSuggestion(suggestion: any): void {
        const dismissed = new Set(this.dismissedSuggestions());
        dismissed.add(suggestion.key);
        this.dismissedSuggestions.set(dismissed);
    }

    acceptAllSuggestions(): void {
        this.getSmartAssignmentSuggestions().forEach(suggestion => {
            this.acceptSuggestion(suggestion);
        });
    }

    // Auto-organize method
    autoOrganizeDevices(): void {
        if (confirm('This will automatically assign devices to rooms based on their names. Continue?')) {
            this.getSmartAssignmentSuggestions().forEach(suggestion => {
                if (suggestion.confidence >= 70) {
                    this.assignDeviceToRoom(suggestion.device.entity_id, suggestion.room.id || suggestion.room.name);
                }
            });
        }
    }

    resetRoomOrganization(): void {
        if (confirm('This will remove all device-to-room assignments. Continue?')) {
            this.deviceRoomAssignments.set(new Map());
            this.dismissedSuggestions.set(new Set());
        }
    }

    // Device utility methods
    getDeviceIcon(device: any): string {
        const domain = device.entity_id.split('.')[0];
        const iconMap: Record<string, string> = {
            light: '💡',
            switch: '🔌',
            sensor: '📊',
            binary_sensor: '🔘',
            climate: '🌡️',
            cover: '🪟',
            fan: '🌀',
            lock: '🔒',
            camera: '📹',
            media_player: '📺'
        };
        return iconMap[domain] || '📱';
    }

    getDeviceTypeLabel(device: any): string {
        const domain = device.entity_id.split('.')[0];
        return this.getCategoryInfo(domain).name;
    }

    getDeviceStatusClass(device: any): string {
        if (device.state === 'on' || device.state === 'open') return 'status-on';
        if (device.state === 'off' || device.state === 'closed') return 'status-off';
        return 'status-unknown';
    }

    // TrackBy functions
    trackTemplate(index: number, template: any): string {
        return template.name;
    }

    // Additional helper methods for the enhanced room functionality
    showEmojiPicker(room: any): void {
        // For now, cycle through some common room icons
        const icons = ['🏠', '🛋️', '🛏️', '🍳', '🚿', '💻', '🌱', '📚', '🎵', '🧸'];
        const currentIndex = icons.indexOf(room.icon);
        const nextIndex = (currentIndex + 1) % icons.length;

        if (room.suggested) {
            // First try updating defaultRooms by id
            const roomIndex = this.defaultRooms.findIndex(r => r.id === room.id || r.name === room.name);
            if (roomIndex !== -1) {
                this.defaultRooms[roomIndex].icon = icons[nextIndex];
            } else {
                // If it's from a selected template, update the template definition if possible
                const tpl = this.selectedTemplate();
                if (tpl) {
                    const tplRoomIndex = tpl.rooms.findIndex((r: any) => r.name === room.name);
                    if (tplRoomIndex !== -1) {
                        tpl.rooms[tplRoomIndex].icon = icons[nextIndex];
                    }
                }
            }
        } else {
            // Update in customRooms by id
            this.customRooms.update(rooms =>
                rooms.map(r => r.id === room.id ? { ...r, icon: icons[nextIndex] } : r)
            );
        }
    }

    removeRoom(roomToRemove: any): void {
        // Only allow removal of non-suggested (custom) rooms
        if (!roomToRemove.suggested) {
            // Filter by id to avoid accidental object-equality bugs
            this.customRooms.update(rooms => rooms.filter(room => room.id !== roomToRemove.id));
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
        const assignments = this.deviceRoomAssignments();
        const roomConfig = this.allRooms().map(room => ({
            name: room.name,
            icon: room.icon,
            type: room.type || 'other',
            suggested: room.suggested || false,
            devices: this.getRoomDevices(room).map(device => ({
                entity_id: device.entity_id,
                friendly_name: device.attributes?.friendly_name || device.entity_id,
                domain: device.entity_id.split('.')[0],
                state: device.state
            }))
        }));

        // Save setup configuration with enhanced data
        const setupConfig = {
            selectedPerson: this.selectedPerson(),
            selectedPersonName: this.selectedPersonDisplayName(),
            selectedTheme: this.selectedTheme(),
            selectedDeviceCount: this.selectedDevices().size,
            rooms: roomConfig,
            deviceAssignments: Object.fromEntries(assignments),
            organizationCompletionRate: this.getOrganizationCompletionRate(),
            setupCompleted: new Date().toISOString(),
            version: '2.0' // Mark as enhanced setup
        };

        // Store configuration (could be localStorage, service, etc.)
        localStorage.setItem('smartHomeSetup', JSON.stringify(setupConfig));

        console.log('🎉 Enhanced setup completed:', setupConfig);
        console.log('📱 Selected devices:', selectedEntities.length);
        console.log('🏠 Room assignments:', assignments.size);
        console.log('📊 Organization completion:', this.getOrganizationCompletionRate() + '%');

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
        // Use unique ID if available, otherwise fall back to combination of name and suggested flag
        return room.id || `${room.suggested ? 'suggested' : 'custom'}_${room.name}`;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
