import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Sensor } from '../types';
import { API_URL } from '../types/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation, route }: Props) {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/sensors`, {
      headers: { Authorization: `Bearer ${route.params.token}` }
    })
      .then(res => res.json())
      .then(setSensors)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌡️ Monitoramento Climático</Text>
      <Text style={styles.subheader}>Alertas de Calor Extremo</Text>
      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SensorDetails', { sensor: item, token: route.params.token })}
          >
            <MaterialCommunityIcons name="fire" size={24} color="#ff6347" style={styles.icon} />
            <Text style={styles.sensorName}>{item.name}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6347',
  },
  icon: {
    marginRight: 12,
  },
  sensorName: {
    color: '#fff',
    fontSize: 16,
  },
});
