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
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectDropdown from 'react-native-select-dropdown';
import * as SecureStore from 'expo-secure-store';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

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


import API from '../../pages/api';

const ChatScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [college, setCollege] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchContactedColleges();
  }, [id, refreshing]);

  const fetchContactedColleges = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API}/contactedcol`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ company: id })
      });
      
      const data = await response.json();
      const collegeDetailPromises = data.map((colId) =>
        fetch(`${API}/college/details/${colId}`, {
          headers: { authorization: `Bearer ${token}` }
        }).then((response) => response.json())
      );

      const collegesData = await Promise.all(collegeDetailPromises);
      setCollege(collegesData);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const renderCollegeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.messageCard}
      onPress={() => navigation.navigate('Msg', { collegeId: item.college._id, companyId: id })}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: item.logo }} />
        <View style={styles.onlineIndicator} />
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.collegeName}>{item.college.name}</Text>
        <Text style={styles.lastMessage}>Tap to view conversation</Text>
      </View>
      <View style={styles.messageTime}>
        <Ionicons name="chevron-forward" size={20} color={COLORS.SECONDARY} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="search" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        style={styles.scrollContainer}
      >
        {college.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={80} color={COLORS.SECONDARY} />
            <Text style={styles.emptyStateTitle}>No Conversations</Text>
            <Text style={styles.emptyStateText}>Start connecting with colleges to see your messages here</Text>
          </View>
        ) : (
          <FlatList
            data={college}
            renderItem={renderCollegeItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search Styles
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.WHITE,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: 25,
    padding: SPACING.xs,
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    color: COLORS.SECONDARY,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },

  // Card Styles
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 4,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
  },
  cardDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Skills Styles
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  skillTag: {
    backgroundColor: `${COLORS.PRIMARY}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}30`,
  },
  skillText: {
    ...TYPOGRAPHY.small,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  moreSkillTag: {
    backgroundColor: `${COLORS.SECONDARY}15`,
    borderColor: `${COLORS.SECONDARY}30`,
  },
  moreSkillText: {
    ...TYPOGRAPHY.small,
    color: COLORS.SECONDARY,
    fontWeight: '500',
  },

  // Card Footer
  cardFooter: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.PRIMARY}15`,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  resumeButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },

  // Message Screen Styles
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  messageContent: {
    flex: 1,
  },
  collegeName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  lastMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
  },
  messageTime: {
    alignItems: 'center',
  },

  // Settings Styles
  profileSection: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: 16,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  profileInitial: {
    ...TYPOGRAPHY.h2,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
  },

  settingsSection: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.BACKGROUND,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  settingSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    maxHeight: screenHeight * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
  },

  // Dropdown Styles
  dropdownButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: SPACING.md,
    height: 50,
    width: '100%',
  },
  dropdownButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'left',
  },
  dropdown: {
    borderRadius: 12,
    borderColor: COLORS.BORDER,
    marginTop: SPACING.xs,
  },
  dropdownRow: {
    backgroundColor: COLORS.WHITE,
    borderBottomColor: COLORS.BORDER,
    paddingVertical: SPACING.md,
  },
  dropdownRowText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },

  // Status Bar
  statusBar: {
    backgroundColor: COLORS.PRIMARY,
  },
});

export default ChatScreen