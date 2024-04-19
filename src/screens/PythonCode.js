import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const PythonCode = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe; 
  }, []);

  const fetchData = async () => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    console.log('Sending email:', user.email);

    try {
      const response = await axios.get(`https://99f6-35-238-151-12.ngrok-free.app/classify?username=${user.email}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button title="Fetch Data" onPress={fetchData} />
    </View>
  );
};

export default PythonCode;
