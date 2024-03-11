import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { firebase } from '@react-native-firebase/storage';
import PapaParse from 'papaparse';
import BarGraph from './BarGraph';

const IncomeCategorization = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const csvFileRef = firebase.storage().ref('output/mock_user_income.csv');
      const csvUrl = await csvFileRef.getDownloadURL();

      fetch(csvUrl)
        .then((response) => response.text())
        .then((text) => {
          PapaParse.parse(text, {
            header: true,
            complete: (result) => {
              const parsedData = result.data.map((item) => ({
                date: item.date,
                amount: parseFloat(item.amount),
              })).filter((item) => item.date !== undefined); // Filter out items with undefined date

              // Group data by month and calculate total amount for each month
              const groupedData = {};
              parsedData.forEach((item) => {
                const [day, month, year] = item.date.split('-');
                const monthKey = `${year}-${month.padStart(2, '0')}`;
                if (!groupedData[monthKey]) {
                  groupedData[monthKey] = 0;
                }
                groupedData[monthKey] += item.amount;
              });

              // Create an array with 12 objects, each representing a month
              const monthlyData = Array.from({ length: 12 }, (_, index) => {
                const monthKey = `2024-${String(index + 1).padStart(2, '0')}`;
                return {
                  date: monthKey,
                  amount: groupedData[monthKey] || 0,
                };
              });

              setData(monthlyData);
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
    <>
      <Text>Bar Chart</Text>
      <BarGraph data={data} />
    </>
  );
};

export default IncomeCategorization;
