import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of, map } from 'rxjs';
import { LightEntity, ServiceCallData, HAServiceResponse } from '../models/light.model';

@Injectable({
  providedIn: 'root'
})
export class HomeAssistant {
  private http = inject(HttpClient);
  private entitiesSubject = new BehaviorSubject<{ [key: string]: LightEntity }>({});
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  public entities$ = this.entitiesSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    this.loadInitialStates();
  }

  private loadInitialStates(): void {
    this.getAllStates().subscribe({
      next: (states) => {
        const lightEntities: { [key: string]: LightEntity } = {};
        states
          .filter(entity => entity.entity_id.startsWith('light.'))
          .forEach(entity => {
            lightEntities[entity.entity_id] = entity;
          });

        this.entitiesSubject.next(lightEntities);
        this.connectionStatusSubject.next(true);
      },
      error: (error) => {
        console.error('Failed to load initial states:', error);
        this.connectionStatusSubject.next(false);
        this.loadDemoData();
      }
    });
  }

  private loadDemoData(): void {
    const demoRooms = [
      { id: 'bedroom_john', lights: ['bedroom_john_closet', 'bedroom_john_desk', 'bedroom_john_ceiling'] },
      { id: 'bedroom_guest', lights: ['bedroom_guest_closet', 'bedroom_guest_ceiling'] },
      { id: 'bedroom_master', lights: ['bedroom_master_closet', 'bedroom_master_ceiling'] },
      { id: 'bathroom_guest', lights: ['bathroom_guest_toilet', 'bathroom_guest_shower', 'bathroom_guest_ceiling'] },
      { id: 'bathroom_master', lights: ['bathroom_master_toilet', 'bathroom_master_shower', 'bathroom_master_ceiling', 'bathroom_master_cabinet', 'bathroom_master_mirror'] },
      { id: 'family_room', lights: ['family_room_wall_tv', 'family_room_couch', 'family_room_ceiling'] },
      { id: 'living_room', lights: ['living_room_wall', 'living_room_ceiling'] },
      { id: 'kitchen', lights: ['kitchen_wall', 'kitchen_ceiling', 'kitchen_cabinets', 'kitchen_island'] }
    ];

    const demoEntities: { [key: string]: LightEntity } = {};

    demoRooms.forEach(room => {
      room.lights.forEach(lightId => {
        const entityId = `light.${lightId}`;
        demoEntities[entityId] = {
          entity_id: entityId,
          state: 'off',
          attributes: {
            brightness: 51,
            friendly_name: lightId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          }
        };
      });
    });

    this.entitiesSubject.next(demoEntities);
  }

  getAllStates(): Observable<LightEntity[]> {
    return this.http.get<LightEntity[]>('/api/states').pipe(
      catchError(error => {
        console.error('API request failed:', error);
        return of([]);
      })
    );
  }

  getEntityState(entityId: string): Observable<LightEntity | null> {
    return this.http.get<LightEntity>(`/api/states/${entityId}`).pipe(
      catchError(error => {
        console.error(`Failed to get state for ${entityId}:`, error);
        return of(null);
      })
    );
  }

  turnOnLight(entityId: string, brightness?: number): Observable<HAServiceResponse> {
    const data: ServiceCallData = { entity_id: entityId };
    if (brightness !== undefined) {
      data.brightness = brightness;
    }

    return this.callService('light', 'turn_on', data);
  }

  turnOffLight(entityId: string): Observable<HAServiceResponse> {
    return this.callService('light', 'turn_off', { entity_id: entityId });
  }

  toggleLight(entityId: string): Observable<HAServiceResponse> {
    return this.callService('light', 'toggle', { entity_id: entityId });
  }

  setBrightness(entityId: string, brightness: number): Observable<HAServiceResponse> {
    return this.turnOnLight(entityId, brightness);
  }

  turnOnAllLights(): Observable<HAServiceResponse> {
    return this.callService('light', 'turn_on', { entity_id: 'light.all_lights' });
  }

  turnOffAllLights(): Observable<HAServiceResponse> {
    return this.callService('light', 'turn_off', { entity_id: 'light.all_lights' });
  }

  private callService(domain: string, service: string, data: ServiceCallData): Observable<HAServiceResponse> {
    const url = `/api/services/${domain}/${service}`;

    return this.http.post(url, data).pipe(
      map(() => ({ success: true })),
      catchError(error => {
        console.error(`Service call failed: ${domain}.${service}`, error);
        // In demo mode, simulate successful calls
        this.updateLocalState(data, service);
        return of({ success: false, message: error.message });
      })
    );
  }

  private updateLocalState(data: ServiceCallData, service: string): void {
    const currentEntities = this.entitiesSubject.value;
    const entity = currentEntities[data.entity_id];

    if (entity) {
      const updatedEntity = { ...entity };

      switch (service) {
        case 'turn_on':
          updatedEntity.state = 'on';
          if (data.brightness !== undefined) {
            updatedEntity.attributes.brightness = data.brightness;
          }
          break;
        case 'turn_off':
          updatedEntity.state = 'off';
          break;
        case 'toggle':
          updatedEntity.state = entity.state === 'on' ? 'off' : 'on';
          break;
      }

      const updatedEntities = {
        ...currentEntities,
        [data.entity_id]: updatedEntity
      };

      this.entitiesSubject.next(updatedEntities);
    }
  }

  refreshEntityState(entityId: string): void {
    this.getEntityState(entityId).subscribe(entity => {
      if (entity) {
        const currentEntities = this.entitiesSubject.value;
        this.entitiesSubject.next({
          ...currentEntities,
          [entityId]: entity
        });
      }
    });
  }
}
