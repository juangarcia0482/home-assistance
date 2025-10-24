import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAssistant } from '../../services/home-assistant';
import { Room, LightEntity } from '../../models/light.model';
import { RoomSection } from '../room-section/room-section';

@Component({
  selector: 'app-light-control',
  imports: [CommonModule, RoomSection],
  templateUrl: './light-control.html',
  styleUrl: './light-control.scss'
})
export class LightControl {
  private haService = inject(HomeAssistant);

  public entities = signal<{ [key: string]: LightEntity }>({});
  public connectionStatus = signal<boolean>(false);
  public currentDisplayImage = signal<string>('/local/ui/btns/lights_off.png');
  public displayTitle = signal<string>('Smart Lighting Control');
  public displaySubtitle = signal<string>('Select a light to control');

  public rooms: Room[] = [
    {
      id: 'bedroom_john',
      name: '🛏️ Bedroom John',
      icon: 'bed',
      lights: ['bedroom_john_closet', 'bedroom_john_desk', 'bedroom_john_ceiling']
    },
    {
      id: 'bedroom_guest',
      name: '🛏️ Bedroom Guest',
      icon: 'bed',
      lights: ['bedroom_guest_closet', 'bedroom_guest_ceiling']
    },
    {
      id: 'bedroom_master',
      name: '🛏️ Bedroom Master',
      icon: 'bed',
      lights: ['bedroom_master_closet', 'bedroom_master_ceiling']
    },
    {
      id: 'bathroom_guest',
      name: '🚿 Bathroom Guest',
      icon: 'shower',
      lights: ['bathroom_guest_toilet', 'bathroom_guest_shower', 'bathroom_guest_ceiling']
    },
    {
      id: 'bathroom_master',
      name: '🚿 Bathroom Master',
      icon: 'shower',
      lights: ['bathroom_master_toilet', 'bathroom_master_shower', 'bathroom_master_ceiling', 'bathroom_master_cabinet', 'bathroom_master_mirror']
    },
    {
      id: 'family_room',
      name: '📺 Family Room',
      icon: 'tv',
      lights: ['family_room_wall_tv', 'family_room_couch', 'family_room_ceiling']
    },
    {
      id: 'living_room',
      name: '🛋️ Living Room',
      icon: 'weekend',
      lights: ['living_room_wall', 'living_room_ceiling']
    },
    {
      id: 'kitchen',
      name: '🍳 Kitchen',
      icon: 'kitchen',
      lights: ['kitchen_wall', 'kitchen_ceiling', 'kitchen_cabinets', 'kitchen_island']
    }
  ];

  constructor() {
    // Subscribe to entities and connection status
    this.haService.entities$.subscribe(entities => {
      this.entities.set(entities);
    });

    this.haService.connectionStatus$.subscribe(status => {
      this.connectionStatus.set(status);
    });
  }

  onAllLightsOn(): void {
    this.haService.turnOnAllLights().subscribe();
    this.updateDisplay('All Lights ON', 'All Lights', '/local/ui/btns/all_on.png');
  }

  onAllLightsOff(): void {
    this.haService.turnOffAllLights().subscribe();
    this.updateDisplay('All Lights OFF', 'All Lights', '/local/ui/btns/all_off.png');
  }

  onLightAction(action: { type: string, entityId: string, brightness?: number }): void {
    switch (action.type) {
      case 'toggle':
        this.haService.toggleLight(action.entityId).subscribe();
        const entity = this.entities()[action.entityId];
        const newState = entity?.state === 'on' ? 'OFF' : 'ON';
        const imageName = newState === 'ON' ? 'lights_on.png' : 'lights_off.png';
        this.updateDisplay(`Light ${newState}`, action.entityId, `/local/ui/btns/${imageName}`);
        break;
      case 'brightness':
        if (action.brightness !== undefined) {
          this.haService.setBrightness(action.entityId, action.brightness).subscribe();
          const percentage = Math.round((action.brightness / 255) * 100);
          this.updateDisplay(`Brightness ${percentage}%`, action.entityId, '/local/ui/btns/lights_on.png');
        }
        break;
    }
  }

  private updateDisplay(title: string, subtitle: string, imagePath: string): void {
    this.displayTitle.set(title);
    this.displaySubtitle.set(subtitle);
    this.currentDisplayImage.set(imagePath);
  }
}
