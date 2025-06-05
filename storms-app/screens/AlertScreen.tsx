import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert as RNAlert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';
import { AlertData } from '../types/index';

type Props = {
  route: RouteProp<RootStackParamList, 'AlertForm'>;
};

export default function AlertScreen({ route }: Props) {
  const { token } = route.params;
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/alerts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar alertas');
        return res.json();
      })
      .then(setAlerts)
      .catch(error => {
        console.error(error);
        RNAlert.alert('Erro', 'Não foi possível carregar os alertas.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#1db954" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📢 Alertas Recentes</Text>
      <FlatList
        data={alerts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alertBox}>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1db954', marginBottom: 12 },
  alertBox: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftColor: '#ff6347',
    borderLeftWidth: 5,
  },
  location: { color: '#fff', fontSize: 16, fontWeight: '600' },
  message: { color: '#ffd700', marginTop: 4 },
  time: { color: '#ccc', fontSize: 12, marginTop: 6 },
});
