import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL } from '../types/config';
import { AlertData, Sensor, RootStackParamList } from '../types';

interface Props {
  route: RouteProp<RootStackParamList, 'Home'>;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen({ route }: Props) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, sensorsRes] = await Promise.all([
          fetch(`${API_URL}/alerts`, {
            headers: { Authorization: `Bearer ${route.params.token}` }
          }),
          fetch(`${API_URL}/sensors`, {
            headers: { Authorization: `Bearer ${route.params.token}` }
          })
        ]);

        const alertsData = await alertsRes.json();
        const sensorsData = await sensorsRes.json();

        setAlerts(alertsData);
        setSensors(sensorsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#1db954" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌡️ Alertas de Calor</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />

      <Text style={styles.header}>📍 Sensores Ativos</Text>
      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('SensorDetails', { token: route.params.token, sensor: item })}
            style={styles.sensorCard}>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.message}>Temperatura: {item.temperature}°C</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1db954', marginVertical: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1db954',
  },
  sensorCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00bfff',
  },
  location: { color: '#fff', fontWeight: 'bold' },
  message: { color: '#ffd700', marginTop: 4 },
  status: { color: '#aaa', marginTop: 6 },
  timestamp: { color: '#aaa', marginTop: 6, fontSize: 12 },
});
