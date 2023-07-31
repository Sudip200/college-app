import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,StatusBar,Linking } from 'react-native';
import { DefaultTheme, Provider as PaperProvider ,Appbar} from 'react-native-paper';

import API from '../api'; // Replace with your backend API base URL

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#37fae6', // Your primary color
    background: 'black', // Dark theme background color
    text: 'white', // Text color
  },
};

const MessageScreen = ({ route }) => {
  const { collegeId, companyId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sent ,setSent]=useState(false);
  const getStatusBarHeight=()=>{
    return StatusBar.currentHeight
  }
  function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return url
    })
  }
  
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API}/getmsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          college: collegeId,
          company: companyId,
        }),
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await fetch(`${API}/sendmsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          college: collegeId,
          company: companyId,
        }),
      });
      setNewMessage('');
      fetchMessages();
    
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  },[]);

  return (
    
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          )}
          contentContainerStyle={{marginTop:getStatusBarHeight()}}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here..."
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'black'
  },
  messageContainer: {
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  message: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#37fae6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'black',
  },
});

export default MessageScreen;
