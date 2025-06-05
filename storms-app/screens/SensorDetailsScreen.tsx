import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type Props = {
  route: RouteProp<RootStackParamList, 'SensorDetails'>;
};

export default function SensorDetailsScreen({ route }: Props) {
  const { sensor } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Detalhes do Sensor</Text>
      <Text style={styles.label}>ID:</Text>
      <Text style={styles.value}>{sensor.id}</Text>
      <Text style={styles.label}>Localização:</Text>
      <Text style={styles.value}>{sensor.location}</Text>
      <Text style={styles.label}>Temperatura Atual:</Text>
      <Text style={styles.value}>{sensor.temperature}°C</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{sensor.active ? 'Ativo' : 'Inativo'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1db954', marginBottom: 20 },
  label: { fontSize: 16, color: '#aaa', marginTop: 12 },
  value: { fontSize: 18, color: '#fff', fontWeight: '500' },
});
