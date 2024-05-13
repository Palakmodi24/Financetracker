import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { VictoryPie } from "victory-native";
import back from '../images/back_button.png'
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Papa from 'papaparse';
import storage from '@react-native-firebase/storage';
import { Picker } from '@react-native-picker/picker';

export default function Extra() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly', 'monthly', or 'custom'
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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

  const calculateTotalAmounts = () => {
    const filteredData = data.filter(item => item.amount && item.category && item.date);
  
    let income = 0;
    let expense = 0;
  
    if (viewMode === 'yearly') {
      income = Math.round(filteredData
        .filter(item => {
          const [day, month, year] = item.date.split('/');
          return item.category === 'income' && (selectedYear === '' || year === selectedYear);
        })
        .reduce((total, item) => total + parseFloat(item.amount), 0));
  
      expense = Math.round(filteredData
        .filter(item => {
          const [day, month, year] = item.date.split('/');
          return item.category === 'expense' && (selectedYear === '' || year === selectedYear);
        })
        .reduce((total, item) => total + parseFloat(item.amount), 0));
    } else if (viewMode === 'monthly') {
      income = Math.round(filteredData
        .filter(item => {
          const [day, month, year] = item.date.split('/');
          return item.category === 'income' && (selectedMonth === '' || month === selectedMonth) && (selectedYear === '' || year === selectedYear);
        })
        .reduce((total, item) => total + parseFloat(item.amount), 0));
  
      expense = Math.round(filteredData
        .filter(item => {
          const [day, month, year] = item.date.split('/');
          return item.category === 'expense' && (selectedMonth === '' || month === selectedMonth) && (selectedYear === '' || year === selectedYear);
        })
        .reduce((total, item) => total + parseFloat(item.amount), 0));
    } else if (viewMode === 'custom') {
      const startDateParts = customStartDate.split('/');
      const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
      const endDateParts = customEndDate.split('/');
      const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
  
      income = Math.round(filteredData
        .filter(item => {
          const [day, month, year] = item.date.split('/');
          const currentDate = new Date(year, month - 1, day);
          return item.category === 'income' && currentDate >= startDate && currentDate <= endDate;
        })
        .reduce((total, item) => total + parseFloat(item.amount), 0));
  
      expense = Math.round(filteredData
        .filter(item => {
          const [day, month, year] = item.date.split('/');
          const currentDate = new Date(year, month - 1, day);
          return item.category === 'expense' && currentDate >= startDate && currentDate <= endDate;
        })
        .reduce((total, item) => total + parseFloat(item.amount), 0));
    }
  
    setTotalIncome(income);
    setTotalExpense(expense);
  };
  
  
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    if (mode === 'yearly') {
      setSelectedYear('');
      calculateTotalAmounts();
    } else if (mode === 'monthly') {
      setSelectedMonth('');
      setSelectedYear('');
      calculateTotalAmounts();
    } else if (mode === 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
      calculateTotalAmounts();
    }
  };

  const getYearOptions = () => {
    return data.map(item => item.date && item.date.split('/')[2]) // Get year part from date
      .filter((value, index, self) => self.indexOf(value) === index && value) // Remove duplicates and empty values
      .map(year => <Picker.Item key={year} label={year} value={year} />);
  };

  const getMonthOptions = () => {
    return data.map(item => item.date && item.date.split('/')[1]) // Get month part from date
      .filter((value, index, self) => self.indexOf(value) === index && value) // Remove duplicates and empty values
      .map(month => <Picker.Item key={month} label={month} value={month} />);
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
        {viewMode === 'yearly' && (
          <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{paddingBottom:10}}>Select Year</Text>
            <Picker
              selectedValue={selectedYear}
              style={{ height: 50, width: 180 }}
              onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
            >
              {getYearOptions()}
            </Picker>
          </View>
        )}
        {viewMode === 'monthly' && (
          <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{paddingBottom:10}}>Select Month</Text>
            <Picker
              selectedValue={selectedMonth}
              style={{ height: 50, width: 180 }}
              onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
            >
              {getMonthOptions()}
            </Picker>
            <Text style={{paddingBottom:10}}>Select Year</Text>
            <Picker
              selectedValue={selectedYear}
              style={{ height: 50, width: 180 }}
              onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
            >
              {getYearOptions()}
            </Picker>
          </View>
        )}
        {viewMode === 'custom' && (
          <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{paddingBottom:10}}>Start Date</Text>
            <TextInput
              style={{ height: 40, width: 180, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
              placeholder="DD/MM/YYYY"
              onChangeText={text => setCustomStartDate(text)}
              value={customStartDate}
            />
            <Text style={{paddingBottom:10}}>End Date</Text>
            <TextInput
              style={{ height: 40, width: 180, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
              placeholder="DD/MM/YYYY"
              onChangeText={text => setCustomEndDate(text)}
              value={customEndDate}
            />
          </View>
        )}
        <TouchableOpacity
          style={{ marginTop: 10, padding: 5, backgroundColor: '#FA5007', borderRadius: 5 }}
          onPress={calculateTotalAmounts}
        >
          <Text style={{ color: 'white' }}>Show</Text>
        </TouchableOpacity>
        
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
            style={{ labels: { fill: 'white', fontSize: 16, fontWeight: 'bold' } }}
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
