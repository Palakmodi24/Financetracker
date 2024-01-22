import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import logo from '../images/download.png'
import Companylogo from '../images/Companylogo.png'
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7', paddingTop: 200}}>
    <View>
    <Image source={logo}/>

    </View>
    
      <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#000000', marginBottom: 10, marginTop: 27}}>
        FINIFY
      </Text>
      <Text style={{color: '#000000', paddingHorizontal: 20,fontSize: 16}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</Text>

      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginTop: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Main')}
        
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Get Started</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 50 }}>
      <Image source={Companylogo} style={{ width: 900, height: 115, resizeMode: 'contain' }}/>
      </View>


    </View>
  )
}

export default SplashScreen