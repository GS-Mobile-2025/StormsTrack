export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: { token: string };
  SensorDetails: { token: string; sensor: Sensor };
  SensorForm: { token: string; sensor?: Sensor };
  AlertForm: { token: string; alert?: AlertData };
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
  timestamp: string;
  active: boolean;
}


