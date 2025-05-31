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

export interface AlertData {
  id: number;
  location: string;
  message: string;
  timestamp: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  SensorDetails: { sensor: Sensor; token: string };
  Alert: { token: string };
};

export interface Sensor {
  id: number;
  name: string;
  location: string;
  active: boolean;
}