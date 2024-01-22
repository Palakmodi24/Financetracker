import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

const EmailSignin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userSignin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("User logged in");
      })
      .catch(error => {
        console.log(error);
      });
  };

  const forgotPassword = () => {
    if (!email) {
      Alert.alert('Please enter your email address');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Password reset email sent. Check your inbox.');
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error sending password reset email. Please try again.');
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 10 }}>
        WELCOME BACK
      </Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 30 }}>
        Start where you left
      </Text>

      <TextInput
        placeholder='Enter your email'
        value={email}
        onChangeText={(txt) => setEmail(txt)}
        style={{
          width: '90%',
          height: 55,
          borderWidth: 0.5,
          borderRadius: 20,
          marginTop: 30, // Adjusted marginTop
        }}
      />

      <TextInput
        placeholder='Enter your password'
        value={password}
        onChangeText={(txt) => setPassword(txt)}
        secureTextEntry={true}
        style={{
          width: '90%',
          height: 55,
          borderWidth: 0.5,
          borderRadius: 20,
          marginTop: 20,
        }}
      />

      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginTop: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          userSignin();
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={forgotPassword}>
        <Text style={{ color: '#3F26DA', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
          Forgot Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailSignin;
