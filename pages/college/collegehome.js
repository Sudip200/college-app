import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, ActivityIndicator,StatusBar,TouchableOpacity,Linking ,Share} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar,BottomNavigation } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import API from '../api';
import { ScrollView } from 'react-native-gesture-handler';
const Tab = createBottomTabNavigator();


const Home = ({ route }) => {
  return (
   <Tab.Navigator
      screenOptions={
        
        ({ route }) => ({
          headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else{
            iconName='chatbox'
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#37fae6',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'black',
        },
      }}
    >
      <Tab.Screen name="Home">
        {(props) => <CollegeHome {...props} route={route} />}
      </Tab.Screen>
      <Tab.Screen name="Chat">
        {(props) => <ChatScreen {...props} route={route} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} route={route} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const ChatScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [college,setCollege] = useState([]);
  let colleges=[]

  const getStatusBarHeight=()=>{
    return StatusBar.currentHeight
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent:'flex-start',
    marginTop:getStatusBarHeight(),
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  collegeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:20,
    borderRadius:10,
    elevation:5,
    backgroundColor:'#38393b',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  collegeName: {
    fontSize: 16,
    color: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: 'white',
  },
  button: {
    backgroundColor: '#37fae6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
  },
}); 
useEffect(() => {
  fetch(`${API}/contactedcom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ college: id })
  })
    .then((response) => response.json())
    .then((data) => {
      const collegeIds = data.map((item) =>item); // Extract college IDs from the fetched data
      const collegeDetailPromises = collegeIds.map((colId) =>
        fetch(`${API}/company/details/${colId}`,{
          headers:{
            authorization:"XXLPNK"
          }
        }).then((response) => response.json())
      );

      Promise.all(collegeDetailPromises)
        .then((collegesData) => {
          setCollege(collegesData);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}, [id]);
//console.log(college)
  

  return (
    <View style={styles.container}>
      <ScrollView>
      {college.length === 0 ? ( // Check if colleges is empty or not
      <ActivityIndicator color="white" size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    ) : (
      college.map((item, index) => (
       <TouchableOpacity key={index} style={styles.collegeItem} onPress={()=>{ navigation.navigate('Msg',{collegeId:id, companyId:item.company._id})}}>
       <Image style={styles.logo} source={{ uri: item.logo }} />
       <Text style={styles.collegeName}>{item.company.name}</Text>
     </TouchableOpacity>
     
      ))
    )}
      </ScrollView>
   
  </View>
  );
};

const SettingsScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [accountDetails, setAccountDetails] = useState([]);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5, 
    color: 'white',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: 'white',
  },
  button: {
    backgroundColor: '#37fae6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
  },
}); 
  useEffect(() => {
    fetch(`${API}/college/details/${id}`,{
      headers:{
        authorization:"XXLPNK"
      }
    }) 
      .then((response) =>{ return response.json()})
      .then((data) => {
       console.log()
        setAccountDetails(data.college);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleAccountDeletion = () => {
    // Perform account deletion logic here
    // Open default email client with pre-filled email
    Linking.openURL('mailto:dassudipto200@gmail.com?subject=Account Deletion Request');
  };
  const handleShare=async()=>{
  // const share =await Sharing.isAvailableAsync() 
   
     try{
    //   await Sharing.shareAsync(`${API}register/${id}`,{dialogTitle:`${accountDetails.name} Student registration`})
       await Share.share({
        message: `${API}/register/${id}`,
        title: `${accountDetails.name} Student registration`, 
        url:`${API}/register/${id}`
      })
     }
     catch(err){
          alert(err)
     }
     
   
  } 
  const handleUpdateRequest = () => {
   
    Linking.openURL('mailto:dassudipto200@gmail.com?subject=Update Request');
  };
   const handleLogout = async () => {
    await SecureStore.deleteItemAsync('id');
    // Perform any additional logout logic here
    navigation.navigate("College Login")
  };

  return (
    <View style={styles.container}>
      {accountDetails ? (
        <>
          <Text style={styles.title}>Account Details</Text>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{accountDetails.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{accountDetails.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleAccountDeletion}>
            <Text style={styles.buttonText}>Account Deletion Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUpdateRequest}>
            <Text style={styles.buttonText} >Update Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share Link to students</Text>
          </TouchableOpacity> 
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Account Details...</Text>
        </View>
      )}
    </View>
  );
};


const CollegeHome = ({ navigation, route }) => {
  const { id } = route.params;
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      navigation.navigate('College Login');
    }
    fetch(`${API}/company/details/`,{
      headers:{
        authorization:"XXLPNK"
      }
    })
      .then((data) => data.json())
      .then((res) => {
        console.log(res); 
        setCompany(res);
        setLoading(false);
      });
  }, []);
const getStatusBarHeight = () => {
    return StatusBar.currentHeight || 0;
  };



  const renderCompanyCard = ({ item }) => (
    <TouchableOpacity onPress={()=>navigation.navigate("Company Details",{id:item.company._id,colid:id})}>
    <View style={styles.card}>
      <Image source={{ uri: `${item.logo}` }} style={styles.logo} />
      <View style={styles.companyDetails}>
        <Text style={styles.companyName}>{item.company.name}</Text>
        <Text style={styles.companyLocation}>{item.state}, {item.city}</Text>
        <Text style={styles.companyDescription}>{item.description}</Text>
      </View>  
    </View>
    </TouchableOpacity>
      
  );

  return (
    <View style={styles.container}>
     <View  style={{marginTop: getStatusBarHeight()}}>
     <Appbar.Header style={{backgroundColor:'#3A3C3C'}}>
       <View style={{ width: '100%', height: 60, padding: 3, alignItems: 'center', marginBottom: 10, fontSize: 16 }}>
        <TextInput 
          style={{ flex: 1, color: '#37fae6' ,width:'90%',marginBottom:5,backgroundColor: '#131314',shadowColor:'black',shadowRadius:10,borderRadius:7,elevation:6,textAlign:'center',fontSize:13}} 
          placeholder="Search"
          placeholderTextColor="#37fae6"
          underlineColorAndroid="transparent"
        />
      </View>
      </Appbar.Header>
     </View> 
     <View style={{height:20}}></View> 
      {loading ? (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={company}
          keyExtractor={(item) => item._id}
          renderItem={renderCompanyCard}
          contentContainerStyle={styles.companyList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3C3C',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    marginTop:10,
    elevation:6
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    resizeMode:'contain'
  },
  companyDetails: {
    flex: 1,
   
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

export default Home;
