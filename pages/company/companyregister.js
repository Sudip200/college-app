// Updated Company Register Screen with best practices (EncryptedStorage, styling, no comments)
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api';
import * as SecureStore from 'expo-secure-store';


const COMRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/company/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      const result = await res.json();
      console.log(result)
      setLoading(false);
      if (result.id && result.token) {
        await SecureStore.setItemAsync('token', result.token);
        await SecureStore.setItemAsync('id', result.id);
        await SecureStore.setItemAsync('type', 'com');
        navigation.navigate('Company complete', { id: result.id });
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F5" />
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Register Company</Text>
        <TextInput placeholder="Company Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
        {loading && <ActivityIndicator size="large" color={PRIMARY} />}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Company Login')}><Text style={styles.linkText}>Already have an account? <Text style={styles.link}>Login</Text></Text></TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const PRIMARY = "#007BFF"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  contentContainer: { flex:1 ,padding:24, alignItems: 'center', justifyContent: 'center', gap: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor:  PRIMARY,
    paddingVertical: 14,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { marginTop: 15, color: '#555', fontSize: 14 },
  link: { color: PRIMARY, fontWeight: '600' },
  image:{
    width: '100%',
    height:300,
    marginBottom: 10,
  }
});

export default COMRegisterScreen;