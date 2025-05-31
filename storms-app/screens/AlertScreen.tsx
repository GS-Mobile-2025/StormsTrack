import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/index'; 
import { AlertData } from '../types/index';
import { API_URL } from '../types/config';

type HomeProps = {
  route: RouteProp<RootStackParamList, 'Alert'>;
};

export default function HomeScreen({ route }: HomeProps) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/alerts`, {
      headers: { Authorization: `Bearer ${route.params.token}` }
    })
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#1db954" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌡️ Alertas de Calor por Localização</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1db954', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1db954',
  },
  location: { color: '#fff', fontWeight: 'bold' },
  message: { color: '#ffd700', marginTop: 4 },
  timestamp: { color: '#aaa', marginTop: 6, fontSize: 12 },
});
