import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image,StatusBar,TouchableOpacity,Linking,Button,Switch,RefreshControl,Modal,ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar,BottomNavigation,Card } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectDropdown from 'react-native-select-dropdown';
import * as SecureStore from 'expo-secure-store';
import API from '../api';
const SkillTabs = ({ skills }) => {
  const skillList = skills.split(',');
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    skillTab: {
      paddingHorizontal: 2,
      paddingVertical: 3,
      borderRadius: 10,
      margin:2,
      borderWidth:2,
      borderColor:'#37fae6',
    },
    skillText: {
      color: 'white',
     fontSize:12
    },
  });
  return (
    <View style={styles.container}>
      {skillList.map((skill, index) => (
        <View key={index} style={styles.skillTab}>
          <Text style={styles.skillText}>{skill.trim()}</Text>
        </View>
      ))}
    </View>
  );
};
const StScreen = ({ navigation, route }) => {
  const { id } = route.params;
  console.log(id);
  const [accountDetails, setAccountDetails] = useState([]);
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Added state for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/stdetails`, {
          method: 'POST',
          headers: {
            authorization: "XXLPNK",
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId: id
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        setItem(data);
        setIsLoading(false); // Data is fetched, loading is complete
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Error occurred, loading is complete (with error)
      }
    };

    fetchData();
  }, [id]);

  return (
    <View style={styles.card}>
      {isLoading ? ( // Show loading indicator if still fetching data
        <ActivityIndicator size={40}   />
      ) : (
        <>
          <Image source={{ uri: `${item.profile}` }} style={styles.logo} />
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>{item.name}</Text>
            <Text style={styles.companyDescription}>{item.description}</Text>
            <SkillTabs skills={item.skill} />
            <Text style={styles.companyLocation}>College {item.college.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, marginBottom: StatusBar.currentHeight, alignSelf: 'center' }}>
              <TouchableOpacity onPress={() => { Linking.openURL(`tel:${item.mobile}`) }} style={{ borderColor: '#37fae6', borderWidth: 1, width: '50%', borderRadius: 10, alignItems: 'center' }}><Ionicons name='call' size={40} color={'#37fae6'} /></TouchableOpacity>
              <View style={{ width: 10 }}></View>
              <TouchableOpacity onPress={() => { Linking.openURL(`${item.resume}`) }} style={{ borderColor: '#37fae6', borderWidth: 1, width: '50%', borderRadius: 10, alignItems: 'center', height: '100%' }}><Text style={{ color: '#37fae6' }}>My Resume</Text></TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black', 
    },
    tab:{
      backgroundColor:'#37fae6',
      borderRadius:9,
      marginHorizontal:4 ,
     
    }, 
    searchBar: {
      alignItems: 'center',
      padding: 5,
    },
    input: {
      width: '80%',
      height: 60,
      color: 'white',
      backgroundColor: 'black',
      padding: 3,
      alignItems: 'center',
      marginBottom: 10,
      fontSize: 16,
    },
    loadingIndicator: { 
      marginTop: 70,
    },
    companyList: {
      paddingHorizontal: 10,
    },
    card: {
     flex:1,
      alignItems: 'center',
      
       padding:10,
       backgroundColor:'black',
       justifyContent:'center',
       alignContent:'center',
       textAlign:'center',
      paddingTop: StatusBar.currentHeight,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 10,
      resizeMode:'contain'
    },
    companyDetails: {
     textAlign:'center',
     flex:1,
     alignContent:'center',
     alignItems:'center',
    
    },
    companyName: {
      fontSize: 16,
      fontWeight: 'bold',
       color:'white'
    },
    companyLocation: {
      fontSize: 14,
      color: 'gray',
       color:'white'
    },
    companyDescription: {
      fontSize: 14,
       color:'white'
    },
  });
  export default StScreen;