import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/index';
import { API_URL } from '../types/config';

const backgroundImg = require('../assets/background-login.png');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error('Token não recebido!');
      }

      navigation.navigate('Home', { token });
    } catch (error: any) {
      console.log("Erro de login:", error.message);
      Alert.alert('Erro', error.message || 'Erro desconhecido ao fazer login.');
    }
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>StormsTrack</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.btlogin} onPress={handleLogin}>
          <Text style={styles.logtext}>Entrar</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Register')}>
          <View>
            <Text style={styles.cad}>Não tem conta? Cadastre-se aqui!</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    padding: 24,
    margin: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: "bold",
    color: "#4682B4",
  },
  input: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
    borderColor: "#6FB3B8",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: "#fff",
  },
  btlogin: {
    backgroundColor: '#7B68EE',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  logtext: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cad: {
    marginTop: 12,
    color: "#4682B4",
    textAlign: 'center'
  }
});