import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from './pages/college/collegeregister';
import LoginScreen from './pages/college/collegelogin';
import COMRegisterScreen from './pages/company/companyregister'
import COMLoginScreen from './pages/company/companylogin';
import CompleteRegisterScreen from './pages/college/collegecomplete.js';
import Home from './pages/college/collegehome';
import CompanyDetails from './pages/college/companydetails';
import COMHome from './pages/company/companyhome';
import CompleteRegisterScreenCOM from './pages/company/companyaddmore'
import CollegeDetails from './pages/company/collegedetails'
import IntroLoginScreen from './pages/intro'
import MessageScreen from './pages/company/message';
import StScreen from './pages/company/student';
import StLoginScreen from './pages/student/stlogin';
import StHome from './pages/student/sthome';
const Stack = createStackNavigator();

const API = '';

export default function App() {
  return (
    <NavigationContainer> 
      <Stack.Navigator screenOptions={{
    headerShown: false
  }} > 
   <Stack.Screen name="App Intro" component={IntroLoginScreen} />
   <Stack.Screen name="College Register" component={RegisterScreen} />
      <Stack.Screen name="College complete" component={CompleteRegisterScreen} />
       <Stack.Screen name="College Login" component={LoginScreen}  />
        <Stack.Screen name="Collge Home" component={Home} />
         <Stack.Screen name="Company Details" component={CompanyDetails} />
          <Stack.Screen name="Company Login" component={COMLoginScreen} /> 
          <Stack.Screen name="Company Register" component={COMRegisterScreen} /> 
           <Stack.Screen name="Company Home" component={COMHome} /> 
          <Stack.Screen name="Company complete" component={CompleteRegisterScreenCOM} /> 
           <Stack.Screen name="College Details" component={CollegeDetails} />  
           <Stack.Screen name="Msg" component={MessageScreen} />  
           <Stack.Screen name="St Details" component={StScreen} /> 
           <Stack.Screen name="St Login" component={StLoginScreen} /> 
           <Stack.Screen name="St Home" component={StHome} />   
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 


