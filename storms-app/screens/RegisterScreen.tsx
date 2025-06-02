import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../types/config';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const handleRegister = async () => {
    if (!email || !password || !role) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Email inválido.');
      return;
    }

    if (password.length < 5) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 5 caracteres.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar.');
      }

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      setEmail('');
      setPassword('');
      setRole('USER');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha (mín. 5 caracteres)"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <Text style={styles.label}>Função:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
        dropdownIconColor="#1db954"
      >
        <Picker.Item label="Usuário Comum" value="USER" />
        <Picker.Item label="Administrador" value="ADMIN" />
      </Picker>

      <Button title="Cadastrar" onPress={handleRegister} color="#1db954" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    color: '#fff',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  label: {
    color: '#aaa',
    marginTop: 10,
    marginBottom: 4,
    fontSize: 16
  },
  picker: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    marginBottom: 16,
    borderRadius: 6
  }
});
