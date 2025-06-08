import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert as RNAlert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertScreen'>;

type AlertItem = {
  id: number;
  message: string;
  classification: string;
  dateTime: string;
  sensorReading: {
    id: number;
    temperature: number;
  };
};

export default function AlertScreen({ route, navigation }: Props) {
  const { token } = route.params;
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📢 Alertas Recentes</Text>

      <FlatList
        data={alerts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alertBox}>
            <Text style={styles.classification}>⚠️ {item.classification}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.sensor}>
              Sensor #{item.sensorReading.id} • {item.sensorReading.temperature}°C
            </Text>
            <Text style={styles.time}>{new Date(item.dateTime).toLocaleString()}</Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.backButton} onPress={() => navigation.goBack()}>
            Voltar
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1db954', marginBottom: 12, textAlign: 'center' },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center'
  },
  alertBox: {
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  classification: { fontSize: 16, fontWeight: 'bold', color: '#ff4c4c' },
  message: { fontSize: 15, color: '#fff', marginTop: 4 },
  sensor: { fontSize: 13, color: '#aaa', marginTop: 4 },
  time: { fontSize: 12, color: '#888', marginTop: 2 }
});
