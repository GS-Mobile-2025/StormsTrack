import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !location) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, location })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Erro no cadastro', error.message || 'Erro inesperado');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          placeholder="Nome de usuário"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Localização"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Button title="Cadastrar" onPress={handleRegister} color="#1db954" />
        <View style={{ marginTop: 10 }}>
          <Button title="Voltar ao login" onPress={() => navigation.navigate('Login')} color="#888" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 28,
    color: '#1db954',
    textAlign: 'center',
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    backgroundColor: '#111',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8
  }
});
