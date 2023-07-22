import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api';


const CompanyDetails = ({ route }) => {
  const { id } = route.params;
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    fetch(`${API}/company/details/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCall = () => {
    if (companyDetails && companyDetails.company && companyDetails.mobile) {
      const phoneNumber = companyDetails.mobile.toString();
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (companyDetails && companyDetails.company && companyDetails.company.email) {
      Linking.openURL(`mailto:${companyDetails.company.email}`);
    }
  };

  return (
    <View style={styles.container}>
      {companyDetails && (
        <>
          <Image source={{ uri: `${companyDetails.logo}` }} style={styles.logo} />
          <Text style={styles.name}>{companyDetails.company.name}</Text>
          <Text style={styles.location}>{`${companyDetails.state}, ${companyDetails.city}`}</Text>
          <Text style={styles.description}>{companyDetails.description}</Text>
          <View style={styles.buttonContainer}>
            {Platform.OS === 'web' ? (
              <>
                <Text style={styles.contactText}>Mobile No {companyDetails.mobile}</Text>
                <Text style={styles.contactText}>Email Id  {companyDetails.company.email}</Text>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={handleCall}>
                  <Ionicons name="call" size={24} color="white" />
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEmail}>
                  <Ionicons name="mail" size={24} color="white" />
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
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
    backgroundColor: 'black',
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
    color: 'white',
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    color: 'white',
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
    backgroundColor: '#37fae6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  contactText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});

export default CompanyDetails;
