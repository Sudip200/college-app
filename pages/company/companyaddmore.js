import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import getDistrictsByState from '../getstate';
import API from '../api';

const PRIMARY = '#007BFF';

const states = [ 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry' ];

const CompleteRegisterScreenCOM = ({ navigation, route }) => {
  const { id } = route.params;

  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [mobile, setMobile] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) navigation.replace('Company Login');
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!state || !city || !description || !mobile || !logo) return alert('Please fill all fields');
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const formData = new FormData();
      formData.append('state', state);
      formData.append('description', description);
      formData.append('city', city);
      formData.append('mobile', mobile);
      formData.append('logo', {
        uri: logo,
        name: 'logo.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(`${API}/company/details/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      navigation.replace('Company Home', { id });
    } catch (err) {
      alert('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Ionicons name="business-outline" size={60} color={PRIMARY} />
        <Text style={styles.title}>Complete Company Profile</Text>

        <SelectDropdown
          data={states}
          defaultButtonText="Select State"
          onSelect={setState}
          buttonStyle={styles.dropdown}
          buttonTextStyle={styles.dropdownText}
        />

        <SelectDropdown
          data={getDistrictsByState(state)}
          defaultButtonText="Select City"
          onSelect={setCity}
          buttonStyle={styles.dropdown}
          buttonTextStyle={styles.dropdownText}
        />

        <TextInput
          placeholder="Describe your company"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />
        <TextInput
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity style={styles.logoButton} onPress={pickImage}>
          <Text style={styles.logoButtonText}>Upload Company Logo</Text>
        </TouchableOpacity>
        {logo && <Image source={{ uri: logo }} style={styles.image} />}

        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Company Login')}>
          <Text style={styles.loginLink}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { padding: 24, alignItems: 'center', gap: 20 },
  title: { fontSize: 22, fontWeight: '600', color: '#222' },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    elevation: 1,
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
  },
  dropdownText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#333',
  },
  logoButton: {
    width: '100%',
    height: 50,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 10,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    color: PRIMARY,
    marginTop: 12,
    fontSize: 14,
  },
});

export default CompleteRegisterScreenCOM;
