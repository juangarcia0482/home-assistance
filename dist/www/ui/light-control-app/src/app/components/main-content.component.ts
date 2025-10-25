import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartHomeService } from '../services/smart-home.service';
import { RoomControlComponent } from './room-control.component';
import { SystemControlComponent } from './system-control.component';
import { WelcomeComponent } from './welcome.component';

@Component({
    selector: 'app-main-content',
    standalone: true,
    imports: [CommonModule, RoomControlComponent, SystemControlComponent, WelcomeComponent],
    templateUrl: './main-content.component.html',
    styleUrl: './main-content.component.css'
})
export class MainContentComponent {
    constructor(public smartHomeService: SmartHomeService) { }
}