import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, FlatList,ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import API from '../api';
const COMRegisterScreen = ({ navigation }) => {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName]=useState('')
  const [show ,setShow]=useState(false);
  //const navigation =useNavigation()
  const handleSubmit = () => {
    setShow(true)
    fetch(`${API}/company/register`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email: email, password: password,name:name }),
    })
      .then((data) => {
        return data.json();

      })
      .then((result) => {
         console.log(result);
         setShow(false)
        if (result.id) {
         console.log(result)
          navigation.navigate('Company complete',{id:result.id});
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <View style={styles.subcontainer}>
      <Ionicons name="school" size={100} color="#37fae6" />
      <Text style={styles.text}>Register Now</Text>
      <TextInput
  placeholder="Company Name"
  style={styles.txtinput}
  value={name}
  onChangeText={setName}
/>
<TextInput
  placeholder="Enter Email"
  style={styles.txtinput}
  value={email}
  onChangeText={setEmail}
/>
<TextInput
  placeholder="Enter  Password"
  style={styles.txtinput}
  value={password}
  onChangeText={setPassword}
/>

      {show && <ActivityIndicator size="large"/>}
      <TouchableOpacity style={styles.btn} onPress={()=>handleSubmit()}>
        <Text style={styles.btntxt}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Company Login')}>
        <Text style={styles.atext}>Login here</Text>  
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

export default COMRegisterScreen