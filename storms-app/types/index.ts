
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

export type Sensor = {
  id: number;
  location: string;
  active: boolean;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: { token: string };
  SensorDetails: { sensor: Sensor; token: string };
};
