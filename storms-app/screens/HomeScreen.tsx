// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Sensor } from '../types';
import { API_URL } from '../types/config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

interface SensorAlert {
  id: number;
  name: string;
  location: string;
  temperature: number | null;
  level: string;
}

export default function HomeScreen({ navigation, route }: Props) {
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/sensors`, {
      headers: { Authorization: `Bearer ${route.params.token}` }
    })
      .then(res => res.json())
      .then(async (sensors: Sensor[]) => {
        const data: SensorAlert[] = await Promise.all(
          sensors.map(async (sensor) => {
            try {
              const res = await fetch(`${API_URL}/sensor-readings/${sensor.id}`, {
                headers: { Authorization: `Bearer ${route.params.token}` }
              });
              const readings = await res.json();
              const last = readings[readings.length - 1];
              const temp = last?.temperature ?? null;

              let level = 'Sem dados';
              if (temp !== null) {
                if (temp < 30) level = '🌤️ Normal';
                else if (temp < 35) level = '🌡️ Moderado';
                else level = '🔥 Calor Extremo';
              }

              return {
                id: sensor.id,
                name: sensor.name,
                location: sensor.location,
                temperature: temp,
                level,
              };
            } catch {
              return {
                id: sensor.id,
                name: sensor.name,
                location: sensor.location,
                temperature: null,
                level: 'Erro na leitura',
              };
            }
          })
        );
        setAlerts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌡️ Monitoramento Climático</Text>
      <Text style={styles.subheader}>Alertas de Calor por Local</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                borderLeftColor:
                  item.level.includes('Calor Extremo') ? '#ff4500' :
                  item.level.includes('Moderado') ? '#ffd700' :
                  item.level.includes('Normal') ? '#1e90ff' :
                  '#888'
              }
            ]}
            onPress={() =>
              navigation.navigate('SensorDetails', {
                sensor: {
                  id: item.id,
                  name: item.name,
                  location: item.location,
                  active: true,
                },
                token: route.params.token,
              })
            }
          >
            <View>
              <Text style={styles.sensorName}>{item.name}</Text>
              <Text style={styles.details}>📍 {item.location}</Text>
              <Text style={styles.details}>{item.level}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 4,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 6,
  },
  sensorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    color: '#aaa',
    fontSize: 13,
  },
});
