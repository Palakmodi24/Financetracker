import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';

const extra = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchFileList = async () => {
    try {
      const user = auth().currentUser;
      const storageRef = storage().ref(`input/${user.email}/`);
      const listResult = await storageRef.listAll();

      const files = listResult.items.map((item) => ({
        name: item.name,
        fullPath: item.fullPath,
        downloadUrl: item.getDownloadURL(),
      }));

      setFileList(files);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, []);

  const renderFileItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFilePress(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <CheckBox
          value={selectedFiles.includes(item.fullPath)}
          onValueChange={() => handleCheckboxChange(item.fullPath)}
        />
        <Text style={{ color: '#000000', marginLeft: 10 }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCheckboxChange = (fullPath) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fullPath)) {
        return prevSelectedFiles.filter((path) => path !== fullPath);
      } else {
        return [...prevSelectedFiles, fullPath];
      }
    });
  };

  const handleFilePress = (file) => {
    console.log('File pressed:', file);
    // Pass the file name to the handleDeleteFiles function
    handleDeleteFiles(file.name);
    
  };

  

  

  const handleDeleteFiles = async () => {
    try {
      const user = auth().currentUser;
      const storageRef = storage().ref(`/input/${user.email}/`);
      const fullPath = 'color_x11.csv';
  
      try {
        console.log("Checking file existence for path:", fullPath);
        const downloadUrl = await storageRef.child(fullPath).getDownloadURL();
        console.log("Deleting file at path:", fullPath);
        await storageRef.child(fullPath).delete();
      } catch (error) {
        console.error(`Error deleting file at path ${fullPath}:`, error.message);
      }
  
      fetchFileList();
  
      setSelectedFiles([]);
  
      // Alert.alert('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete file. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7', paddingTop: 200 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 5 }}>Uploaded Files</Text>
      {fileList.length > 0 ? (
        <>
          <FlatList
            data={fileList}
            keyExtractor={(item) => item.fullPath}
            renderItem={renderFileItem}
          />
          <Button title="Delete" onPress={handleDeleteFiles} />
        </>
      ) : (
        <Text>No files uploaded yet.</Text>
      )}
    </View>
  );
};

export default extra;


/*const handleDeleteFiles = async () => {
    try {
      const user = auth().currentUser;
      const storageRef = storage().ref(`input/${user.email}/`);

      await Promise.all(
        selectedFiles.map(async (fullPath) => {
          const fileRef = storageRef.child(fullPath);
          await fileRef.delete();
        })
      );

      // After deletion, fetch the updated file list
      fetchFileList();
      
      // Clear the selected files
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };*/

  
  /*const handleDeleteFiles = async () => {
    try {
      const user = auth().currentUser;
      const storageRef = storage().ref(`/input/${user.email}/`);
      const fullPath = 'color_x11.csv';
  
      try {
        console.log("Checking file existence for path:", fullPath);
        const downloadUrl = await storageRef.child(fullPath).getDownloadURL();
        console.log("Deleting file at path:", fullPath);
        await storageRef.child(fullPath).delete();
      } catch (error) {
        console.error(`Error deleting file at path ${fullPath}:`, error.message);
      }
  
      fetchFileList();
  
      setSelectedFiles([]);
  
      // Alert.alert('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete file. Please try again.');
    }
  };*/