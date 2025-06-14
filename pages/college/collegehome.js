import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Linking,
  Switch,
  RefreshControl,
  Modal,
  SafeAreaView,
  Dimensions,
  Share
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectDropdown from 'react-native-select-dropdown';
import * as SecureStore from 'expo-secure-store';
import Dashboard from '../../components/college/CollegeDashboard';
import SettingsScreen from '../../components/college/SettingsScreen';
import ChatScreen from '../../components/college/ChatScreen';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import API from '../api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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



const Tab = createBottomTabNavigator();

const CollegeHome = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopWidth: 1,
          borderTopColor: COLORS.BORDER,
          height: 70,
          paddingBottom: SPACING.sm,
          paddingTop: SPACING.sm,
          elevation: 8,
          shadowColor: COLORS.SHADOW,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else {
            iconName = 'chatbubble-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.SECONDARY,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" options={{ title: 'Dashboard' }}>
        {(props) => <Dashboard {...props} route={route} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" options={{ title: 'Messages' }}>
        {(props) => <ChatScreen {...props} route={route} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: 'Settings' }}>
        {(props) => <SettingsScreen {...props} route={route} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};


export default CollegeHome;