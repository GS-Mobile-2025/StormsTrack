import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert as RNAlert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

type Props = {
  route: RouteProp<RootStackParamList, 'SensorForm'>;
};

export default function SensorFormScreen({ route }: Props) {
  const { token, sensor } = route.params;
  const navigation = useNavigation();

  const [location, setLocation] = useState(sensor?.location || '');
  const [temperature, setTemperature] = useState(sensor?.temperature?.toString() || '');
  const [active, setActive] = useState(sensor?.active || false);
  const isEdit = !!sensor?.id;

  const handleSubmit = async () => {
    if (!location || !temperature) {
      return RNAlert.alert('Erro', 'Preencha todos os campos');
    }

    const body = {
      location,
      temperature: parseFloat(temperature),
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

      RNAlert.alert('Sucesso', `Sensor ${isEdit ? 'atualizado' : 'criado'} com sucesso`);
      navigation.goBack();
    } catch (error) {
      RNAlert.alert('Erro', 'Não foi possível salvar o sensor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Editar Sensor' : 'Novo Sensor'}</Text>

      <Text style={styles.label}>Localização</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Temperatura</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={temperature} onChangeText={setTemperature} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Ativo</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <Button title="Salvar" onPress={handleSubmit} color="#1db954" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1db954', marginBottom: 20 },
  label: { fontSize: 16, color: '#fff', marginTop: 16 },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  }
});
