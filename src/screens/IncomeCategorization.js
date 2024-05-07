import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '@react-native-firebase/storage';
import PapaParse from 'papaparse';
import BarGraph from './BarGraph';

const IncomeCategorization = () => {z
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [showIncomeGraph, setShowIncomeGraph] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const username = 'modipalak62@gmail.com';
      const csvFileRef = firebase.storage().ref(`output/${username}/report.csv`);
      const csvUrl = await csvFileRef.getDownloadURL();

      fetch(csvUrl)
        .then((response) => response.text())
        .then((text) => {
          PapaParse.parse(text, {
            header: true,
            complete: (result) => {
              const filteredData = result.data.filter((item) => item.category === 'income' || item.category === 'expense');
              //console.log('Filtered Data:', filteredData);
              const parsedData = filteredData.map((item) => ({
                date: item.date,
                amount: parseFloat(item.amount),
                month: parseInt(item.date.split('/')[1]) - 1, // Updated to split using '/'
                category: item.category, // Include the category property
              })).filter((item) => !isNaN(item.month) && item.month >= 0 && item.month <= 11);
              
              

              const monthlyData = parsedData.reduce((acc, curr) => {
                const month = curr.month;
                const category = curr.category;
                if (!acc[category]) {
                  acc[category] = Array(12).fill(0); // Initialize array for each category
                }
                acc[category][month] += curr.amount; // Accumulate amount for each month and category
                return acc;
              }, {});

              console.log('Monthly Income Data:');
              const incomeArray = monthlyData.income.map((amount, index) => ({
              month: new Date(2024, index).toLocaleString('default', { month: 'long' }),
              amount: amount,
              }));
              console.log(incomeArray);

              console.log('Monthly Expense Data:');
              const expenseArray = monthlyData.expense.map((amount, index) => ({
              month: new Date(2024, index).toLocaleString('default', { month: 'long' }),
              amount: amount,
              }));
              console.log(expenseArray);


              // Update the state with the calculated monthly data
              setIncomeData(monthlyData.income || []);
              setExpenseData(monthlyData.expense || []);
            },
            error: (error) => {
              console.error('Error parsing CSV:', error);
            },
          });
        })
        .catch((error) => {
          console.error('Error fetching CSV file:', error);
        });
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, showIncomeGraph ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setShowIncomeGraph(true)}
        >
          <Text style={[styles.buttonText, showIncomeGraph ? styles.activeButtonText : styles.inactiveButtonText]}>Income Graph</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !showIncomeGraph ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setShowIncomeGraph(false)}
        >
          <Text style={[styles.buttonText, !showIncomeGraph ? styles.activeButtonText : styles.inactiveButtonText]}>Expense Graph</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.graphContainer}>
        {showIncomeGraph ? (
          <BarGraph data={incomeData} />
        ) : (
          <BarGraph data={expenseData} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFB7B7',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    marginTop: 100,
    margin: 5,
    backgroundColor: 'transparent',
    borderColor: '#FA5007',
    borderWidth: 2,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#FA5007',
  },
  inactiveButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FA5007',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: '#FA5007',
  },
  graphContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IncomeCategorization;
