export interface Room {
    id: string;
    name: string;
    icon: string;
    hasActiveDevices: boolean;
    lights: Light[];
    climate?: Climate;
}

export interface Light {
    id: string;
    name: string;
    isOn: boolean;
    brightness: number;
    colorTemp?: number;
}

export interface Climate {
    currentTemp: number;
    targetTemp: number;
    mode: string;
}

export interface System {
    id: string;
    name: string;
    icon: string;
    active: boolean;
    status: string;
    description: string;
    sensors?: SecuritySensor[];
}

export interface SecuritySensor {
    id: string;
    name: string;
    location: string;
    status: string;
    icon: string;
}