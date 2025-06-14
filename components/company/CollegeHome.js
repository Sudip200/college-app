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

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'
];

const jobOptions = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer", "Mobile App Developer",
  "Data Scientist", "UI/UX Designer", "Software Engineer", "Machine Learning Engineer",
  "Cloud Solutions Architect", "DevOps Engineer", "Network Administrator", "Database Administrator",
  "Game Developer", "Cybersecurity Analyst", "Embedded Systems Engineer", "Artificial Intelligence Specialist",
  "Robotics Engineer", "Blockchain Developer", "Quality Assurance Engineer", "Systems Analyst",
  "Network Security Specialist", "Project Manager", "Marketing Specialist", "Human Resources Manager",
  "Business Analyst", "Financial Analyst", "Sales Representative", "Content Writer",
  "Graphic Designer", "Customer Support Specialist", "Operations Manager", "Supply Chain Manager",
  "Public Relations Specialist", "Technical Writer", "Event Planner", "Accountant",
  "Data Analyst", "Market Research Analyst", "Logistics Coordinator", "Executive Assistant",
  "Translator", "Other"
];
import API from '../../pages/api';
const SkillTags = ({ skills }) => {
  const skillList = skills.split(',').slice(0, 5); // Limit to 5 skills
  
  return (
    <View style={styles.skillsContainer}>
      {skillList.map((skill, index) => (
        <View key={index} style={styles.skillTag}>
          <Text style={styles.skillText}>{skill.trim()}</Text>
        </View>
      ))}
      {skills.split(',').length > 5 && (
        <View style={[styles.skillTag, styles.moreSkillTag]}>
          <Text style={styles.moreSkillText}>+{skills.split(',').length - 5}</Text>
        </View>
      )}
    </View>
  );
};
const CollegeHome = ({ navigation, route }) => {
  const { id } = route.params;
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState('students');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!id) {
      navigation.navigate('College Login');
    }
    fetchData();
  }, [activeTab, refreshing]);

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      const [companiesRes, studentsRes] = await Promise.all([
        fetch(`${API}/college/details/`, {
          headers: { authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/student/all`, {
          headers: { authorization: `Bearer ${token}` }
        })
      ]);
    
      const companiesData = await companiesRes.json();
      console.log('COMPANY',companiesData)
      const studentsData = await studentsRes.json();
      console.log('STUDENT',studentsData)
      setCompanies(companiesData);
      setStudents(studentsData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      setLoading(true);

      const [companiesRes, studentsRes] = await Promise.all([
        fetch(`${API}/searchcolname?keyword=${searchTerm}`, {
          headers: { authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/filterstu?keyword=${searchTerm}`, {
          headers: { authorization: `Bearer ${token}` }
        })
      ]);

      const companiesData = await companiesRes.json();
      const studentsData = await studentsRes.json();

      setCompanies(companiesData);
      setStudents(studentsData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderStudentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("St Details", { id: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.profile }} style={styles.cardAvatar} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.college.name}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Linking.openURL(`tel:${item.mobile}`)}
          >
            <Ionicons name="call" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>
      
      <SkillTags skills={item.skill} />
      
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.resumeButton}
          onPress={() => Linking.openURL(item.resume)}
        >
          <Feather name="file-text" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.resumeButtonText}>View Resume</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCompanyCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("College Details", { id: item.college._id, comid: id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.logo }} style={styles.cardAvatar} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.college.name}</Text>
          <Text style={styles.cardSubtitle}>{item.state}, {item.city}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.SECONDARY} />
      </View>
      
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.SECONDARY} />
            </TouchableOpacity>
          </View>
          
          <SelectDropdown
            data={activeTab === 'students' ? jobOptions : states}
            onSelect={(selectedItem) => {
              setSearch(selectedItem);
              handleSearch(selectedItem);
              setShowFilterModal(false);
            }}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            rowTextForSelection={(item) => item}
            defaultButtonText={activeTab === 'students' ? "Select Job Role" : "Select State"}
            buttonStyle={styles.dropdownButton}
            buttonTextStyle={styles.dropdownButtonText}
            dropdownStyle={styles.dropdown}
            rowStyle={styles.dropdownRow}
            rowTextStyle={styles.dropdownRowText}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Feather name="filter" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={COLORS.SECONDARY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, skills, location..."
            placeholderTextColor={COLORS.SECONDARY}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              handleSearch(text);
            }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearch('');
              fetchData();
            }}>
              <Ionicons name="close-circle" size={20} color={COLORS.SECONDARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}
        >
          <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
            Students
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'colleges' && styles.activeTab]}
          onPress={() => setActiveTab('colleges')}
        >
          <Text style={[styles.tabText, activeTab === 'colleges' && styles.activeTabText]}>
            Colleges
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'students' ? students : companies}
          keyExtractor={(item) => item._id}
          renderItem={activeTab === 'students' ? renderStudentCard : renderCompanyCard}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal />
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

export default CollegeHome