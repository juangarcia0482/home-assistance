export interface LightEntity {
    entity_id: string;
    state: 'on' | 'off';
    attributes: {
        brightness?: number;
        friendly_name?: string;
        supported_features?: number;
    };
    last_changed?: string;
    last_updated?: string;
}

export interface Room {
    id: string;
    name: string;
    icon: string;
    lights: string[];
    expanded?: boolean;
}

export interface ServiceCallData {
    entity_id: string;
    brightness?: number;
}

export interface HAServiceResponse {
    success: boolean;
    message?: string;
}