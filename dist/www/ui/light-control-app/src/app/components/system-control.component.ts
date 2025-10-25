import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartHomeService } from '../services/smart-home.service';

@Component({
    selector: 'app-system-control',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './system-control.component.html',
    styleUrl: './system-control.component.css'
})
export class SystemControlComponent {
    constructor(public smartHomeService: SmartHomeService) { }

    trackSensorById(index: number, sensor: any): any {
        return sensor.id;
    }
}