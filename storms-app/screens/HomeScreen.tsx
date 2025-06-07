import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

type HomeProps = {
  route: RouteProp<RootStackParamList, 'Home'>;
};

type Sensor = {
  id: number;
  name: string;
  location: string;
  active: boolean;
};

export default function HomeScreen({ route }: HomeProps) {
  const { token } = route.params;
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Token recebido na Home:', token);

    fetch(`${API_URL}/sensors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status} ao buscar sensores`);
        }
        return response.json();
      })
      .then(data => setSensors(data))
      .catch(error => {
        console.error('Erro ao buscar sensores:', error);
        Alert.alert('Erro', 'Não foi possível carregar os sensores.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1db954" />
        <Text style={styles.loadingText}>Carregando sensores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sensores Cadastrados</Text>
      {sensors.length > 0 ? (
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>🔧 {item.name}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.status}>
                {item.active ? '🟢 Ativo' : '🔴 Inativo'}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Nenhum sensor encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#aaa',
    marginTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1db954',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    color: '#aaa',
    marginTop: 4,
  },
  status: {
    marginTop: 6,
    color: '#ffd700',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
