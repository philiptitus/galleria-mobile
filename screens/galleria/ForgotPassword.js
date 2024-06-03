import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { useDispatch, useSelector } from 'react-redux';
import { login, forgot_password } from '@/server/actions/userAction';
import {ActivityIndicator} from 'react-native';
// import { useSnackbar } from 'notistack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper


const ForgotPassword = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const forgotPassword = useSelector((state) => state.forgotPassword);
  const { error, loading, success } = forgotPassword;
// const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  const [showPassword, setShowPassword] = useState(false);

  const [visible, setVisible] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible(true);
  };
  
  const onDismissSnackBar = () => setVisible(false);
  
  const dispatch = useDispatch()

const isFocused = useIsFocused(); // Get the isFocused value

 

const handleSubmit2 =  () => {

  dispatch(forgot_password(email))


  

};


  useEffect(() => {
    if (success) {
      navigation.navigate('Login');
    }

    if (error) {
      showSnackbar("Ensure Your Email Is Verified First!", 'error');


    }
  }, [success, navigation, error]);

 


  return (
    <ImageBackground
      source={{ uri: 'http://promac.epizy.com/login.jpg' }}
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
<Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
{success && 
  <Text style={{ color: 'green' }}>Check Your Email For Further Instructions</Text>
}

        <Text style={styles.title}>Galleria</Text>
        <View style={styles.form}  >
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Enter A Verified @Email"
              placeholderTextColor="#fff"
              autoCompleteType="email"
              value={email}
              onChangeText={setEmail}
              
            />
          </View>

          <TouchableOpacity onPress={handleSubmit2} style={styles.submitButton}>


            {loading ?
              <ActivityIndicator size="large" color="red" />
:

<Text style={styles.submitButtonText}>Send Link</Text>


          }
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    color: '#fff',
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

export default ForgotPassword;
