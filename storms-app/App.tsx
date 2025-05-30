import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SensorDetailsScreen from './screens/SensorDetailsScreen';
import { Sensor } from './types';
import { StatusBar } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  SensorDetails: { sensor: Sensor; token: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const DarkTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
    card: '#121212',
    text: '#fff',
    border: '#222',
    primary: '#1db954',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SensorDetails" component={SensorDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
