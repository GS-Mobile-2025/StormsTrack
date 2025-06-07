import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { API_URL } from '../types/config';

const backgroundImg = require('../assets/background-login.jpg');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Campos obrigatórios', 'Preencha usuário e senha');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Usuário ou senha inválidos');
      }

      const data = await response.json();

      if (data.token) {
        console.log('Login OK - token:', data.token);
        navigation.navigate('Home', { token: data.token });
      } else {
        throw new Error('Token não recebido');
      }
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      Alert.alert('Erro no login', error.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.title}>StormsTrack</Text>
        <TextInput
          placeholder="Usuário"
          placeholderTextColor="#aaa"
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Entrar" onPress={handleLogin} color="#D2691E" />
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity style={styles.cad} onPress={handleRegister}>Não tem conta? Cadastre-se aqui!</TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    color: '#fff',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cad: {
    color: '#87CEFA',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    fontWeight: 500,
  }
});
