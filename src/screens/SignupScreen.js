import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[mobile,setMobile]=useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const createUser = () => {
    // Validate if all fields are filled
    if (!name || !email || !password || !mobile || !confirmPassword) {
      console.log('All fields are required.');
      Alert.alert('All fields are required.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      Alert.alert('Invalid email format');
      return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      console.log('Password should contain at least one uppercase, one lowercase, one special symbol, and be at least 6 characters long.');
      Alert.alert('Password should contain at least one uppercase, one lowercase, one special symbol, and be at least 6 characters long.');
      return;
    }

    // Validate if password and confirm password match
    if (password !== confirmPassword) {
      console.log('Password and Confirm Password should match.');
      Alert.alert('Password and Confirm Password should match.');
      return;
    }

    // Create user in Firebase Authentication
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        await user.updateProfile({
          displayName : name,
         
        })

        // Send verification email
        return user.sendEmailVerification();
      })
      .then(() => {
        // Store user information in Firestore
        firestore()
          .collection('users')
          .doc(email)
          .set({
            name: name,
            email: email,
            password: password,
            mobile: mobile,
          })
          .then(() => {
            console.log('User information added to Firestore.');
          })
          .catch((error) => {
            console.error('Error adding user information to Firestore:', error);
          });

        console.log('Verification email sent to your inbox! Please check your inbox. Please verify your email before logging in');
        Alert.alert('Verification email sent to your inbox! Please check your inbox. Please verify your email before logging in');
        
        // Reset fields after successful account creation
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigation.navigate('Login');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert('That email address is already in use!');
        } else {
          console.error(error);
        }
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 10 }}>
        WELCOME
      </Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 30 }}>
        LET'S HELP YOU MEET UP YOUR TASK
      </Text>
      <TextInput
        placeholder='Enter your name'
        value={name}
        onChangeText={(txt) => setName(txt)}
        style={{
          width: '90%',
          height: 55,
          borderWidth: 0.5,
          borderRadius: 20,
          paddingLeft: 20,
        }}
      />

      <TextInput
        placeholder='Enter your email'
        value={email}
        onChangeText={(txt) => setEmail(txt)}
        style={{
          width: '90%',
          height: 55,
          borderWidth: 0.5,
          borderRadius: 20,
          marginTop: 20,
        }}
      />

<TextInput
        placeholder='Enter your mobile'
        value={mobile}
        onChangeText={(txt) => setMobile(txt)}
        style={{
          width: '90%',
          height: 55,
          borderWidth: 0.5,
          borderRadius: 20,
          marginTop: 20,
        }}
      />

      <TextInput
        placeholder='Create password'
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

      <TextInput
        placeholder='Confirm Password'
        value={confirmPassword}
        onChangeText={(txt) => setConfirmPassword(txt)}
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
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          createUser();
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Create Account</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Text style={{ color: '#000000', fontSize: 14, fontWeight: 'light' }}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#3F26DA', fontSize: 14, fontWeight: 'bold' }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;

