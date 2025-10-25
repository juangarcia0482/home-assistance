import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of, map } from 'rxjs';
import { LightEntity, ServiceCallData, HAServiceResponse } from '../models/light.model';
import { environment } from '../../environments/environment';

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
    console.log('🔄 Loading initial states from Home Assistant...');
    this.getAllStates().subscribe({
      next: (states) => {
        console.log('✅ Successfully loaded states:', states.length, 'entities');
        const lightEntities: { [key: string]: LightEntity } = {};
        states
          .filter(entity => entity.entity_id.startsWith('light.'))
          .forEach(entity => {
            lightEntities[entity.entity_id] = entity;
          });

        console.log('💡 Found light entities:', Object.keys(lightEntities).length);
        this.entitiesSubject.next(lightEntities);
        this.connectionStatusSubject.next(true);
      },
      error: (error) => {
        console.error('❌ Failed to load initial states:', error);
        console.log('🔌 No Home Assistant connection - working with empty state');
        this.connectionStatusSubject.next(false);
        this.entitiesSubject.next({});
      }
    });
  }

  getAllStates(): Observable<LightEntity[]> {
    console.log('🌐 Making API request to /api/states...');
    const headers = {
      'Authorization': `Bearer ${environment.homeAssistant.token}`,
      'Content-Type': 'application/json'
    };

    return this.http.get<LightEntity[]>('/api/states', { headers }).pipe(
      catchError(error => {
        console.error('❌ API request failed:', error);
        console.error('🔍 Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        return of([]);
      })
    );
  }

  getEntityState(entityId: string): Observable<LightEntity | null> {
    const headers = {
      'Authorization': `Bearer ${environment.homeAssistant.token}`,
      'Content-Type': 'application/json'
    };

    return this.http.get<LightEntity>(`/api/states/${entityId}`, { headers }).pipe(
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
    console.log(`🎯 Calling service: ${domain}.${service}`, data);

    const headers = {
      'Authorization': `Bearer ${environment.homeAssistant.token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post(url, data, { headers }).pipe(
      map(() => ({ success: true })),
      catchError(error => {
        console.error(`❌ Service call failed: ${domain}.${service}`, error);
        return of({ success: false, message: error.message });
      })
    );
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
