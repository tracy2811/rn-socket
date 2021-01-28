/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';
import LottieView from 'lottie-react-native';

const io = require('socket.io-client');
const socketEndpoint = 'http://15.237.95.134:3000/';

const App: () => React$Node = () => {
  const animationRef = useRef(null);
  const [textInput, setTextInput] = useState('');
  const [textDisplay, setTextDisplay] = useState('');
  const [socket, setSocket] = useState(null);
  const submitText = () => {
    if (socket) {
      socket.emit('chat', textInput);
    }
    setTextInput('');
  };

  useEffect(() => {
    const newSocket = io(socketEndpoint, { transports: ['websocket'] });
    newSocket.on('connect', () => {
      console.log('socket connected!');
    });
    newSocket.on('chat', (data) => {
      animationRef.current.play(0, 134);
      setTextDisplay(data);
    });

    setSocket(newSocket);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Enter your thought...'
        placeholderTextColor='#af8bf2'
        value={textInput}
        onChangeText={setTextInput}
        onSubmitEditing={submitText} />
      <View style={styles.messageContainer}>
        <LottieView
          ref={animationRef}
          source={require('./assets/bird-flying.json')}
          loop={false}
          style={styles.animation} />
        <Text style={styles.text}>{!!textDisplay ? textDisplay : 'Thought on fly...'}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#defcf9',
    padding: 10,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  animation: {
    width: 150,
    marginLeft: -20,
    marginRight: -50,
    marginTop: 10,
  },
  text: {
    fontSize: 36,
    fontFamily: 'AmaticSCBold',
    paddingHorizontal: 5,
    paddingVertical: 20,
    color: '#564196',
    textAlign: 'center',
    backgroundColor: 'rgba(175, 139, 242, 0.1)',
    flex: 1,
  },
  textInput: {
    borderBottomColor: '#af8bf2',
    color: '#564196',
    borderWidth: 0,
    borderBottomWidth: 1,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'AmaticSCRegular',
    marginTop: 10,
  }
});

export default App;
