import { View, Text,Button,Image, TouchableOpacity,Alert } from 'react-native'
import React,{useState} from 'react'
import Companylogo from '../images/Companylogo.png'
import DocumentPicker from 'react-native-document-picker'
import storage from '@react-native-firebase/storage';

const MainScreen = () => {

  const[csvData,setCsvData]=useState(null);
  const[fullDataRefPath,setfullDataRefPath]=useState("");
  const [dataDownloadUrl,setdataDownloadUrl]=useState("");


  const pickdoc = async()=>{
    try{
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.csv],
        copyTo:"cachesDirectory"
      
      });
      console.log(response);
      setCsvData(response);
    }catch(err){
      console.log(err);
    }
  };

  const uploadData = async () => {
    try {
      const response =storage().ref(`/input/${csvData.name}`);
      const put=await response.putFile(csvData.fileCopyUri);
      //console.log(response);
      setfullDataRefPath(put.metadata.fullPath);
      const url=await response.getDownloadURL();

      setdataDownloadUrl(url);
      Alert.alert("Data uploaded successfully");

  
    } catch (err) {
      console.log(err);
      
    }
  };

 

  
  return (
    
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7', paddingTop: 200 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 30 }}> WELCOME</Text>
    <Image source={Companylogo} />
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 50 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          height: 70,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }} onPress={() => pickdoc()}>Select Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          height: 70,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginLeft: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }} onPress={()=>uploadData()}>Upload your message</Text>
      </TouchableOpacity>
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          height: 70,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>View Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          height: 70,
          borderRadius: 20,
          backgroundColor: '#FA5007',
          marginLeft: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>View Analytics</Text>
      </TouchableOpacity>
    </View>

    <Text style={{marginTop:30,color: '#000000',fontSize:18}}>Select and upload your financial related data </Text>
    <Text style={{color: '#000000',fontSize:18}}>and view the analytics </Text>

    
  </View>
  )
}

export default MainScreen