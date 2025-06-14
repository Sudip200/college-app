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
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import API from '../../pages/api';

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
const Dashboard = ({ navigation, route }) => {
  const id = route?.params?.id || '12345';
  const [companies, setCompanies] = useState([
    {
      _id: '1',
      company: { _id: '1', name: 'TechCorp Solutions' },
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=faces',
      state: 'California',
      city: 'San Francisco',
      description: 'Leading technology solutions provider specializing in cloud computing and AI development.'
    },
    {
      _id: '2',
      company: { _id: '2', name: 'InnovateHub' },
      logo: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop&crop=faces',
      state: 'New York',
      city: 'New York City',
      description: 'Innovation-driven company focused on fintech and blockchain solutions.'
    },
    {
      _id: '3',
      company: { _id: '3', name: 'Digital Dynamics' },
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop&crop=faces',
      state: 'Texas',
      city: 'Austin',
      description: 'Full-service digital agency providing web development and digital marketing services.'
    },
    {
      _id: '4',
      company: { _id: '4', name: 'DataStream Analytics' },
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=faces',
      state: 'Washington',
      city: 'Seattle',
      description: 'Advanced data analytics and machine learning solutions for enterprise clients.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    
    if (!id) {
      console.log('Navigate to College Login');
    }
    fetchData();
  }, [refreshing]);

  const fetchData = async () => {
    // Simulate API call
    try{
      let res = await fetch(`${API}/company/get-all`,{
        method:'GET',
        headers: { authorization: `Bearer ${SecureStore.getItem('token')}` },
      });
      let data = await res.json()
      setCompanies(data)
    }catch(err){ 
      alert(err)
    } 
    setLoading(false);
    setRefreshing(false);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }
    
    // Simulate search
    const filtered = companies.filter(company => 
      company.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCompanies(filtered);
  };

  const renderCompanyCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => console.log('Navigate to company details', item.company._id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.logo }} style={styles.cardAvatar} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.company.name}</Text>
          <Text style={styles.cardSubtitle}>{item.state}, {item.city}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.SECONDARY} />
      </View>
      
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.cardTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Hiring</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: `${COLORS.SUCCESS}15`, borderColor: `${COLORS.SUCCESS}30` }]}>
            <Text style={[styles.tagText, { color: COLORS.SUCCESS }]}>Active</Text>
          </View>
        </View>
      </View>
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
            <Text style={styles.modalTitle}>Filter Companies</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.SECONDARY} />
            </TouchableOpacity>
          </View>
          
          <SelectDropdown
            data={states}
            onSelect={(selectedItem) => {
              setSearch(selectedItem);
              handleSearch(selectedItem);
              setShowFilterModal(false);
            }}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            rowTextForSelection={(item) => item}
            defaultButtonText="Select State"
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
        <Text style={styles.headerTitle}>Companies</Text>
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
            placeholder="Search companies, locations..."
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading companies...</Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item._id}
          renderItem={renderCompanyCard}
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
    lineHeight: 22,
  },

  // Card Footer & Tags
  cardFooter: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  cardTags: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: `${COLORS.PRIMARY}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}30`,
  },
  tagText: {
    ...TYPOGRAPHY.small,
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
  companyName: {
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
    paddingHorizontal:10
  }
})
export default Dashboard