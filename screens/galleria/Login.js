import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/server/actions/userAction';
import {ActivityIndicator} from 'react-native';
// import { useSnackbar } from 'notistack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '@/server/constants/URL';
import { getUserDetails } from '@/server/actions/userAction';
import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper




const saveUserInfo = async (newData) => {
  try {
    const existingData = await AsyncStorage.getItem('userInfo');
    const parsedData = existingData ? JSON.parse(existingData) : {};

    // Update existing data with newData
    const updatedData = { ...parsedData, ...newData };

    await AsyncStorage.setItem('userInfo', JSON.stringify(updatedData));
    console.log('UserInfo updated', updatedData);
  } catch (error) {
    console.error('Error saving userInfo:', error);
  }
};

const addItemToUserInfo = async (key, value) => {
  try {
    const existingData = await AsyncStorage.getItem('userInfo');
    const parsedData = existingData ? JSON.parse(existingData) : {};

    // Add new item
    parsedData[key] = value;

    await AsyncStorage.setItem('userInfo', JSON.stringify(parsedData));
    console.log('Item added to userInfo', parsedData);
  } catch (error) {
    console.error('Error adding item to userInfo:', error);
  }
};






const LoginScreen = () => {
  const navigation = useNavigation()
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [email, setEmail] = useState('');
  const userLogin = useSelector((state) => state.userLogin);
  const { error:errorLogin, loading:loadingLogin, userInfo:userInfoLogin, sucess:successLogin } = userLogin;
  // const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  const [showPassword, setShowPassword] = useState(false);
  const forgotPassword = useSelector((state) => state.forgotPassword);
  const {  success } = forgotPassword;
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);


  const userRegister = useSelector((state) => state.userRegister);
  const {  success: successRegister } = userRegister;


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch()

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isFocused = useIsFocused(); // Get the isFocused value
  const userDetails = useSelector((state) => state.userDetails);
  const {  user } = userDetails;
 


  const LoginHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    setLoader(true)
  };

  useEffect(() => {
    if (userInfoLogin) {
      dispatch(getUserDetails('profile'));
      showSnackbar("Welcome Back , Hold On A Sec!", 'success');
      navigation.navigate('HomeTabs');


      setLoader(false)

    }
    if (errorLogin) {
      setLoader(false)
      showSnackbar(errorLogin, 'error');


    }


    if (successRegister) {
      showSnackbar("Welcome Now Just Login", 'success');


    }


    if (success) {
      showSnackbar("Check Your Email For Further Instructions", 'success');


    }
  }, [dispatch, userInfoLogin, errorLogin, successRegister]);


  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const onDismissSnackBar = () => setVisible(false);


  const RegisterHandler = (e) => {

    navigation.navigate("Register")
  };

  const ResetHandler = (e) => {

    navigation.navigate("Password Reset")
  };


  useEffect(() => {
    if (userInfoLogin?.email) {
      const initialData = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        avi: user?.avi,
        date_joined: user?.date_joined,
        bio: user?.bio,
        total_followers: user?.total_followers,
        total_following: user?.total_following,
        isPrivate: user?.isPrivate,
        is_tutorial: user?.is_tutorial
      };
      saveUserInfo(initialData);
    }
  }, [userInfoLogin]);

  useEffect(() => {
    if (userInfoLogin && isFocused) {
      const fetchUserDetails = async () => {
        await dispatch(getUserDetails('profile'));
  
        if (user?.is_tutorial === true) {
          navigation.navigate('Galleria');
        }

        if (user?.is_tutorial === false) {
          navigation.navigate('tutorial');
        }
      };
  
      fetchUserDetails();
    }
  }, [userInfoLogin, isFocused, navigation, user]);
  


  return (
    <ImageBackground
    source={require('../../assets/images/login.jpg')}
      style={styles.backgroundImage}
    >
{/* {errorLogin && enqueueSnackbar(errorLogin, { variant: 'error' })
} */}
      <View style={styles.container}>
        {/* {loader && 
      <View style={[styles.container2, styles.horizontal]}>
    <ActivityIndicator size="large" color="red" />
  </View>
  } */}
{/* {errorLogin && 
  <Text style={{ color: 'red' }}>{errorLogin}</Text>
}
{success && 
  <Text style={{ color: 'green' }}>Check Your Email For Further Instructions</Text>
} */}

<Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>


        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../assets/images/logo2.png')}
        style={{ width: 160, height: 160, borderRadius: 50 }}
        onError={() => console.log('Error loading image')}
      />
    </View>

        <View style={styles.form}  >
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fff"
              autoCompleteType="email"
              value={email}
              onChangeText={setEmail}
              
            />
          </View>
          <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        autoCompleteType="password"
        secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
          <TouchableOpacity onPress={LoginHandler} style={styles.submitButton}>
{loader ? 

<ActivityIndicator size="large" color="red" />
:
<Text style={styles.submitButtonText}>Login</Text>

}
          
          
          </TouchableOpacity>

          <TouchableOpacity onPress={RegisterHandler} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={ResetHandler}>
            <Text style={styles.link}>Forgot Password</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',

  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    alignItems: 'center',
  },
  inputBox: {
    position: 'relative',
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  label: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#03a9f4',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: 'red',
    marginTop: 20,
    textDecorationLine: 'underline',
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
});

export default LoginScreen;
