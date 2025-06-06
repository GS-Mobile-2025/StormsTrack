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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/index';

const backgroundImg = require('../assets/background-login.jpg');

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
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        Alert.alert('Erro', 'Usuário ou senha inválidos!');
        return;
      }

      // Salvar sessão
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
      navigation.navigate('Home'); 
    } catch (error) {
      Alert.alert('Erro', 'Erro ao realizar login.');
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
        <TouchableOpacity 
        style={styles.btlogin} onPress={handleLogin}
        > <Text style={styles.logtext}>Entrar</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Register')}> 
        <View>
        <Text style={styles.cad} > Não tem conta? Cadastre-se aqui!</Text>
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
    color: "#fff",
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
    color: "#ffff",
    fontSize: 16,
  },
  btlogin: {
    backgroundColor: "#E4572E",
    padding: 8,
    marginBottom: 12,
  },
  logtext: {
    color: "#ffff",
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
  },
  cad: {
    fontSize: 16,
    textAlign: "center",
    color: "#6FB3B8",
    fontWeight: 600,
  },
});
