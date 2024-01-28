import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const PaymentSubClass = () => {
  return (
    <View style={{paddingTop:200, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, flexDirection: 'row', backgroundColor: '#EFB7B7', flexWrap: 'wrap' }}>
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
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Purchase</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:10 }}>50</Text>
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
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Utility</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:10 }}>50</Text>
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
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Loan/EMI</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:10 }}>50</Text>
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
        
        
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Insurance</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:10 }}>50</Text>
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
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Automatic Payments</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:5 }}>50</Text>
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
        
        
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Recharge</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:10 }}>50</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default PaymentSubClass