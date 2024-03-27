import { View, Text,Button,Image, TouchableOpacity,Alert,Modal } from 'react-native'
import React,{useState} from 'react'
import Companylogo from '../images/Companylogo.png'
import DocumentPicker from 'react-native-document-picker'
import storage from '@react-native-firebase/storage';
import AccountIcon from '../images/AccountIcon.png';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; 

const MainScreen = () => {

  const[csvData,setCsvData]=useState(null);
  const[fullDataRefPath,setfullDataRefPath]=useState("");
  const [dataDownloadUrl,setdataDownloadUrl]=useState("");
  const navigation = useNavigation();
  
  const pickdoc = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.csv],
        copyTo: "cachesDirectory"
      });
      console.log(response);
      setCsvData(response);
      if (response) {
        const storageRef = storage().ref(`/input/${auth().currentUser.email}/${response.name}`);
        const fileExists = await storageRef.getMetadata().then(() => true).catch(() => false);
        if (fileExists) {
          Alert.alert(
            "File already exists",
            "Do you want to replace it with the current file?",
            [
              {
                text: "No",
                onPress: () => console.log("No Pressed"),
                style: "cancel"
              },
              {
                text: "Yes",
                onPress: async () => {
                  const put = await storageRef.putFile(response.fileCopyUri);
                  setfullDataRefPath(put.metadata.fullPath);
                  const url = await storageRef.getDownloadURL();
                  setdataDownloadUrl(url);
                  Alert.alert("Data uploaded successfully");

                  // Store file details in Firestore
                  const uploadDate = new Date().toLocaleDateString();
                  const uploadTime = new Date().toLocaleTimeString();
                  await firestore().collection('userQueue').doc(auth().currentUser.email).set({
                    fileName: response.name,
                    uploadedDate: uploadDate,
                    uploadedTime: uploadTime,
                    status: 'submitted'
                  });
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          const put = await storageRef.putFile(response.fileCopyUri);
          setfullDataRefPath(put.metadata.fullPath);
          const url = await storageRef.getDownloadURL();
          setdataDownloadUrl(url);
          Alert.alert("Data uploaded successfully");

          // Store file details in Firestore
          const uploadDate = new Date().toLocaleDateString();
          const uploadTime = new Date().toLocaleTimeString();
          await firestore().collection('userQueue').doc(auth().currentUser.email).set({
            fileName: response.name,
            uploadedDate: uploadDate,
            uploadedTime: uploadTime,
            status: 'submitted'
          });
        }
      } else {
        // Handle the case where the user cancels the document picker
        Alert.alert("Document picking canceled");
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const logout=async()=>{
    try {
      await auth().signOut();
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error logging out. Please try again.');
      
    }
  }
  const [isAccountOptionsVisible, setAccountOptionsVisible] = useState(false);

  //checking user logged in
  const user = auth().currentUser;
  
  if (user) {
    console.log('User is signed in:', user);
    console.log(user);
  } else {
    console.log('No user is signed in');
  }
  //

  const toggleAccountOptions = () => {
    setAccountOptionsVisible(!isAccountOptionsVisible);
  };

  const handleAccountOptionPress = async (option) => {
    if (option === 'Change Password') {
      try {
        // Send a password reset email to the user's email address
        await auth().sendPasswordResetEmail(auth().currentUser.email);
        Alert.alert('Password reset email sent. Check your inbox.');
      } catch (error) {
        console.error(error);
        Alert.alert('Error sending password reset email. Please try again.');
      }
    } else if (option === 'Delete Files') {
      // Handle other options
      try {
        const response = await storage().ref(fullDataRefPath).delete();
      console.log(response);
        
      } catch (error) {
        console.log(err);
        
      }

    }else if (option === 'Close Menu') {
      
    }else if (option === 'View Files') {
      navigation.navigate('ViewFiles')
      
    }  else if (option === 'Log Out') {
      // Handle logout
      logout();
      
    }
    // Close the account options menu
    setAccountOptionsVisible(false);
  };


  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#EFB7B7', paddingTop: 200 }}>
    <TouchableOpacity
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
        }}
        onPress={toggleAccountOptions}
      >
        <Image source={AccountIcon} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
      </TouchableOpacity>

      {/* Account Options Modal */}
      {isAccountOptionsVisible && (
        <Modal
    transparent={true}
    animationType="slide"
    visible={isAccountOptionsVisible}
    onRequestClose={() => setAccountOptionsVisible(false)}
  >
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 70 }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#FA5007', // Set background color for the entire row
          width: '50%', // Set width to 100%
        }}
        onPress={() => handleAccountOptionPress('Change Password')}
      >
        <Text style={{ fontSize: 18, margin: 10, color: '#fff' }}>Change Password</Text>
      </TouchableOpacity>

      

      <TouchableOpacity
        style={{
          backgroundColor: '#FA5007', // Set background color for the entire row
          width: '50%', // Set width to 100%
        }}
        onPress={() => handleAccountOptionPress('Log Out')}
      >
        <Text style={{ fontSize: 18, margin: 10, color: '#fff' }}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#FA5007', // Set background color for the entire row
          width: '50%', // Set width to 100%
        }}
        onPress={() => handleAccountOptionPress('View Files')}
      >
        <Text style={{ fontSize: 18, margin: 10, color: '#fff' }}>View Files</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#FA5007',
          width: '50%',
        }}
        onPress={() => handleAccountOptionPress('Close Menu')}
      >
        <Text style={{ fontSize: 18, margin: 10, color: '#fff' }}>Close menu</Text>
      </TouchableOpacity>
    </View>
  </Modal>
      )}
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 5 }}> WELCOME</Text>
      <Text style={{ fontSize: 20, fontWeight: 'normal', color: '#000000', marginBottom: 30 }}> {user.displayName}</Text>
      
      <Image source={Companylogo} style={{ width: 900, height: 115, resizeMode: 'contain' }}/>

      <View style={{ marginTop: 30, width: '100%' }}>
        <TouchableOpacity
          style={{
            height: 60,
            borderRadius: 20,
            backgroundColor: '#FA5007',
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }} onPress={() => pickdoc()}>Upload File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 60,
            borderRadius: 20,
            backgroundColor: '#FA5007',
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
            //opacity: csvData ? 1.0 : 0.5,
          }}
          //disabled={!csvData}
          onPress={() => navigation.navigate('extra')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>Expense/Income Categorization</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 60,
            borderRadius: 20,
            backgroundColor: '#FA5007',
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
            //opacity: csvData ? 1.0 : 0.5,
          }}
          //disabled={!csvData}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>View Reports</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 30, color: '#000000', fontSize: 18 }}>Select and upload your financial-related data and view the analytics</Text>
      
    </View>
  );
}
export default MainScreen