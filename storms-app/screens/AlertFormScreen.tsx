import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, AlertData } from '../types';
import { API_URL } from '../types/config';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertForm'>;

export default function AlertForm({ route, navigation }: Props) {
  const { token, alert } = route.params;
  const isEdit = !!alert;

  const [location, setLocation] = useState(alert?.location || '');
  const [message, setMessage] = useState(alert?.message || '');

  const handleSubmit = async () => {
    const url = `${API_URL}/alerts${isEdit ? `/${alert?.id}` : ''}`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location, message }),
      });

      if (!response.ok) throw new Error('Erro ao salvar alerta');
      Alert.alert('Sucesso', `Alerta ${isEdit ? 'atualizado' : 'criado'} com sucesso!`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Localização"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Mensagem do Alerta"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <Button title={isEdit ? 'Atualizar Alerta' : 'Criar Alerta'} onPress={handleSubmit} color="#1db954" />
      <TouchableOpacity style={styles.btback} onPress={() => navigation.goBack()}
        > Voltar
        </TouchableOpacity>
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
  btback: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  }
});
