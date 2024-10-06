import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/server/actions/userAction';
import {ActivityIndicator} from 'react-native';
// import { useSnackbar } from 'notistack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { register } from '@/server/actions/userAction';
import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper



const RegisterScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState('');

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo, success } = userRegister;

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const dispatch = useDispatch()

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isFocused = useIsFocused(); // Get the isFocused value

  useEffect(() => {
    if (userInfo) {
      navigation.navigate('Login');
    }
    if (error) {
      showSnackbar(error, 'error');


    }
  }, [dispatch, userInfo, error]);


  const LoginHandler = (e) => {
navigation.navigate('Login')
};



const showSnackbar = (message, variant) => {
  setSnackbarMessage(message);
  setVisible(true);
};

const onDismissSnackBar = () => setVisible(false);

const ResetHandler = (e) => {

  navigation.navigate("Password Reset")
};
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        <Text style={{ color: 'red' }}>Passwords did not match</Text>
    } else {
      try {
        await dispatch(register(name, email, password));
        {success && navigation.navigate('Login') }
        
      } catch (error) {
        
        <Text style={{ color: 'red' }}>{error}</Text>
    }
    }
  };


  return (
    <ImageBackground
    source={require('../../assets/images/login.jpg')}
    style={styles.backgroundImage}
    >
{/* {errorLogin && enqueueSnackbar(errorLogin, { variant: 'error' })
} */}
      <View style={styles.container}>
        {/* {loading && 
      <View style={[styles.container2, styles.horizontal]}>
    <ActivityIndicator size="large" color="red" />
  </View>
  } */}
{/* {error && 
  <Text style={{ color: 'red' }}>{error}</Text>
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
                        <TextInput
              style={styles.input}
              placeholder="@Username"
              placeholderTextColor="#fff"
              autoCompleteType="name"
              value={name}
              onChangeText={setName}
              
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
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#fff"
        autoCompleteType="password"
        secureTextEntry={!showPassword2} // Toggle secureTextEntry based on showPassword state
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity onPress={togglePasswordVisibility2} style={styles.eyeIcon}>
        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={submitHandler} style={styles.submitButton}>
{loading ? 
  <ActivityIndicator size="large" color="red" />
:

<Text style={styles.submitButtonText}>Register</Text>


}




          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText} onPress={LoginHandler}>Login</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 50,
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

export default RegisterScreen;
