import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, Button } from 'react-native';
import { VictoryPie } from 'victory-native';
import Papa from 'papaparse';
import { firebase } from '@react-native-firebase/storage';



const PieExpenseCategorization = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState('yearly');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Replace 'your_username' with your actual username
    const username = 'modipalak62@gmail.com';
    const csvFilePath = firebase.storage().ref(`output/${username}/report.csv`);

    // Load CSV file
    const response = await fetch(csvFilePath);
    const text = await response.text();

    // Parse CSV data
    const result = Papa.parse(text, { header: true });
    setData(result.data);
  };

  const filterData = () => {
    let filteredData = data;
    if (view === 'yearly' && selectedYear) {
      filteredData = data.filter(item => item.date.includes(selectedYear));
    } else if (view === 'monthly' && selectedYear && selectedMonth) {
      filteredData = data.filter(item => item.date.includes(`${selectedYear}-${selectedMonth}`));
    } else if (view === 'custom' && startDate && endDate) {
      filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }
    return filteredData;
  };

  const calculateTotal = (category) => {
    const filteredData = filterData();
    return filteredData.reduce((total, item) => {
      if (item.category === category) {
        return total + parseFloat(item.amount);
      }
      return total;
    }, 0);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>View: {view}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 5 }}>
            <FlatList
              data={['Yearly', 'Monthly', 'Custom']}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setView(item.toLowerCase()); setModalVisible(false); }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {view === 'yearly' && (
        <TextInput
          placeholder="Year"
          onChangeText={setSelectedYear}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
        />
      )}

      {view === 'monthly' && (
        <View>
          <TextInput
            placeholder="Year"
            onChangeText={setSelectedYear}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
          />
          <TextInput
            placeholder="Month (1-12)"
            onChangeText={setSelectedMonth}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
          />
        </View>
      )}

      {view === 'custom' && (
        <View>
          <TextInput
            placeholder="Start Date (YYYY-MM-DD)"
            onChangeText={setStartDate}
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
          />
          <TextInput
            placeholder="End Date (YYYY-MM-DD)"
            onChangeText={setEndDate}
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10 }}
          />
        </View>
      )}

      <Button title="Generate Pie Chart" onPress={() => console.log(filterData())} />

      <VictoryPie
        data={[
          { x: 'Income', y: calculateTotal('income') },
          { x: 'Expense', y: calculateTotal('expense') },
        ]}
      />
    </View>
  );
};

export default PieExpenseCategorization;
