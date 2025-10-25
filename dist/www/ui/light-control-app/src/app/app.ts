import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { SmartHomeService } from './services/smart-home.service';
import { SmartHomeDataService } from './services/smart-home-data.service';
import { HomeAssistantDiscoveryService } from './services/ha-discovery.service';
import { ThemeService } from './services/theme.service';
import { EntityMappingService } from './services/entity-mapping.service';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private currentRoute = '';

  constructor(
    public smartHomeService: SmartHomeService,
    public dataService: SmartHomeDataService,
    private discoveryService: HomeAssistantDiscoveryService,
    private themeService: ThemeService,
    private entityMappingService: EntityMappingService,
    private router: Router
  ) {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      this.checkSetupStatus();
    });
  }

  ngOnInit(): void {
    // Initialize theme system
    this.themeService.setTheme(this.themeService.currentTheme());

    // Initialize Home Assistant connection
    this.smartHomeService.initializeHA();

    // Discover and map entities (check browser console for output)
    this.discoveryService.generateEntityMapping();

    // Refresh data service with entity mappings
    this.dataService.refreshFromEntityMappings();

    // Check if we need to show welcome screen
    this.checkSetupStatus();
  }

  isSetupMode(): boolean {
    return this.currentRoute === '/welcome' || !this.isSetupComplete();
  }

  private isSetupComplete(): boolean {
    return this.entityMappingService.discoveredEntities().length > 0 &&
      this.entityMappingService.availableRooms().length > 0 &&
      this.entityMappingService.discoveredEntities().some(e => e.mapped);
  }

  private checkSetupStatus(): void {
    // If setup is not complete and we're not on welcome, redirect to welcome
    if (!this.isSetupComplete() && this.currentRoute !== '/welcome') {
      this.router.navigate(['/welcome']);
    }
    // If setup is complete and we're on welcome, redirect to entity mapping
    else if (this.isSetupComplete() && this.currentRoute === '/welcome') {
      this.router.navigate(['/entity-mapping']);
    }
  }
}
