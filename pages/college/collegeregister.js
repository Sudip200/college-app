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
  Image,
  Alert
} from 'react-native';
import API from '../api';
import * as SecureStore from 'expo-secure-store';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !name) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/college/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const result = await res.json();
      setLoading(false);

      if (result?.id) {
        navigation.navigate('College complete', { id: result.id });
      } else {
        Alert.alert('Error', result?.error || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Network Error', 'Failed to register. Please try again later.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F5" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
      
        <Text style={styles.title}>Register Your College</Text>

        <TextInput
          placeholder="College Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('College Login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const PRIMARY = '#007BFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    color: '#555',
    fontSize: 14,
  },
  link: {
    color: PRIMARY,
    fontWeight: '600',
  },
});

export default RegisterScreen;
