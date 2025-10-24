import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room, LightEntity } from '../../models/light.model';
import { LightItem } from '../light-item/light-item';

@Component({
  selector: 'app-room-section',
  imports: [CommonModule, LightItem],
  templateUrl: './room-section.html',
  styleUrl: './room-section.scss'
})
export class RoomSection {
  @Input() room!: Room;
  @Input() entities: { [key: string]: LightEntity } = {};
  @Output() lightAction = new EventEmitter<{ type: string, entityId: string, brightness?: number }>();

  public expanded = signal<boolean>(false);

  toggleRoom(): void {
    this.expanded.set(!this.expanded());
  }

  onLightAction(action: { type: string, entityId: string, brightness?: number }): void {
    this.lightAction.emit(action);
  }

  getRoomLights(): LightEntity[] {
    return this.room.lights
      .map(lightId => this.entities[`light.${lightId}`])
      .filter(entity => entity !== undefined);
  }
}
