import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartHomeService } from '../services/smart-home.service';

@Component({
    selector: 'app-room-control',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './room-control.component.html',
    styleUrl: './room-control.component.css'
})
export class RoomControlComponent {
    constructor(public smartHomeService: SmartHomeService) { }

    getLightsOnCount(room: any): number {
        return room.lights?.filter((l: any) => l.isOn)?.length || 0;
    }

    trackLightById(index: number, light: any): any {
        return light.id;
    }
}