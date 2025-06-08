export type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  Register: undefined;
  SensorForm: { token: string; sensor?: Sensor };
  AlertForm: { token: string; alert?: AlertData };
  AlertScreen: { token: string }; 
};

export interface Sensor {
  id: number;
  name: string;
  location: string;
  active: boolean;
}

export interface AlertData {
  id: number;
  location: string;
  message: string;
  timestamp: string;
}
