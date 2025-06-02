import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Alert = {
  id: number;
  message: string;
  location: string;
  level: string;
};

type Props = {
  token: string;
};

export default function AlertScreen({ token }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://192.168.0.105:8080/alerts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error('Erro ao buscar alertas:', err);
      }
    };

    fetchAlerts();
  }, [token]);

  const renderItem = ({ item }: { item: Alert }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.location}</Text>
      <Text style={styles.level}>Nível: {item.level}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alertas</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { fontSize: 24, color: '#1db954', marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12
  },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  level: { color: '#ccc', marginBottom: 4 }
});
