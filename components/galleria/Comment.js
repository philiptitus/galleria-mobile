import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator , TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {USER_UPDATE_PROFILE_RESET} from '@/server/constants/userConstants'

import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {createpostComment} from '@/server/actions/postActions'

export default function AddComment({ postID }) {
  const [message, setMessage] = useState('');
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { loading, error, success } = postCommentCreate;

  const submitHandler = () => {
    dispatch(createpostComment(postID, { message }));
    setMessage("")
  };

  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login'); // Redirect to login if not logged in
    } else {
      if (success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        // enqueueSnackbar("Comment Added", { variant: 'success' });
        <Text style={{ color: 'green' }}>Comment Added !</Text>

      }
      if (error) {
        <Text style={{ color: 'red' }}>{error}</Text>

        // enqueueSnackbar(error, { variant: 'error' });
      }
    }
  }, [dispatch, userInfo, success, error]);

  return (
    <View style={styles.container}>

        
        <View>

          <TextInput
            style={styles.textInput}
            placeholder="Type Comment Here"
            multiline
            placeholderTextColor="white"

            value={message}
            onChangeText={setMessage}
          />

  <TouchableOpacity
  
  
  onPress={submitHandler} style={styles.button} >

{loading ? 
        <ActivityIndicator size="large" color="blue" />
:

<Ionicons name="send" size={24} color="red" style={{ marginLeft: 8 }} />

}




    </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'black',
    marginBottom:10
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color:"white"
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderRadius: 5,
    width: 130
  },
  buttonText: {
color:"white",
fontSize: 16, // Adjust font size if needed
fontWeight: 'bold', // Make the text bold for better visibility
  },
});
