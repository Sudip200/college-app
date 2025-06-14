import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import API from '../api';

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

const SkillTabs = ({ skills }) => {
  const skillList = skills?.split(',') || [];

  return (
    <View style={styles.skillsContainer}>
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
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const response = await fetch(`${API}/student/details`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentId: id })
        });
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: item.profile }} style={styles.avatar} />
        <Text style={[TYPOGRAPHY.h2, styles.name]}>{item.name}</Text>
        <Text style={[TYPOGRAPHY.body, styles.description]}>{item.description}</Text>
        <SkillTabs skills={item.skill} />
        <Text style={[TYPOGRAPHY.caption, styles.college]}>
          College: {item.college?.name}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Linking.openURL(`tel:${item.mobile}`)}
          >
            <Ionicons name="call" size={28} color={COLORS.PRIMARY} />
            <Text style={styles.iconButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Linking.openURL(item.resume)}
          >
            <Ionicons name="document-text-outline" size={28} color={COLORS.PRIMARY} />
            <Text style={styles.iconButtonText}>Resume</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.md,
    paddingTop: StatusBar.currentHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.md,
  },
  name: {
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  description: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  college: {
    color: COLORS.SECONDARY,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  skillTab: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderColor:`${COLORS.PRIMARY}`,
    borderRadius: 10,
    backgroundColor: `${COLORS.PRIMARY}`,
 
    margin: 4,
  },
  skillText: {
    color: COLORS.WHITE,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    width: '100%',
    justifyContent: 'space-around',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconButtonText: {
    color: COLORS.PRIMARY,
    marginTop: SPACING.xs,
    fontSize: 14,
  },
});

export default StScreen;
