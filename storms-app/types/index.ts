export interface Sensor {
  id: number;
  name: string;
  active: boolean;
  location: string;
}

export interface SensorReading {
  timestamp: string;
  value: string;
}