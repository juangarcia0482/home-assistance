import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LightEntity } from '../../models/light.model';

@Component({
  selector: 'app-light-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './light-item.html',
  styleUrl: './light-item.scss'
})
export class LightItem {
  @Input() entity!: LightEntity;
  @Output() lightAction = new EventEmitter<{ type: string, entityId: string, brightness?: number }>();

  public brightness = signal<number>(51);

  ngOnInit(): void {
    this.brightness.set(this.entity.attributes.brightness || 51);
  }

  ngOnChanges(): void {
    if (this.entity?.attributes?.brightness !== undefined) {
      this.brightness.set(this.entity.attributes.brightness);
    }
  }

  toggleLight(): void {
    this.lightAction.emit({
      type: 'toggle',
      entityId: this.entity.entity_id
    });
  }

  onBrightnessChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const brightness = parseInt(target.value);
    this.brightness.set(brightness);

    this.lightAction.emit({
      type: 'brightness',
      entityId: this.entity.entity_id,
      brightness: brightness
    });
  }

  get friendlyName(): string {
    return this.entity.attributes.friendly_name ||
      this.entity.entity_id.replace('light.', '').replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
  }

  get isOn(): boolean {
    return this.entity.state === 'on';
  }

  get powerButtonClass(): string {
    return this.isOn ? 'power-btn on' : 'power-btn off';
  }

  get statusClass(): string {
    return this.isOn ? 'light-status on' : 'light-status';
  }
}
