import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const RemainderSubClass = () => {
  return (
    <View style={{paddingTop:50, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7'}}>
      <TouchableOpacity
        style={{
          height: 120,
          width: 150,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginBottom: 20,
          //marginRight: 20,
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
          marginLeft: 20,  // Add marginLeft for space between blocks
          marginRight: 20, // Add marginRight for space on the right side
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Loan/EMI</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22,marginTop:10 }}>50</Text>
      </TouchableOpacity>

      
      
    </View>
  )
}

export default RemainderSubClass