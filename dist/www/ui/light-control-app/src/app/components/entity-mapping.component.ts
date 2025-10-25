import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityMappingService, DiscoveredEntity, RoomMapping } from '../services/entity-mapping.service';

@Component({
    selector: 'app-entity-mapping',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './entity-mapping.component.html',
    styleUrl: './entity-mapping.component.css'
})
export class EntityMappingComponent implements OnInit {
    selectedRoom: string | null = null;
    showUnmapped = true;
    searchTerm = '';
    newRoomName = '';
    newRoomIcon = '';

    constructor(public mappingService: EntityMappingService) { }

    ngOnInit(): void {
        this.mappingService.loadRoomDefinitions();
        this.discoverEntities();
    }

    async discoverEntities(): Promise<void> {
        await this.mappingService.discoverEntities();
    }

    get filteredEntities(): DiscoveredEntity[] {
        let entities = this.showUnmapped
            ? this.mappingService.getUnmappedEntities()
            : this.mappingService.discoveredEntities();

        if (this.selectedRoom && !this.showUnmapped) {
            entities = this.mappingService.getEntitiesForRoom(this.selectedRoom);
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            entities = entities.filter(entity =>
                entity.entity_id.toLowerCase().includes(term) ||
                entity.friendly_name.toLowerCase().includes(term)
            );
        }

        return entities;
    }

    selectRoom(roomId: string): void {
        this.selectedRoom = this.selectedRoom === roomId ? null : roomId;
        this.showUnmapped = false;
    }

    showUnmappedEntities(): void {
        this.showUnmapped = true;
        this.selectedRoom = null;
    }

    mapToRoom(entityId: string, roomId: string): void {
        this.mappingService.mapEntityToRoom(entityId, roomId);
    }

    unmapEntity(entityId: string, roomId: string): void {
        this.mappingService.unmapEntityFromRoom(entityId, roomId);
    }

    addRoom(): void {
        if (this.newRoomName.trim()) {
            this.mappingService.addCustomRoom(
                this.newRoomName.trim(),
                this.newRoomIcon.trim() || 'ROOM'
            );
            this.newRoomName = '';
            this.newRoomIcon = '';
        }
    }

    clearAllMappings(): void {
        if (confirm('Are you sure you want to clear all room mappings? This cannot be undone.')) {
            this.mappingService.clearAllMappings();
            this.selectedRoom = null;
            this.showUnmapped = true;
        }
    }

    getEntityIcon(entity: DiscoveredEntity): string {
        switch (entity.domain) {
            case 'light': return '💡';
            case 'switch': return '🔌';
            case 'input_boolean': return '🎛️';
            case 'fan': return '🌀';
            case 'cover': return '🚪';
            case 'sensor': return '📊';
            case 'binary_sensor': return '👁️';
            case 'climate': return '🌡️';
            case 'media_player': return '📺';
            case 'camera': return '📹';
            case 'lock': return '🔒';
            default: return '⚡';
        }
    }

    getStateColor(entity: DiscoveredEntity): string {
        return entity.state === 'on' ? '#4ade80' : '#6b7280';
    }

    getEntityPanelTitle(): string {
        if (this.showUnmapped) {
            return '📋 Unmapped Entities';
        }

        if (this.selectedRoom) {
            const room = this.mappingService.availableRooms().find(r => r.id === this.selectedRoom);
            return room ? `🏠 ${room.name}` : '🏠 Entities';
        }

        return '🏠 Entities';
    }

    onRoomSelect(entityId: string, event: Event): void {
        const target = event.target as HTMLSelectElement;
        if (target.value) {
            this.mapToRoom(entityId, target.value);
        }
    }

    getMappedEntitiesCount(): number {
        return this.mappingService.discoveredEntities().filter(e => e.mapped).length;
    }

    exportConfig(): void {
        const config = this.mappingService.exportConfiguration();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ha-entity-mappings.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (this.mappingService.importConfiguration(content)) {
                    alert('Configuration imported successfully!');
                } else {
                    alert('Failed to import configuration. Invalid format.');
                }
            };
            reader.readAsText(file);
        }
    }
}