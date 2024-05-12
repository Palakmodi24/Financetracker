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
  const [date, setDate] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly', 'monthly', or 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    setDate(inputYear);
    calculateTotalAmounts('', inputYear);
  };

  const handleDateChange = (inputDate) => {
    setDate(inputDate);
    const [selectedMonth, selectedYear] = inputDate.split('/'); // Split date into month and year
    calculateTotalAmounts(selectedMonth, selectedYear);
  };

  const calculateTotalAmounts = (selectedMonth, selectedYear) => {
    const filteredData = data.filter(item => item.amount && item.category && item.date);

    const income = Math.round(filteredData
      .filter(item => {
        const [day, month, year] = item.date.split('/');
        return item.category === 'income' && (selectedMonth === '' || month === selectedMonth) && (selectedYear === '' || year === selectedYear);
      })
      .reduce((total, item) => total + parseFloat(item.amount), 0));

    const expense = Math.round(filteredData
      .filter(item => {
        const [day, month, year] = item.date.split('/');
        return item.category === 'expense' && (selectedMonth === '' || month === selectedMonth) && (selectedYear === '' || year === selectedYear);
      })
      .reduce((total, item) => total + parseFloat(item.amount), 0));

    setTotalIncome(income);
    setTotalExpense(expense);
  };
  
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    if (mode === 'yearly') {
      calculateTotalAmounts('', date);
    } else if (mode === 'monthly') {
      handleDateChange(date);
    }
  };

  const handleCustomDateChange = () => {
    if (startDate === '' || endDate === '') {
      return;
    }
  
    const customData = data.filter(item => {
      if (!item.date) return false; // Skip entries with empty date
      const [day, month, year] = item.date.split('/');
      const itemDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
      const startDateParts = startDate.split('/');
      const endDateParts = endDate.split('/');
      const startDateObj = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
      const endDateObj = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
  
      return itemDate >= startDateObj && itemDate <= endDateObj;
    });
  
    const income = Math.round(customData
      .filter(item => item.category === 'income')
      .reduce((total, item) => total + parseFloat(item.amount), 0));
  
    const expense = Math.round(customData
      .filter(item => item.category === 'expense')
      .reduce((total, item) => total + parseFloat(item.amount), 0));
  
    setTotalIncome(income);
    setTotalExpense(expense);
    setViewMode('custom'); // Update view mode to 'custom' for proper label display
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: '#EFB7B7', paddingTop: 20 }}>
      <View style={{ paddingLeft: 10, paddingTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image source={back} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{ flexDirection: 'row', marginBottom: 20, paddingLeft: 60, paddingRight: 60, paddingBottom: 30 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: viewMode === 'yearly' ? '#FA5007' : 'transparent', borderWidth: 1, borderColor: '#FA5007', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }]}
            onPress={() => toggleViewMode('yearly')}
          >
            <Text style={{ color: viewMode === 'yearly' ? 'white' : '#FA5007', padding: 5 }}>Yearly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: viewMode === 'monthly' ? '#FA5007' : 'transparent', borderWidth: 1, borderColor: '#FA5007' }]}
            onPress={() => toggleViewMode('monthly')}
          >
            <Text style={{ color: viewMode === 'monthly' ? 'white' : '#FA5007', padding: 5 }}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: viewMode === 'custom' ? '#FA5007' : 'transparent', borderWidth: 1, borderColor: '#FA5007', borderTopRightRadius: 5, borderBottomRightRadius: 5 }]}
            onPress={() => toggleViewMode('custom')}
          >
            <Text style={{ color: viewMode === 'custom' ? 'white' : '#FA5007', padding: 5 }}>Custom</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
          Income/Expense categorization
        </Text>
        {(viewMode === 'yearly' || viewMode === 'monthly') && (
          <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            {viewMode === 'yearly' && (
              <View>
              <Text style={{paddingBottom:10}}>Enter Year</Text>
              <TextInput
                style={{ borderWidth: 1, padding: 5, width: 180 }}
                keyboardType="numeric"
                placeholder="Enter Year"
                value={date}
                onChangeText={text => handleYearChange(text)}
              />
            </View>
            )}
            {viewMode === 'monthly' && (
              <View>
              <Text style={{paddingBottom:10}}>Enter Month/Year</Text>
              <TextInput
                style={{ borderWidth: 1, padding: 5, width: 180 }}
                keyboardType="numeric"
                placeholder="MM/YYYY"
                value={date}
                onChangeText={text => handleDateChange(text)}
              />
              </View>
            )}
          </View>
        )}
        {(viewMode === 'yearly' || viewMode === 'monthly') && (
          <TouchableOpacity
            style={{ marginTop: 10, padding: 5, backgroundColor: '#FA5007', borderRadius: 5 }}
            onPress={() => toggleViewMode(viewMode)} // Use toggleViewMode function to show the graph
          >
            <Text style={{ color: 'white' }}>Show</Text>
          </TouchableOpacity>
        )}
        {viewMode === 'custom' && (
          <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{paddingBottom:10}}>Enter Start Date (DD/MM/YYYY): </Text>
            <TextInput
              style={{ borderWidth: 1, padding: 5, width: 180 }}
              keyboardType="numeric"
              placeholder="DD/MM/YYYY"
              value={startDate}
              onChangeText={text => setStartDate(text)}
            />
            <Text style={{paddingBottom:10, paddingTop:10}}>Enter End Date (DD/MM/YYYY): </Text>
            <TextInput
              style={{ borderWidth: 1, padding: 5, width: 180 }}
              keyboardType="numeric"
              placeholder="DD/MM/YYYY"
              value={endDate}
              onChangeText={text => setEndDate(text)}
            />
            <TouchableOpacity
              style={{ marginTop: 10, padding: 5, backgroundColor: '#FA5007', borderRadius: 5 }}
              onPress={handleCustomDateChange}
            >
              <Text style={{ color: 'white' }}>Show</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {totalIncome === 0 && totalExpense === 0 ? (
          <Text style={{ fontSize: 16, color: '#000000', paddingBottom: 20 }}>
            No data available for selected period or invalid data format. Enter correct value.
          </Text>
        ) : (
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
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
