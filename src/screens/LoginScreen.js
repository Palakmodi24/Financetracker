import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        // Check if the email is verified
        if (user.emailVerified) {
          console.log('User already logged in');
          // Navigate to the desired screen
          //navigation.navigate('Splash');
        } else {
          Alert.alert('Please verify your email before logging in.');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const userSignin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Check if the email is verified
        if (user.emailVerified) {
          //Alert.alert('User logged in');
          // Navigate to the desired screen
          navigation.navigate('Splash');
          //navigation.navigate('Loginex');
        } else {
          Alert.alert('Please verify your email before logging in.');
          // Optionally, you can sign out the user
          // auth().signOut();
        }
      })
      .catch((error) => {
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
          marginTop: 30,
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

      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Text style={{ color: '#000000', fontSize: 14, fontWeight: 'light' }}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#3F26DA', fontSize: 14, fontWeight: 'bold' }}>
            Signup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
