import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

type Props = {
  route: RouteProp<RootStackParamList, 'SensorForm'>;
};

export default function SensorFormScreen({ route }: Props) {
  const { token, sensor } = route.params;
  const navigation = useNavigation();

  const [name, setName] = useState(sensor?.name || '');
  const [location, setLocation] = useState(sensor?.location || '');
  const [active, setActive] = useState(sensor?.active || false);
  const isEdit = !!sensor?.id;

  const handleSubmit = async () => {
    if (!name || !location) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    const body = {
      name,
      location,
      active
    };

    try {
      const response = await fetch(`${API_URL}/sensors${isEdit ? `/${sensor.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Erro ao salvar sensor');

      Alert.alert('Sucesso', `Sensor ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o sensor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Editar Sensor' : 'Novo Sensor'}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Localização</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.btback}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7B68EE', marginBottom: 16, textAlign: 'center' },
  label: { color: '#fff', fontSize: 16, marginTop: 10 },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#696969',
    padding: 10,
    borderRadius: 8,
    marginTop: 4
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between'
  },
  btback: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7B68EE',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
