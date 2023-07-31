import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, ActivityIndicator,StatusBar,TouchableOpacity,Linking,Button,Switch } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar,BottomNavigation,Card } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
const Tab = createBottomTabNavigator();

import API from '../api';
import { ScrollView } from 'react-native-gesture-handler';
const COMHome = ({ route }) => {
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
  fetch(`${API}/contactedcol`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ company: id })
  })
    .then((response) => response.json())
    .then((data) => {
      const collegeIds = data.map((item) =>item); // Extract college IDs from the fetched data
      const collegeDetailPromises = collegeIds.map((colId) =>
        fetch(`${API}/college/details/${colId}`,{
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
       <TouchableOpacity key={index} style={styles.collegeItem} onPress={()=>{ navigation.navigate('Msg',{collegeId:item.college._id, companyId:id})}}>
       <Image style={styles.logo} source={{ uri: item.logo }} />
       <Text style={styles.collegeName}>{item.college.name}</Text>
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
    fetch(`${API}/company/details/${id}`,{
      headers:{
        authorization:"XXLPNK"
      }
    })
      .then((response) =>{ return response.json()})
      .then((data) => {
       console.log(data)
        setAccountDetails(data.company);
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

  const handleUpdateRequest = () => {
    // Perform update request logic here
    // Open default email client with pre-filled email
    Linking.openURL('mailto:dassudipto200@gmail.com?subject=Update Request');
  };
   const handleLogout = async () => {
    await SecureStore.deleteItemAsync('id');
    // Perform any additional logout logic here
    navigation.navigate("Company Login")
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
            <Text style={styles.buttonText}>Update Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
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
  const [students,setStudent]=useState([]);
  const [filterstudents,setFilterStudents]=useState([])
  const [search ,setSearch]=useState("")

  const [rt,setRt]=useState('st'); 

  useEffect(() => {
    if (!id) {
      navigation.navigate('College Login');
    }
    fetch(`${API}/college/details/`,{
      headers:{
        authorization:"XXLPNK"
      }
    }) 
      .then((data) => data.json())
      .then((res) => {
      
        setCompany(res);
        setLoading(false);
      });
      fetch(`${API}/allstudents`,{
        headers:{
          authorization:"XXLPNK"
        }
      }) 
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        setStudent(res);
        setLoading(false);
      });
  }
  , [rt]);
const getStatusBarHeight = () => {
    return StatusBar.currentHeight || 0;
  };
 const reSearch=()=>{
  fetch(`${API}/searchcolname?keyword=${search}`,{
    headers:{
      authorization:"XXLPNK"
    }
  }) 
    .then((data) => data.json())
    .then((res) => {
    
      setCompany(res);
      setLoading(false);
    });
    fetch(`${API}/filterstu?keyword=${search}`,{
      headers:{
        authorization:"XXLPNK"
      }
    }) 
    .then((data) => data.json())
    .then((res) => {
      console.log(res);
      setStudent(res);
      setLoading(false);
    });
 }
  const filterStudents = () => {
    console.log(students)
    if(search===""){
      setFilterStudents(students)
      return
    }
    const filteredStudents = students.filter((student) => {
      const { description, skill, college } = student;
      // Check if the search input matches any part of the data
      const searchString = search.toLowerCase();

      return (
        description.toLowerCase().includes(searchString) ||
        skill.toLowerCase().includes(searchString) 
      );
    });

    setFilterStudents(filterStudents);
   
  };
 

  

const renderStudentCard = ({ item }) => (
    
    <View style={styles.card}>
      <Image source={{ uri: `${item.profile}` }} style={styles.logo} />
      <View style={styles.companyDetails}>
        <Text style={styles.companyName}>{item.name}</Text>
        <Text style={styles.companyDescription}>{item.description}</Text>
         <Text style={{color:'#37fae6',fontStyle:'italic'}}>Skills {item.skill}</Text>
        <Text style={styles.companyLocation}>College {item.college.name}</Text>
         <Button color="#37fae6"  title="My Resume" onPress={()=>{Linking.openURL(`${item.resume}`)}}/>
      </View>   
    </View>
    
      
  );
  const renderCompanyCard = ({ item }) => (

    <TouchableOpacity onPress={()=>navigation.navigate("College Details",{id:item.college._id,comid:id})}>
    <View style={styles.card}>
      <Image source={{ uri: `${item.logo}` }} style={styles.logo} />
      <View style={styles.companyDetails}>
        <Text style={styles.companyName}>{item.college.name}</Text>
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
          placeholder="Search ex-state,city,skill etc"
          placeholderTextColor="#37fae6"
          underlineColorAndroid="transparent"
          onChangeText={(text)=>{
            setSearch(text);
            setLoading(true)
            reSearch()
         }}
        />
      </View>
      </Appbar.Header>
     
     </View> 
     <View style={{height:30,justifyContent:'center',alignItems:'center',flexDirection:'row',paddingVertical:4}}> 
      <TouchableOpacity onPress={()=>{setRt('col')}} style={styles.tab} ><Text>Colleges</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>{setRt('st')}} style={styles.tab}  ><Text>Students</Text></TouchableOpacity>
     </View> 
      {loading ? (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      ) : (
        rt === 'col' ? (
  <FlatList
    data={company}
    keyExtractor={(item) => item._id}
    renderItem={renderCompanyCard}
    contentContainerStyle={styles.companyList}
  />
) : ( 
  <FlatList
    data={students}
    keyExtractor={(item) => item._id}
    renderItem={renderStudentCard} 
    contentContainerStyle={styles.companyList}
  />
)
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

export default COMHome;
