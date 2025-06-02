import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, Sensor } from '../types';

type SensorDetailsRouteProp = RouteProp<RootStackParamList, 'SensorDetails'>;

export default function SensorDetailsScreen() {
  const route = useRoute<SensorDetailsRouteProp>();
  const { sensor, token } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Detalhes do Sensor</Text>

      <View style={styles.detailBox}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{sensor.id}</Text>

        <Text style={styles.label}>Localização:</Text>
        <Text style={styles.value}>{sensor.location}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{sensor.active ? 'Ativo' : 'Inativo'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1db954',
    textAlign: 'center',
    marginBottom: 24
  },
  detailBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20
  },
  label: {
    color: '#999',
    fontSize: 16,
    marginTop: 10
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
