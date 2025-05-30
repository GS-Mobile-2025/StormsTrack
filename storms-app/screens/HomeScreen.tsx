import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Sensor } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation, route }: Props) {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/sensors', {
      headers: { Authorization: `Bearer ${route.params.token}` }
    })
      .then(res => res.json())
      .then(setSensors)
      .catch(console.error);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Sensores</Text>
      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SensorDetails', { sensor: item, token: route.params.token })}>
            <Text style={{ padding: 12, borderBottomWidth: 1 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
