import React from 'react';
import {useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const handleCollegeLogin = () => {
    navigation.navigate('College Login');
  };

  const handleCompanyLogin = () => {
    navigation.navigate('Company Login');
  };
  const handlesstLogin = () => {
    navigation.navigate('St Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.collegeButton]} onPress={handleCollegeLogin}>
        <Ionicons name="school" size={40} color="#37fae6" />
        <Text style={styles.buttonText}>Continue as College</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.companyButton]} onPress={handleCompanyLogin}>
        <Ionicons name="briefcase" size={40} color="#37fae6" />
        <Text style={styles.buttonText}>Continue as Company</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.companyButton]} onPress={handlesstLogin}>
        <Ionicons name="book" size={40} color="#37fae6" />
        <Text style={styles.buttonText}>Continue as Student</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#37fae6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: '70%',
  },
  collegeButton: {
    borderColor: '#37fae6',
  },
  companyButton: {
    borderColor: 'white',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default LoginScreen;
