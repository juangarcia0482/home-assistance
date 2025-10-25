import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityMappingService, RoomMapping } from '../services/entity-mapping.service';
import { IconService } from '../services/icon.service';

@Component({
    selector: 'app-room-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="room-management-container">
      <div class="header">
        <h2>🏠 Room Management</h2>
        <p>Create, edit, and organize your home rooms dynamically</p>
      </div>

      <!-- Add New Room -->
      <div class="add-room-section">
        <h3>➕ Add New Room</h3>
        <div class="room-form">
          <input 
            type="text" 
            [(ngModel)]="newRoom.name" 
            placeholder="Room name (e.g., Living Room)"
            class="room-input"
            (keyup.enter)="addRoom()"
          >
          
          <div class="icon-selector">
            <label>Choose Icon:</label>
            <div class="icon-grid">
              <button 
                *ngFor="let icon of availableIcons" 
                (click)="newRoom.icon = icon.emoji"
                [class.selected]="newRoom.icon === icon.emoji"
                class="icon-option"
                [title]="icon.name"
              >
                {{icon.emoji}}
              </button>
            </div>
            <input 
              type="text" 
              [(ngModel)]="newRoom.icon" 
              placeholder="Or type custom emoji"
              class="icon-input"
              maxlength="2"
            >
          </div>

          <button 
            (click)="addRoom()" 
            [disabled]="!newRoom.name.trim() || !newRoom.icon.trim()"
            class="btn-add"
          >
            ➕ Add Room
          </button>
        </div>
      </div>

      <!-- Existing Rooms -->
      <div class="existing-rooms">
        <h3>📋 Existing Rooms ({{mappingService.availableRooms().length}})</h3>
        
        <div *ngIf="mappingService.availableRooms().length === 0" class="no-rooms">
          <p>🏠 No rooms created yet. Add your first room above!</p>
        </div>

        <div class="rooms-grid">
          <div *ngFor="let room of mappingService.availableRooms()" class="room-card">
            <div class="room-header">
              <span class="room-icon">{{room.icon}}</span>
              <span class="room-name">{{room.name}}</span>
              <span class="entity-count">{{getEntityCount(room.id)}} devices</span>
            </div>

            <div class="room-actions">
              <button (click)="editRoom(room)" class="btn-edit">
                ✏️ Edit
              </button>
              <button (click)="deleteRoom(room.id)" class="btn-delete">
                🗑️ Delete
              </button>
            </div>

            <!-- Edit Mode -->
            <div *ngIf="editingRoom?.id === room.id" class="edit-form">
              <input 
                type="text" 
                [(ngModel)]="editingRoom!.name" 
                class="room-input"
                (keyup.enter)="saveRoom()"
              >
              
              <div class="icon-selector-small">
                <button 
                  *ngFor="let icon of availableIcons.slice(0, 8)" 
                  (click)="editingRoom!.icon = icon.emoji"
                  [class.selected]="editingRoom!.icon === icon.emoji"
                  class="icon-option small"
                >
                  {{icon.emoji}}
                </button>
                <input 
                  type="text" 
                  [(ngModel)]="editingRoom!.icon" 
                  class="icon-input"
                  maxlength="2"
                >
              </div>

              <div class="edit-actions">
                <button (click)="saveRoom()" class="btn-save">💾 Save</button>
                <button (click)="cancelEdit()" class="btn-cancel">❌ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div class="action-buttons">
          <button (click)="addPresetRooms()" class="btn-secondary">
            🏠 Add Common Rooms
          </button>
          <button (click)="exportRooms()" class="btn-secondary">
            📤 Export Rooms
          </button>
          <button (click)="clearAllRooms()" class="btn-delete">
            🧹 Clear All Rooms
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .room-management-container {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      background: var(--theme-surface);
      color: var(--theme-text);
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .header p {
      color: var(--theme-textSecondary);
      margin: 0;
    }

    .add-room-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .add-room-section h3 {
      margin: 0 0 1rem 0;
      color: var(--theme-primary);
    }

    .room-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .room-input, .icon-input {
      padding: 0.75rem;
      border: 2px solid var(--theme-border);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: var(--theme-text);
      font-size: 1rem;
    }

    .room-input:focus, .icon-input:focus {
      outline: none;
      border-color: var(--theme-primary);
    }

    .icon-selector {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .icon-selector label {
      font-weight: 500;
      color: var(--theme-textSecondary);
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      gap: 0.5rem;
      max-width: 400px;
    }

    .icon-option {
      width: 50px;
      height: 50px;
      border: 2px solid var(--theme-border);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--theme-text);
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-option:hover {
      border-color: var(--theme-primary);
      background: var(--theme-surface);
    }

    .icon-option.selected {
      border-color: var(--theme-primary);
      background: var(--theme-primary);
    }

    .icon-option.small {
      width: 35px;
      height: 35px;
      font-size: 1.2rem;
    }

    .btn-add, .btn-edit, .btn-delete, .btn-save, .btn-cancel, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-add {
      background: var(--theme-primary);
      color: white;
    }

    .btn-add:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-edit {
      background: var(--theme-warning);
      color: white;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
    }

    .btn-delete {
      background: var(--theme-error);
      color: white;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
    }

    .btn-save {
      background: var(--theme-success);
      color: white;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
    }

    .btn-cancel {
      background: var(--theme-textSecondary);
      color: white;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
    }

    .btn-secondary {
      background: var(--theme-secondary);
      color: white;
    }

    .existing-rooms {
      margin-bottom: 2rem;
    }

    .existing-rooms h3 {
      margin: 0 0 1rem 0;
      color: var(--theme-primary);
    }

    .no-rooms {
      text-align: center;
      padding: 2rem;
      color: var(--theme-textSecondary);
      font-style: italic;
    }

    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .room-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--theme-border);
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.2s;
    }

    .room-card:hover {
      border-color: var(--theme-primary);
    }

    .room-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .room-icon {
      font-size: 1.5rem;
    }

    .room-name {
      font-weight: 500;
      flex: 1;
    }

    .entity-count {
      background: var(--theme-primary);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
    }

    .room-actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-form {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--theme-border);
    }

    .icon-selector-small {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin: 0.5rem 0;
    }

    .edit-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .quick-actions {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .quick-actions h3 {
      margin: 0 0 1rem 0;
      color: var(--theme-primary);
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
  `]
})
export class RoomManagementComponent {
    newRoom = { name: '', icon: '' };
    editingRoom: RoomMapping | null = null;

    availableIcons = [
        { name: 'Living Room', emoji: '🛋️' },
        { name: 'Bedroom', emoji: '🛏️' },
        { name: 'Kitchen', emoji: '🍳' },
        { name: 'Bathroom', emoji: '🚿' },
        { name: 'Dining Room', emoji: '🍽️' },
        { name: 'Office', emoji: '💼' },
        { name: 'Kids Room', emoji: '🧸' },
        { name: 'Guest Room', emoji: '🛌' },
        { name: 'Basement', emoji: '🏠' },
        { name: 'Attic', emoji: '🏘️' },
        { name: 'Garage', emoji: '🚗' },
        { name: 'Laundry', emoji: '🧺' },
        { name: 'Study', emoji: '📚' },
        { name: 'Game Room', emoji: '🎮' },
        { name: 'Gym', emoji: '🏋️' },
        { name: 'Garden', emoji: '🌿' },
        { name: 'Balcony', emoji: '🪴' },
        { name: 'Patio', emoji: '🏡' }
    ];

    constructor(
        public mappingService: EntityMappingService,
        private iconService: IconService
    ) { }

    addRoom(): void {
        if (this.newRoom.name.trim() && this.newRoom.icon.trim()) {
            this.mappingService.addCustomRoom(
                this.newRoom.name.trim(),
                this.newRoom.icon.trim()
            );
            this.newRoom = { name: '', icon: '' };
        }
    }

    editRoom(room: RoomMapping): void {
        this.editingRoom = { ...room };
    }

    saveRoom(): void {
        if (this.editingRoom) {
            this.mappingService.updateRoom(
                this.editingRoom.id,
                this.editingRoom.name,
                this.editingRoom.icon
            );
            this.editingRoom = null;
        }
    }

    cancelEdit(): void {
        this.editingRoom = null;
    }

    deleteRoom(roomId: string): void {
        const room = this.mappingService.availableRooms().find(r => r.id === roomId);
        const entityCount = this.getEntityCount(roomId);

        let message = `Are you sure you want to delete "${room?.name}"?`;
        if (entityCount > 0) {
            message += `\n\nThis will also unmap ${entityCount} device(s) from this room.`;
        }

        if (confirm(message)) {
            this.mappingService.deleteRoom(roomId);
        }
    }

    getEntityCount(roomId: string): number {
        return this.mappingService.getEntitiesForRoom(roomId).length;
    }

    addPresetRooms(): void {
        const presetRooms = [
            { name: 'Living Room', icon: '🛋️' },
            { name: 'Master Bedroom', icon: '🛏️' },
            { name: 'Guest Bedroom', icon: '🛌' },
            { name: 'Kitchen', icon: '🍳' },
            { name: 'Bathroom', icon: '🚿' },
            { name: 'Office', icon: '💼' }
        ];

        let added = 0;
        presetRooms.forEach(room => {
            const exists = this.mappingService.availableRooms()
                .some(r => r.name.toLowerCase() === room.name.toLowerCase());

            if (!exists) {
                this.mappingService.addCustomRoom(room.name, room.icon);
                added++;
            }
        });

        if (added > 0) {
            alert(`Added ${added} preset rooms!`);
        } else {
            alert('All preset rooms already exist.');
        }
    }

    exportRooms(): void {
        const rooms = this.mappingService.availableRooms();
        const dataStr = JSON.stringify({ rooms, timestamp: new Date().toISOString() }, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `home-rooms-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    clearAllRooms(): void {
        const roomCount = this.mappingService.availableRooms().length;
        if (roomCount === 0) {
            alert('No rooms to clear.');
            return;
        }

        if (confirm(`Are you sure you want to delete all ${roomCount} rooms?\n\nThis will also clear all device mappings and cannot be undone.`)) {
            this.mappingService.clearAllMappings();
            this.editingRoom = null;
        }
    }
}