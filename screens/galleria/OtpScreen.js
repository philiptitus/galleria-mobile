import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useSnackbar } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper

import { verifyOtpAction } from '@/server/actions/userAction';


const OTPScreen = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const verifyOtp = useSelector((state) => state.verifyOtp);
  const { loading: loadingOtp, error: errorOtp, success: successOtp, Otp } = verifyOtp;


  const expirationTime = userInfo?.expiration_time;


  useEffect(() => {
    if (!userInfo) {
      const intervalId = setInterval(() => {
        navigation.navigate('Login');
      }, 500); // Reduced interval time to 500 milliseconds
  
      return () => clearInterval(intervalId);
    }
  }, [userInfo, navigation]);


 



  const submitHandler = async () => {
    setLoading(true);
    try {
      const otpValue = otp.join('');
      await dispatch(verifyOtpAction( otpValue )); // Assuming backend accepts 'otp' property

      // Handle success
      showSnackbar("OTP verification Success ", 'success');
    //   navigation.navigate('Home');
    } catch (error) {
      // Handle error
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Limit to one digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5 && value !== '') {
      inputRefs.current[index + 1].focus();
    }
  };

  
  useEffect(() => {

    if (successOtp) {
      showSnackbar("OTP verification Success ",  'success' );
    navigation.navigate("/")
    }
    if (errorOtp) {
      showSnackbar(errorOtp, 'error' );
    }
    
    
  }, [navigation, loadingOtp, successOtp, errorOtp]);



  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
      <Text style={styles.text}>We Sent An OTP to {user.email}</Text>
      <Text style={styles.text}>Check your spam mails</Text>
      <Text style={styles.heading}>Enter OTP</Text>
      <View style={styles.otpInputContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(index, text)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} disabled={loading || otp.some((value) => value === '')} onPress={submitHandler}>
      {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Verify</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    marginBottom: 15,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default OTPScreen;