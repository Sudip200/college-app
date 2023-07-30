import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, FlatList,ActivityIndicator,Platform,StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer ,useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import API from '../api';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 const [iscom,setiscom]=useState('none');
  const [show,setShow]=useState(false)
  //const [id,setId]=useState('')
  //const navigation =useNavigation()
  console.log({email,password});
  useEffect(() => {
    const checkUserTypeAndNavigate = async () => {
      try {
        let result = await SecureStore.getItemAsync("id");
        let type = await SecureStore.getItemAsync("type");
        if (result && type === "col") {
          navigation.navigate('College Home', { id: result });
        } else {
          console.log('No values stored under that key.');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };
  
    checkUserTypeAndNavigate();
  }, []);
  
 async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}
  const handleSubmit = () => {
    setShow(true)
    fetch(`${API}/college/login`, { 
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((data) => {
        return data.json();
      })
      .then( (result) => {
        console.log(result)
        if (result.id) {
          setShow(false)
          console.log(result.id);
     fetch(`${API}/college/details/${result.id}`).then((data)=>  {
      return data.json()
    }).then((res)=>{ 
       if(res.state){
         setShow(false)
          save("id",result.id);
           save("type","col");
       navigation.navigate('Collge Home',{id:result.id});
       }else{
        navigation.navigate('College complete',{id:result.id});
       }
    }).catch((err)=>{
      console.log(err)
    })
        }
      })
      .catch((err) => {
        setShow(false)
        console.log(err);
        alert('Incorrect Password or Email');
      });
  };

  return (
    <View style={styles.subcontainer}>
      <Ionicons name="school" size={100} color="#37fae6" />
      <Text style={styles.text}>Login Now</Text>
      <TextInput
        placeholder="Enter Your Email"
        value={email}
        style={styles.txtinput}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
     
      <TextInput
        placeholder="Enter Your Password"
        style={styles.txtinput}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
      />
      {show && <ActivityIndicator size='large'/>} 
      <TouchableOpacity style={styles.btn} onPress={() => handleSubmit()}>
        <Text style={styles.btntxt}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('College Register')}>
        <Text style={styles.atext}>Register here</Text>
      </TouchableOpacity>
    </View> 
  );
};
const styles = StyleSheet.create({
  subcontainer: {
    flex: 2,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black'
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  atext: {
    color: '#37fae6',
    marginTop: 10,
  },
  btntxt: {
    fontSize: 17,
    color:'white'
  },
  btn: {
    padding: 20,
    backgroundColor: '#37fae6',
    width: 300,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 10,
    color: 'white',
  },
  txtinput: {
    color: 'black',
    padding: 10,
    backgroundColor: 'white',
    height: 60,
    width: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default LoginScreen