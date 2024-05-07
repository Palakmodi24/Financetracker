import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { VictoryPie } from "victory-native";
import back from '../images/back_button.png'
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Papa from 'papaparse';
import storage from '@react-native-firebase/storage';

export default function Extra() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [year, setYear] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!auth().currentUser) {
      console.log("User not authenticated.");
      return;
    }

    const path = storage().ref(`output/${auth().currentUser.email}/report.csv`);

    try {
      const url = await path.getDownloadURL();
      const response = await fetch(url);
      const text = await response.text();
      const result = Papa.parse(text, { header: true }).data;
      console.log('Parsed data:', result.map(item => ({ date: item.date, amount: item.amount, category: item.category })));
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleYearChange = (inputYear) => {
    setYear(inputYear);
    calculateTotalAmounts(inputYear);
  };

  const calculateTotalAmounts = (selectedYear) => {
    const income = Math.round(data
      .filter(item => item.category === 'income' && item.date.includes(selectedYear))
      .reduce((total, item) => total + parseFloat(item.amount), 0));
  
    const expense = Math.round(data
      .filter(item => item.category === 'expense' && item.date.includes(selectedYear))
      .reduce((total, item) => total + parseFloat(item.amount), 0));
  
    setTotalIncome(income);
    setTotalExpense(expense);
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: '#EFB7B7' }}>
      <View style={{ paddingTop: 50, paddingLeft: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image source={back} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', justifyContent: 'center', alignItems: 'center', paddingBottom: 10, paddingTop:10 }}>
          Expense categorization
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text>Enter Year: </Text>
          <TextInput
            style={{ borderWidth: 1, padding: 5, width: 100 }}
            keyboardType="numeric"
            value={year}
            onChangeText={text => handleYearChange(text)}
          />
        </View>
        {year && (
          <VictoryPie
            data={[
              { x: 'Income', y: totalIncome },
              { x: 'Expense', y: totalExpense }
            ]}
            colorScale={['#9acd32', '#ff0000']}
            innerRadius={75}
            labelRadius={100}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            style={{ labels: { fill: 'white', fontSize: 12, fontWeight: 'bold' } }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
});
