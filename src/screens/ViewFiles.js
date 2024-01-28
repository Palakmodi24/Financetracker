
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const ViewFiles = () => {

  const [fileList, setFileList] = useState([]); //to render the files
  const [selectedFiles, setSelectedFiles] = useState([]); //stores the files to be deleted

  useEffect(() => {
    fetchFileList();
  }, []);

  //fetching all the files from the firebase 
  const fetchFileList = async () => {
    try {
      const user = auth().currentUser;
      const storageRef = storage().ref(`/input/${user.email}/`);
      const listResult = await storageRef.listAll();

      const files = listResult.items.map((item) => ({
        name: item.name,
        fullPath: item.fullPath,
      }));

      setFileList(files);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  //adding and removing the files from the selectedFiles array to be deleted
  const handleCheckboxChange = (file) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.some((selectedFile) => selectedFile.fullPath === file.fullPath)) {
        // If file is already in the array, remove it
        return prevSelectedFiles.filter((selectedFile) => selectedFile.fullPath !== file.fullPath);
      } else {
        // If file is not in the array, add it
        return [...prevSelectedFiles, file];
      }
    });
  };

  const renderFileItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFilePress(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <CheckBox
          value={selectedFiles.some((selectedFile) => selectedFile.fullPath === item.fullPath)}
          onValueChange={() => handleCheckboxChange(item)}
        />
        <Text style={{ marginLeft: 10 }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  
  //iterates over the selectedFiles array and deletes the files from the firebase
  const handleDeleteFiles = async () => {
    try {
      const storageRef = storage().ref();

      for (const file of selectedFiles) {
        try {
          console.log("Deleting file at path:", file.fullPath);
          await storageRef.child(file.fullPath).delete();
          console.log("File deleted successfully:", file.fullPath);
        } catch (error) {
          console.error(`Error deleting file at path ${file.fullPath}:`, error);
        }
      }

      // Clear the selected files array after deletion
      setSelectedFiles([]);

      // Fetch the updated file list
      fetchFileList();
    } catch (error) {
      console.error('Error deleting files:', error);
      Alert.alert('Error', 'Failed to delete files. Please try again.');
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
          <TouchableOpacity
          style={{
            height: 60,
            width:150,
            borderRadius: 0,
            backgroundColor: '#d11a2a',
            marginBottom:20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
           onPress={handleDeleteFiles}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Delete Files</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>No files available.</Text>
      )}
    </View>
  );
};

export default ViewFiles;













