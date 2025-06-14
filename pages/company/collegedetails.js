import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api';
import * as SecureStore from 'expo-secure-store'
const COLORS = {
  PRIMARY: "#007BFF",
  SECONDARY: "#6C757D",
  SUCCESS: "#28A745",
  WARNING: "#FFC107",
  DANGER: "#DC3545",
  LIGHT: "#F8F9FA",
  DARK: "#343A40",
  WHITE: "#FFFFFF",
  BACKGROUND: "#F0F2F5",
  CARD_BG: "#FFFFFF",
  TEXT_PRIMARY: "#333333",
  TEXT_SECONDARY: "#666666",
  BORDER: "#E5E5E5",
  SHADOW: "rgba(0, 0, 0, 0.1)"
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
};

const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' }
};

const CollegeDetails = ({ route ,navigation}) => {
  const { id,comid } = route.params;
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    fetch(`${API}/college/${id}`,{
      headers:{
        authorization:`Bearer ${SecureStore.getItem('token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setCompanyDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCall = () => {
    if (companyDetails && companyDetails.college && companyDetails.mobile) {
      const phoneNumber = companyDetails.mobile.toString();
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (companyDetails && companyDetails.college && companyDetails.college.email) {
      Linking.openURL(`mailto:${companyDetails.college.email}`);
    }
  };
  const handleMessage=async ()=>{
   navigation.navigate('Msg',{collegeId:id, companyId:comid})
  }

  return (
    <View style={styles.container}>
      {companyDetails && (
        <>
          <Image source={{ uri: `${companyDetails.logo}` }} style={styles.logo} />
          <Text style={styles.name}>{companyDetails.college.name}</Text>
          <Text style={styles.location}>{`${companyDetails.state}, ${companyDetails.city}`}</Text>
          <Text style={styles.description}>{companyDetails.description}</Text>
          <View style={styles.buttonContainer}>
            {Platform.OS === 'web' ? (
              <>
                <Text style={styles.contactText}>Mobile No {companyDetails.mobile}</Text>
                <Text style={styles.contactText}>Email Id  {companyDetails.college.email}</Text>
              </>
            ) : (
              <>
                {/* <TouchableOpacity style={styles.button} onPress={handleCall}>
                  <Ionicons name="call" size={24} color="white" />
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={handleMessage}>
                  <Ionicons name="chatbox" size={24} color="white" />
                  <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.button} onPress={handleEmail}>
                  <Ionicons name="mail" size={24} color="white" />
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity> */}
              </>
            )} 
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:SPACING.sm,
    backgroundColor: COLORS.BACKGROUND
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
     color: COLORS.SECONDARY,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    color: COLORS.SECONDARY,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width:'70%',
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
     color: COLORS.WHITE,
  },
  contactText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});

export default CollegeDetails;
