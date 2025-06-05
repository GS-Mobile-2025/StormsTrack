import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Sensor } from '../types';
import { API_URL } from '../types/config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation, route }: Props) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  const token = route.params.token;

  const fetchSensors = async () => {
    try {
      const response = await fetch(`${API_URL}/sensor`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar sensores');
      }

      const data = await response.json();
      setSensors(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const renderItem = ({ item }: { item: Sensor }) => (
    <TouchableOpacity
      style={styles.sensorCard}
      onPress={() => navigation.navigate('SensorDetails', { sensor: item, token })}
    >
      <Text style={styles.location}>📍 {item.location}</Text>
      <Text style={styles.temp}>🌡️ Temperatura: {item.temperature.toFixed(1)}°C</Text>
      <Text style={styles.status}>
        ⚠️ Alerta: {item.active ? 'Ativado' : 'Desativado'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores de Calor Registrados</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : (
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.alertButton}
          onPress={() => navigation.navigate('AlertForm', { token })}
        >
          <Text style={styles.buttonText}>Ver Alertas 🔥</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Cadastrar Usuário ➕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1db954',
    textAlign: 'center',
    marginBottom: 12
  },
  sensorCard: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1db954'
  },
  location: { color: '#fff', fontSize: 16 },
  temp: { color: '#ffd700', marginTop: 4 },
  status: { color: '#aaa', marginTop: 6 },
  buttonContainer: { marginTop: 16 },
  alertButton: {
    backgroundColor: '#ff3333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  registerButton: {
    backgroundColor: '#5555ff',
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
