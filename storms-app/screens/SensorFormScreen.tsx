import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Sensor } from '../types/index';
import { API_URL } from '../types/config';

type Props = NativeStackScreenProps<RootStackParamList, 'SensorForm'>;

export default function SensorForm({ route, navigation }: Props) {
  const { token, sensor } = route.params;
  const isEdit = !!sensor;

  const [name, setName] = useState(sensor?.name || '');
  const [location, setLocation] = useState(sensor?.location || '');
  const [active, setActive] = useState(sensor?.active || false);

  const handleSubmit = async () => {
    const url = `${API_URL}/sensors${isEdit ? `/${sensor?.id}` : ''}`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location, active }),
      });

      if (!response.ok) throw new Error('Erro ao salvar sensor');
      Alert.alert('Sucesso', `Sensor ${isEdit ? 'atualizado' : 'criado'} com sucesso!`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Localização"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <Button
        title={active ? 'Desativar Sensor' : 'Ativar Sensor'}
        onPress={() => setActive(!active)}
        color={active ? '#ff4d4d' : '#1db954'}
      />
      <View style={{ marginTop: 16 }}>
        <Button title={isEdit ? 'Atualizar' : 'Cadastrar'} onPress={handleSubmit} color="#5555ff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#222',
    color: '#fff',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});
