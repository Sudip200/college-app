import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api';
import * as SecureStore from 'expo-secure-store';
const COMLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      const id = await SecureStore.getItemAsync('user_id');
      const type = await SecureStore.getItemAsync('type');
      if (id && type === 'com') {
        navigation.replace('Company Home', { id });
      }
    };
    autoLogin();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/company/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      console.log(result)
      if (result.id && result.token) {
        console.log(result.token)
        const detailRes = await fetch(`${API}/company/details/${result.id}`, {
          method: 'GET',
          headers: { authorization: `Bearer ${SecureStore.getItem('token')}` },
        });
        const detail = await detailRes.json();
        console.log(detail)
        await SecureStore.setItemAsync('user_id', result.id);
        await SecureStore.setItemAsync('token', result.token);
        await SecureStore.setItemAsync('type', 'com');
        if (detail.state) {
          navigation.replace('Company Home', { id: result.id });
        } else {
          navigation.replace('Company complete', { id: result.id });
        }
      } else {
        alert('Incorrect credentials');
      }
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Ionicons name="business" size={80} color="#007BFF" />
      <Text style={styles.title}>Company Login</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      {loading ? <ActivityIndicator color="#007BFF" /> : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Company Register')}>
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.link}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  title: { fontSize: 22, fontWeight: '600', color: '#222' },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  linkText: { fontSize: 14, color: '#444' },
  link: { color: '#007BFF', fontWeight: '500' },
});

export default COMLoginScreen;
