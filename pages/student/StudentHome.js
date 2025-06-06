import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, ActivityIndicator,StatusBar,TouchableOpacity,Linking ,Share, RefreshControl,Button, Alert} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar,BottomNavigation } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import API from '../api';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
const Tab = createBottomTabNavigator();

const StHome = ({ route }) => {
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
        {(props) => <StScreen {...props} route={route} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const ChatScreen = ({ navigation, route }) => {
  const { id } = route.params;

  const [content,setContent] = useState('');
  const [refreshing,setRefreshing]=useState(false)
  const [logo,setLogo]=useState(null);
  const [name,setName]=useState('');
  const video = React.useRef(null);
 const [type,setType]=useState('');
  let colleges=[]

  const getStatusBarHeight=()=>{
    return StatusBar.currentHeight
  }
  const styles = {
    container: {
      flex: 1,
    
      paddingHorizontal: 20,
      backgroundColor: 'black',
      paddingTop: StatusBar.currentHeight + 20,
    },
    textInput: {
      color: 'white',
      backgroundColor: '#38393b',
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
      elevation: 6,
    },
    attachButton: {
      marginTop: 20,
      borderColor: '#37fae6',
      borderWidth: 2,
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    postButton: {
      backgroundColor: '#37fae6',
      marginTop: 20,
      alignSelf: 'center',
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderRadius: 20,
    },
  };

//console.log(college)
const pickImage= async ()=>{
 let permission= await ImagePicker.requestMediaLibraryPermissionsAsync();

 if(permission.granted){
    let result=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      videoMaxDuration:120,
      allowsMultipleSelection:false,
      allowsEditing:true,
      aspect:[4,3],
      quality:1,
    })
    if(result.assets[0].duration>70000){
      Alert('Video should be less than 1 minute')
      return;
    }
    console.log(result)
    setType(result.assets[0].type);
    console.log(type)
    setName(result.assets[0].fileName);
    if (!result.canceled) { 
      setLogo(result.assets[0].uri);
    }
 }
 
}
const handleSubmit = () => {
  const formData = new FormData();
 
  formData.append('content', content);
  formData.append('id', id);
  formData.append('type', type);
  formData.append('file', { uri: logo, name: 'logo.jpg', type: type });
  console.log(formData);
  fetch(`${API}/createpost`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log('Post successful:', JSON.stringify(result));
      navigation.navigate('St Home');
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
};

  return (
    <View style={styles.container}>
    <TextInput
      placeholder="Write Post"
      onChangeText={(text) => setContent(text)}
      style={styles.textInput}
      multiline={true}
      numberOfLines={5}
    />
    <TouchableOpacity
      style={styles.attachButton}
      onPress={() => pickImage()}
    >
      <Ionicons name="md-attach" size={50} color="#37fae6" />
    </TouchableOpacity>

    {logo && (
      <View style={{ alignItems: 'center' }}>
        {type === 'video' ? (
          <Video
            style={{ width: 300, height: 300, borderRadius: 10 }}
            ref={video}
            source={{
              uri: logo,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        ) : (
          <Image
            source={{ uri: logo }}
            style={{ width: 300, height: 300, borderRadius: 10 }}
          />
        )}
      </View>
    )}

    <TouchableOpacity style={styles.postButton} onPress={() => handleSubmit()}>
      <Text style={{ color: 'black' }}>Post</Text>
    </TouchableOpacity>
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
    

const CollegeHome = ({ navigation, route }) => {
  const { id } = route.params;
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,setSearch]=useState('')
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (!id) {
      navigation.navigate('College Login');
    }
    fetch(`${API}/allposts`,{
      headers:{
        authorization:"XXLPNK"
      }
    })
      .then((data) => data.json())
      .then((res) => {
        console.log(res); 
        setCompany(res);
        setLoading(false);
        setRefreshing(false);
      });
  },[refreshing]);
const getStatusBarHeight = () => {
    return StatusBar.currentHeight || 0;
  };

const reSearch=()=>{
  fetch(`${API}/searchcomname?keyword=${search}`,{
    headers:{
      authorization:"XXLPNK"
    }
  })
    .then((data) => data.json())
    .then((res) => {
      console.log(res); 
      setCompany(res);
      setLoading(false);
      setRefreshing(false);
    });
}

  const renderCompanyCard = ({ item }) => (
   
    <View style={styles.card}>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{navigation.navigate('Settings',{id:item.user._id})}}>
            <Image source={{ uri: `${item.user.profile}` }} style={{width:60,borderRadius:50,height:60}} />
            <View style={{width:10}}></View>
            <View style={{flexDirection:'column',alignItems:'flex-start'}}>
            <Text style={{color:'white',fontSize:17}}>{item.user.name}</Text>
            <Text style={{color:'white',fontSize:10}}>{item.user.role}</Text>
            
            </View>
            
        </TouchableOpacity>
        <View style={{height:20}}></View>
        <Text style={styles.companyName}>{item.content}</Text>
      <Image source={{ uri: `${item.photo}` }} style={styles.logo} />
      
      
    </View>
   
      
  );

  return (
    <View style={styles.container}>
     <View  style={{marginTop: getStatusBarHeight()}}>
     <Appbar.Header style={{backgroundColor:'#3A3C3C'}}>
       <View style={{ width: '100%', height: 60, padding: 3, alignItems: 'center', marginBottom: 10, fontSize: 16 }}>
        <TextInput 
          style={{ flex: 1, color: '#37fae6' ,width:'90%',marginBottom:5,backgroundColor: '#131314',shadowColor:'black',shadowRadius:10,borderRadius:7,elevation:6,textAlign:'center',fontSize:13}} 
          placeholder="Search name state city etc"
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
     <View style={{height:20}}></View> 
      {loading ? (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={company}
          keyExtractor={(item) => item._id}
          renderItem={renderCompanyCard}
          refreshing={refreshing}
          onRefresh={()=>{setRefreshing(true)}}
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
    flexDirection: 'column',
    padding:20,
    backgroundColor: '#3A3C3C',
   height:400,
   borderRadius:10,
   paddingBottom:10
  },
  logo: {
    width:'100%',
   height:200,
    backgroundColor:'white',
    resizeMode:'contain',
   

  },
  companyDetails: {
    flex: 1,
   
  },
  companyName: {
     color:'white',
     margin:10
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

export default StHome;
