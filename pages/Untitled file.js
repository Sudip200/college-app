import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IntroLoginScreen = ({ navigation }) => {
  const handleCollegeLogin = () => {
    navigation.navigate('College Login');
  };

  const handleCompanyLogin = () => {
    navigation.navigate('Company Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#37fae6' }]} onPress={handleCollegeLogin}>
        <Ionicons name="school" size={30} color="white" />
        <Text style={styles.buttonText}>Continue as College</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'white' }]} onPress={handleCompanyLogin}>
        <Ionicons name="briefcase" size={30} color="#37fae6" />
        <Text style={[styles.buttonText, { color: '#37fae6' }]}>Continue as Company</Text>
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
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '70%',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default IntroLoginScreen;
