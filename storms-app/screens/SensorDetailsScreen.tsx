import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { SensorReading } from '../types';

type Props = {
  route: RouteProp<RootStackParamList, 'SensorDetails'>;
};

export default function SensorDetailsScreen({ route }: Props) {
  const { sensor, token } = route.params;
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/sensor-readings/${sensor.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setReadings)
      .catch(console.error);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{sensor.name}</Text>
      <FlatList
        data={readings}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 8 }}>{item.timestamp} - {item.value}</Text>
        )}
      />
    </View>
  );
}
