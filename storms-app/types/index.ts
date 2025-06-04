
export interface SensorReading {
  timestamp: string;
  value: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  Register: undefined;
  SensorDetails: { sensor: Sensor; token: string };
};

export interface AlertData {
  id: number;
  location: string;
  message: string;
  timestamp: string;
}

export interface Sensor {
  id: number;
  location: string;
  temperature: number;
  status: string;
}

