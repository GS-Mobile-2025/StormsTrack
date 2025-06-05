import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert as RNAlert, StyleSheet } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

type Props = {
  route: RouteProp<RootStackParamList, 'AlertForm'>;
};

export default function AlertFormScreen({ route }: Props) {
  const { token, alert } = route.params;
  const navigation = useNavigation();

  const [location, setLocation] = useState(alert?.location || '');
  const [message, setMessage] = useState(alert?.message || '');
  const isEdit = !!alert?.id;

  const handleSubmit = async () => {
    if (!location || !message) {
      return RNAlert.alert('Erro', 'Preencha todos os campos');
    }

    const body = { location, message };

    try {
      const response = await fetch(`${API_URL}/alerts${isEdit ? `/${alert.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Erro ao salvar alerta');

      RNAlert.alert('Sucesso', `Alerta ${isEdit ? 'atualizado' : 'criado'} com sucesso`);
      navigation.goBack();
    } catch (error) {
      RNAlert.alert('Erro', 'Não foi possível salvar o alerta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Editar Alerta' : 'Novo Alerta'}</Text>

      <Text style={styles.label}>Localização</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Mensagem</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title="Salvar" onPress={handleSubmit} color="#ff6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ff6347', marginBottom: 20 },
  label: { fontSize: 16, color: '#fff', marginTop: 16 },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
});
