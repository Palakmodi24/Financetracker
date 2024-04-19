// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import MainScreen from '../screens/MainScreen';
import LoginEx from '../screens/LoginEx';
import ViewFiles from '../screens/ViewFiles';
import MainClass from '../screens/Expense Categorization/MainClass';
import PaymentSubClass from '../screens/Expense Categorization/PaymentSubClass';
import RemainderSubClass from '../screens/Expense Categorization/RemainderSubClass';
import Extra from '../screens/extra';
import IncomeCategorization from '../screens/IncomeCategorization';
import PythonCode from '../screens/PythonCode';
const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}} />
        <Stack.Screen name='Main' component={MainScreen} options={{headerShown:false}}/>
        
        <Stack.Screen name='Loginex' component={LoginEx}/>
        <Stack.Screen name='ViewFiles' component={ViewFiles} options={{headerShown:false}}/>
        <Stack.Screen name='MainClass' component={MainClass} options={{headerShown:false}}/>
        <Stack.Screen name='PaymentSC' component={PaymentSubClass} options={{headerShown:false}}/>
        <Stack.Screen name='RemainderSC' component={RemainderSubClass} options={{headerShown:false}}/>
        <Stack.Screen name='extra' component={Extra} options={{headerShown:false}}/>
        <Stack.Screen name='Income' component={IncomeCategorization} options={{headerShown:false}}/>
        <Stack.Screen name='Python' component={PythonCode} options={{headerShown:false}}/>
       
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;