import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Sensor } from '../types';
import AlertScreen from './AlertScreen';
import { API_URL } from '../types/config';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

export default function HomeScreen({ navigation, route }: Props) {
  const { token } = route.params;
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch(`${API_URL}/sensors`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        setSensors(data);
      } catch (error) {
        console.error('Erro ao buscar sensores:', error);
      }
    };

    fetchSensors();
  }, [token]);

  const renderSensor = ({ item }: { item: Sensor }) => (
    <TouchableOpacity
      style={styles.sensorCard}
      onPress={() => navigation.navigate('SensorDetails', { sensor: item, token })}
    >
      <Text style={styles.sensorLocation}>📍 {item.location}</Text>
      <Text style={styles.sensorStatus}>Status: {item.active ? 'Ativo' : 'Inativo'}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>StormsTrack - Monitoramento de Calor</Text>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Alertas Recentes:</Text>
        <AlertScreen token={token} />
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Sensores Disponíveis:</Text>
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSensor}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1db954',
    textAlign: 'center',
    marginBottom: 16
  },
  section: {
    marginBottom: 24
  },
  subTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8
  },
  sensorCard: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  sensorLocation: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  sensorStatus: {
    color: '#ccc',
    fontSize: 14
  }
});
