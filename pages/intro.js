import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const handleCollegeLogin = () => navigation.navigate('College Login');
  const handleCompanyLogin = () => navigation.navigate('Company Login');
  const handlesstLogin = () => navigation.navigate('St Login');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      
      <Image
        source={require("../assets/welcome_blue.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.collegeButton]} onPress={handleCollegeLogin}>
          <Ionicons name="school" size={28} color="#fff" />
          <Text style={styles.buttonText}>Continue as College</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.companyButton]} onPress={handleCompanyLogin}>
          <Ionicons name="briefcase" size={28} color="#fff" />
          <Text style={styles.buttonText}>Continue as Company</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.studentButton]} onPress={handlesstLogin}>
          <Ionicons name="book" size={28} color="#fff" />
          <Text style={styles.buttonText}>Continue as Student</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PRIMARY_BLUE = '#007BFF';
const LIGHT_BACKGROUND = '#F7F9FC';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  image: {
    width: '100%',
    height: 350,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 40,
    paddingVertical: 15,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  collegeButton: {
    backgroundColor: PRIMARY_BLUE,
  },
  companyButton: {
    backgroundColor: '#0056b3', 
  },
  studentButton: {
    backgroundColor: '#3399FF', 
  },
});

export default LoginScreen;
