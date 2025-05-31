import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AlertScreen from './screens/AlertScreen';
import SensorDetailsScreen from './screens/SensorDetailsScreen';
import { RootStackParamList } from './types/index';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SensorDetails" component={SensorDetailsScreen} />
        <Stack.Screen name="Alert" component={AlertScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
