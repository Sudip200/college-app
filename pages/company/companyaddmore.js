import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, FlatList,Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import getDistrictsByState from '../getstate';
import API from '../api';
import * as ImagePicker from 'expo-image-picker';
const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry'
];
const CompleteRegisterScreenCOM = ({ navigation,route }) => {
   const { id } = route.params;
   console.log("here"+id)   // Access the id from the route params
  useEffect(()=>{
    if(!id){
      navigation.navigate("Company Login")  
    }
  })
  const [state,setState]=useState('');
  const [description,setDescription]=useState('');
  const [city,setCity]=useState('');
  const [mobile,setMobile]=useState('')
  const [logo,setLogo]=useState(null)
  //console.log(state+description+city+mobile+logo);
  const pickImage= async ()=>{
    let result=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[4,3],
      quality:1,
    })
    console.log(result)
    if (!result.canceled) { 
      setLogo(result.assets[0].uri);
    }
  }
  const handleSubmit =()=>{
     const formData = new FormData();  
    formData.append('state', state);
    formData.append('description', description);
    formData.append('city', city);
    formData.append('mobile', mobile);
    formData.append('logo', { uri: logo, name: 'logo.jpg', type: 'image/jpeg' });
    fetch(`${API}/company/details/${id}`, {
      method: 'POST',
      body: formData, 
    }) 
      .then((response) => response.json())  
      .then((result) => {
        console.log(JSON.stringify(result));
        navigation.navigate('Company Login');    
      })
      .catch((error) => {
        console.error(JSON.stringify(error));
      });
  }
 
  return (
    <View style={styles.subcontainer}>
      <Text style={styles.text}>Complete  Registration</Text>
      <SelectDropdown
	data={states}
	onSelect={(selectedItem, index) => {
	 setState(selectedItem);
	}}
	buttonTextAfterSelection={(selectedItem, index) => {   
		return selectedItem
	}}
	rowTextForSelection={(item, index) => {

		return item
	}}
  defaultButtonText="Select State"
  style={{marginBottom:5,backgroundColor:'#37fae6'}}
/>
<View style={{padding:10}}></View> 
<SelectDropdown
	data={getDistrictsByState(state)}
	onSelect={(selectedItem, index) => {
	 setCity(selectedItem);
	}}
	buttonTextAfterSelection={(selectedItem, index) => {   
		return selectedItem
	}}
	rowTextForSelection={(item, index) => {

		return item
	}}
  defaultButtonText="Select City"
  style={{marginBottom:5,backgroundColor:'#37fae6'}}
/>
<View style={{padding:10}}></View> 
  {/*<TextInput
  placeholder="Enter State"
  style={styles.txtinput}
  value={state}
  onChangeText={setState}
/>*/}
<TextInput
  placeholder="Describe your company"
  style={styles.txtinput}
  value={description}  
  onChangeText={setDescription}
/>
{/*<TextInput
  placeholder="Enter city"
  style={styles.txtinput}
  value={city}
  onChangeText={setCity}
/>*/}
<TextInput
  placeholder="Enter Mobile No."
  style={styles.txtinput}
  value={mobile}
  onChangeText={setMobile}
/> 

      <Button title="Upload Logo" onPress={()=>pickImage()} color="#37fae6"/>
      <View style={{height:7}}></View>
      {logo && <Image source={{uri:logo}} style={{ width: 200, height: 200 }}/>}
      <TouchableOpacity style={styles.btn} onPress={()=>{
        handleSubmit()
      }}>
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
export default CompleteRegisterScreenCOM