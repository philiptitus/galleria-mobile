import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Button , Image,TouchableOpacity, Dimensions, RefreshControl} from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Assuming Expo is used for React Native development
import { getUserDetails, updateUserProfile , getOtpAction} from '@/server/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused , useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator, Alert} from 'react-native';
import { useNavigation } from 'expo-router';
import { USER_UPDATE_PROFILE_RESET } from '@/server/constants/userConstants';
import axios from 'axios';
import { useSnackbar } from '@react-native-community/hooks'; // Or any other Snackbar library
import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper
import API_URL from '@/server/constants/URL';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { launchImageLibrary } from 'react-native-image-picker';
import Delete from '@/components/galleria/Delete'




const FileUpload = ({ onChange }) => {
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleButtonClick = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    console.log('Image Picker Result:', result);

    if (!result.canceled) {
      const { uri } = result.assets[0]; // Access the URI from the assets array
      console.log('Image URI:', uri);
      onChange(uri);
    } else {
      console.log('User cancelled image picker');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleButtonClick} style={{ alignItems: 'center' }}>
        <Ionicons name="cloud-upload" size={30} color="red" />
        <Text style={{ color: 'red' }}>Upload Pfp</Text>
      </TouchableOpacity>
    </View>
  );
};

const ChangePhoto = () => {
  const [avi, setAvi] = useState('');
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success: successUpdate } = userUpdateProfile;

  const uploadFileHandler = async (uri) => {
    const formData = new FormData();
    formData.append('avi', {
      uri: uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
    formData.append('user_id', userInfo?.id);

    setAvi(uri);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/api/users/upload/`, formData, config);
      showSnackbar("Profile Photo Updated", 'success');
      setUploading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
      showSnackbar(errorMessage, 'error');
      console.log(errorMessage);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      // Navigate to login screen
    } else {
      if (!user || !user.name || successUpdate || userInfo._id !== user._id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
      }

      if (successUpdate) {
        showSnackbar("Your Profile Was Updated Successfully", 'success');
      } else {
        setAvi(user?.avi);
      }
    }
  }, [dispatch, userInfo, user, successUpdate]);

  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{ padding: 20 }}>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginTop: 10, marginBottom: 5, color: "red" }}>CHANGE YOUR AVI HERE</Text>
          <View style={{ alignItems: 'center' }}>

          {avi && <Image source={{ uri: avi }} style={{ width: 100, height: 100 }} />}
          
          </View>
          
          <FileUpload onChange={uploadFileHandler} />
        </View>
      )}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};



const Settings = () => {
  const navigator = useNavigation()


    const isFocused = useIsFocused(); // Get the isFocused value
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const userDetails = useSelector((state) => state.userDetails);
    const { error, loading, user } = userDetails;
    const screenWidth2 = Dimensions.get('window').width;


    // useEffect(() => {
    //   if (!userInfo) {
    //     const intervalId = setInterval(() => {
    //       navigation.navigate('Login');
    //     }, 500); // Reduced interval time to 500 milliseconds
    
    //     return () => clearInterval(intervalId);
    //   }
    // }, [userInfo, navigation]);

    useEffect(() => {
        if (userInfo) {
          dispatch(getUserDetails('profile'));
        }

        if (successOtp) {
          navigator.navigate('Verify')
          }          
          if (errorOtp) {
console.log(errorOtp)            
          }
          

      }, [dispatch, userInfo, successOtp]);

    
    const navigation = useNavigation()
    const [isPrivate, setIsPrivate] = useState(user?.isPrivate);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [refreshing, setRefreshing] = useState(false);

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success:successUpdate, error:errorUpdate, loading:loadingUpdate } = userUpdateProfile;
  const handleIsPrivateChange = (event) => {
    setIsPrivate(event.target.value === 'private');
  };



  useFocusEffect(
    useCallback(() => {
      // Your logic when the screen is focused
      console.log('Screen focused');
      if (userInfo.email != user.email) {
        refreshHandler()
            }  
      // if (fetchPosts) {
      //   fetchDataInterval.current = setInterval(fetchData, 1000);
      // }
  
      return () => {
        // Your logic when the screen is unfocused
        console.log('Screen unfocused');
 
        // Clear the interval

      };
    }, [userInfo, user])
  );




  
  const refreshHandler = async () => {
    setRefreshing(true);
    await dispatch(getUserDetails('profile'));
    setRefreshing(false);
  };
  


  const OtpHandler = () => {
    dispatch(getOtpAction())


  };




  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        <View>
            <Text>
                Passwords did not match
            </Text>
        </View>
    } else {

    dispatch(updateUserProfile({
      'id':user?._id,
      'name':name,
      'email':email,
      'password':password,
      'bio':bio,
      'avi':avi,
      'isPrivate': isPrivate,


    }))

      }
    }

    useEffect(() => {
        if (!userInfo) {
          ;
        }else{
            if(!user || !user?.name || successUpdate || userInfo?._id !== user?._id){
              dispatch({type:USER_UPDATE_PROFILE_RESET})
              dispatch(getUserDetails('profile'))
    
                
            }
  
            
  
    
            if (successUpdate) {
              {successUpdate && 

                <View>
                <Text>
Profile Updated                </Text>
            </View>
            } 
  
            
           
            }
    
    
    
            else{
                setName(user?.name)
                setEmail(user?.email)
                setBio(user?.bio)
                setAvi(user?.avi)
                
  
  
            }
        }
      }, [dispatch, userInfo, user]);
    

    
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avi, setAvi] = useState('');
  

    const dispatch = useDispatch()


      
    const getOtp = useSelector((state) => state.getOtp);
    const { loading: loadingOtp, error: errorOtp, success:successOtp, Otp } = getOtp;
    



  return (
    <ScrollView 
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
    }
    
    
    style={{
      width: screenWidth2,
      marginLeft: 'auto',
      marginRight: 'auto',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.125,
      padding: 10,
      backgroundColor:"black",
    }}>


      <View style={styles.section}>
        <View style={styles.listItem}>
          <Text
          style={styles.heading2

          }
          >Edit My Profile</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Change Password</Text>
        <View style={styles.passChange}>
          <Text style={styles.label}>New password</Text>
          <TextInput style={styles.input} 
                  value={password}
                  onChangeText={setPassword}
          secureTextEntry={true} />
        </View>
        <View style={styles.passChange}>
          <Text style={styles.label}>Confirm New password</Text>
          <TextInput 
                 value={confirmPassword}
                 onChangeText={setConfirmPassword}
          style={styles.input} secureTextEntry={true} />
        </View>

      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Edit Other Info</Text>
        <TextInput
        style={styles.textInput}
        placeholder="Username"
        placeholderTextColor="white"
        value={name}
        onChangeText={setName}


      />
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        placeholderTextColor="white"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      </View>
      
      <TextInput
        style={[styles.textInput, { height: 100 }]}
        placeholder="Bio - Tell People More About You 😍"
        placeholderTextColor="white"
        value={bio}
        onChangeText={setBio}
        multiline
      />
            <Text style={styles.label}>ACCOUNT TYPE</Text>

            <View>


      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Private</Text>
        <RadioButton
          value="private"
          status={isPrivate === true ? 'checked' : 'unchecked'}
          onPress={() => setIsPrivate(true)}
        />
        <Text style={styles.radioLabel}>Public</Text>
        <RadioButton
          value="public"
          status={isPrivate === false ? 'checked' : 'unchecked'}
          onPress={() => setIsPrivate(false)}
        />
            </View>




      <View style={styles.separator} />
      {loadingUpdate && 
      <View style={[styles.container2, styles.horizontal]}>
    <ActivityIndicator size="large" color="red" />
  </View>
  }
    {errorUpdate && 
  <Text style={{ color: 'red' }}>{errorUpdate}</Text>
}
{successUpdate && 
  <Text style={{ color: 'green' }}>Profile Updated</Text>
}

    <TouchableOpacity  onPress={submitHandler} style={styles.button} >
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
      </View>
      <View style={styles.section}>
              <Text
          style={styles.heading2

          }
          >Change Profile Picture</Text>
          <View>
            <ChangePhoto/>
          </View>
</View>
{!user?.is_verified &&
<View style={styles.section}>
              <Text
          style={styles.heading2

          }
          >Account Activation</Text>
                {loadingOtp && 
      <View style={[styles.container2, styles.horizontal]}>
    <ActivityIndicator size="small" color="red" />

  </View>
  }
      <View>
    <TouchableOpacity onPress={OtpHandler} style={{ alignItems: 'center' }}>
        <Ionicons name="checkmark-circle" size={30} color="red" />
        <Text style={{ color: 'red' }}>Send One Time Pin</Text>
      </TouchableOpacity>
      </View>





</View>
 }
<View style={styles.section}>
              <Text
          style={styles.heading2

          }
          >Delete My Account</Text>
          <Delete/>
</View>
    </ScrollView>
  );
}

const styles = {
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.125,
    padding: 10,
    backgroundColor:"black",
    width:350
  },
  separator: {
    marginVertical: 10, // Adjust the spacing as needed
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.075)',
    paddingVertical: 10,
    color: "white"
  },
  heading: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 10,
    color:"white"
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading2: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 10,
    color:"white"
  },



  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passChange: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    opacity: 0.5,
    color: "white"
  },
  input: {
    padding: 10,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    color: "white"

  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:"white"
  },
  label2: {
    marginTop: 10,
    marginBottom: 5,
    color:"white"
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  radioLabel: {
    marginHorizontal: 10,
    color: 'white', // Radio button label color
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
};

export default Settings;
