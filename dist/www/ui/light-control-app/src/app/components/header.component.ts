import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartHomeService } from '../services/smart-home.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    constructor(public smartHomeService: SmartHomeService) { }
}