import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SmartHomeService } from '../services/smart-home.service';
import { SmartHomeDataService } from '../services/smart-home-data.service';
import { RoomManagementComponent } from './room-management.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, RoomManagementComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    showRoomModal = false;

    constructor(
        public smartHomeService: SmartHomeService,
        public dataService: SmartHomeDataService,
        private router: Router
    ) { }

    openRoomManagementModal(): void {
        this.showRoomModal = true;
    }

    closeRoomManagementModal(): void {
        this.showRoomModal = false;
    }

    selectRoom(roomId: string): void {
        this.smartHomeService.selectRoom(roomId);
        this.router.navigate(['/home']);
    }

    selectSystem(systemId: string): void {
        this.smartHomeService.selectSystem(systemId);
        this.router.navigate(['/home']);
    }

    getLightsOnCount(room: any): number {
        return room.lights?.filter((l: any) => l.isOn)?.length || 0;
    }

    trackRoomById(index: number, room: any): any {
        return room.id;
    }

    trackSystemById(index: number, system: any): any {
        return system.id;
    }
}