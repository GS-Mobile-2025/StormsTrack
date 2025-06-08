import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Sensor } from '../types';
import { API_URL } from '../types/config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation, route }: Props) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const token = route.params.token;

  const fetchSensors = async () => {
    try {
      const response = await fetch(`${API_URL}/sensors`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao buscar sensores');
      const data = await response.json();
      setSensors(data);
    } catch (error: any) {
      console.error('Erro ao buscar sensores:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSensor = async () => {
    if (selectedId === null) return;

    try {
      const response = await fetch(`${API_URL}/sensors/${selectedId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Erro ao excluir: ${response.status}`);
      console.log('✅ Sensor excluído com sucesso');
      fetchSensors();
    } catch (error: any) {
      console.error("Erro ao excluir:", error.message);
    } finally {
      setModalVisible(false);
      setSelectedId(null);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSensors();
    }, [])
  );

  const renderSensor = ({ item }: { item: Sensor }) => (
    <View style={styles.sensorBox}>
      <Text style={styles.sensorTitle}>📍 {item.location}</Text>
      <Text style={styles.sensorInfo}>ID: {item.id}</Text>
      <Text style={styles.sensorInfo}>Nome: {item.name}</Text>
      <Text style={styles.sensorInfo}>{item.active ? '🟢 Ativo' : '🔴 Inativo'}</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setSelectedId(item.id);
          setModalVisible(true);
        }}
      >
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores Registrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1db954" />
      ) : sensors.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum sensor encontrado.</Text>
      ) : (
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSensor}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SensorForm', { token })}
      >
        <Text style={styles.buttonText}>➕ Cadastrar Novo Sensor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setLogoutModalVisible(true)}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Deseja excluir este sensor?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={deleteSensor}>
                <Text style={styles.modalText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Deseja sair do aplicativo?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.modalText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleLogout}>
                <Text style={styles.modalText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7B68EE', marginBottom: 16, textAlign: 'center' },
  sensorBox: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  sensorTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  sensorInfo: { fontSize: 14, color: '#aaa', marginTop: 4 },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff5555',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  button: {
    backgroundColor: '#7B68EE',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#ccc', textAlign: 'center', marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  modalCancel: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8
  },
  modalConfirm: {
    backgroundColor: '#ff5555',
    padding: 10,
    borderRadius: 8
  }
});
