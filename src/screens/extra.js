import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity,Image } from 'react-native';
import { VictoryPie, VictoryLabel } from "victory-native";
import back from '../images/back_button.png'
import { useNavigation } from '@react-navigation/native';

export default function Extra() {
  const navigation = useNavigation();
  const series = [430, 321, 185, 123, 80];
  const sliceColor = ['#ff0000', '#808000', '#800000', '#00008b', '#9acd32'];

  const titles = ['Payment', 'Withdrawal', 'Loan', 'Remainder', 'Others'];

  const [selectedData, setSelectedData] = useState(null);

  const handleItemClick = (index) => {
    setSelectedData({
      title: titles[index],
      value: series[index],
      color: sliceColor[index],
    });
  };
  const total = series.reduce((acc, value) => acc + value, 0);

  const calculatePercentage = (value) => ((value / total) * 100).toFixed(2);

  return (
    
    <View style={{flex: 1,backgroundColor: '#EFB7B7'}}>
      
      <View style={{paddingTop:60,paddingLeft:10}}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image source={back} onPress={() => navigation.navigate('MainClass')} />
        </TouchableOpacity>
      </View> 
        <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#000000',justifyContent: 'center', alignItems: 'center',paddingBottom: 10 }}>
        Expense categorization
      </Text>

        <VictoryPie
        data={series.map((value, index) => ({ y: value, label: `${calculatePercentage(value)}%` }))}
        colorScale={sliceColor}
        innerRadius={75}
        labelRadius={100}
        labels={() => null} 
        style={{
        labels: { fill: "white", fontSize: 12, fontWeight: "bold" },
          }}
        events={[
        {
          target: "data",
          eventHandlers: {
          onPress: () => {
            return [
            {
              target: "labels",
              mutation: ({ index }) => {
                handleItemClick(index);
              },
            },
          ];
        },
      },
    },
  ]}
/>


        <View style={styles.listContainer}>
          {titles.map((title, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.listItem,
                { backgroundColor: selectedData && selectedData.title === title ? selectedData.color : 'transparent' },
              ]}
              onPress={() => handleItemClick(index)}
            >
              <Text>{title}</Text>
              <Text>{series[index]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    
  },
  container: {
    flex: 1,
   // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
    
    
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
    marginTop: 40,
    padding: 10,
  },
});
