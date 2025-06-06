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
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const backgroundImg = require('../assets/background-login.jpg');

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
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const userExists = users.some((user: any) => user.username === username);
      if (userExists) {
        Alert.alert('Erro', 'Usuário já existe!');
        return;
      }

      users.push({ username, password, location });
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao registrar usuário.');
    }
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          placeholder="Usuário"
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
        <TextInput
          placeholder="Localização"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister} >
          <Text style={styles.textbutt}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkback}>Voltar</Text>
          </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flex: 1,
    padding: 24,
    margin: 16,
  },
  inner: {
    padding: 24,
    justifyContent: 'center',
    backgroundColor: "transparent",
    shadowColor: "black",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: "#ffff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: '#6FB3B8',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    color: "#fff",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  textbutt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#E4572E",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  linkback: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    color: "#6FB3B8",

  }
});
