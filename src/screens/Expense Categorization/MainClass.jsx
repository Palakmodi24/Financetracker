import { View, Text, TouchableOpacity,Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import back from '../../images/back_button.png'

const MainClass = () => {
    const navigation = useNavigation();

  return (
    
    <View style={{flex: 1,backgroundColor: '#EFB7B7',paddingTop:20,paddingLeft:10}}>
    <TouchableOpacity onPress={() => navigation.navigate('MainClass')}>
    <Image source={back} style={{ width: 30, height: 30, resizeMode: 'contain',paddingTop:20 }} onPress={() => navigation.navigate('MainClass')} />
    </TouchableOpacity>
    <Text style={{paddingLeft:80, fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 10,justifyContent: 'center', alignItems: 'center' }}>
        Expense categorization
      </Text>
    <View style={{paddingTop:80, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, flexDirection: 'row', backgroundColor: '#EFB7B7', flexWrap: 'wrap' }}>
      <TouchableOpacity
        style={{
          height: 120,
          width: 150,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginBottom: 20,
          marginRight: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('PaymentSC')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Payment</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:20 }}>50</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 120,
          width: 150,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginBottom: 20,
          marginLeft: 20,  // Add marginLeft for space between blocks
          marginRight: 20, // Add marginRight for space on the right side
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Credit</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:20 }}>50</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 120,
          width: 150,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginBottom: 20,
          marginRight: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Withdrawal</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:20 }}>50</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 120,
          width: 150,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('RemainderSC')}
        
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Remainder</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:20 }}>50</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 120,
          width: 150,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginBottom: 20,
          marginRight: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Others</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:20 }}>50</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 100, color: '#000000', fontSize: 18 }}>View sub classification for payments and remainder by tapping on respective classes.</Text>
      
    </View>
    </View>
  );
}

export default MainClass;
