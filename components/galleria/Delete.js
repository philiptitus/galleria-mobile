import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { logout, deleteAccount, resetAccountDelete } from '@/server/actions/userAction';

function Delete() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accountDelete = useSelector((state) => state.accountDelete);
  const { success: successDelete } = accountDelete;

  useEffect(() => {
    // Handle successful account deletion
    if (successDelete) {
      dispatch(logout());
      // You might not need to reload the whole application in React Native
      // You can navigate back to the login screen
      navigation.navigate('Login');
      dispatch(resetAccountDelete()); // Reset the accountDelete state
    }
  }, [dispatch, successDelete, navigation]);

  const deleteHandler = () => {
    dispatch(deleteAccount());
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "black" }}>
      <Text style={{ color: "white", marginBottom: 20, textAlign: 'center' }}>
        You Are About To Delete Your Account. We Hate To See You Go So Soon...
      </Text>
      <Text style={{ color: "white", marginBottom: 20, textAlign: 'center' }}>
        Are You Sure You Wish To Proceed?
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={deleteHandler} style={{ marginHorizontal: 20, alignItems: 'center' }}>
          <Ionicons name="trash" size={30} color="red" />
          <Text style={{ color: 'red' }}>YES</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 20, alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={30} color="white" />
          <Text style={{ color: 'white' }}>NO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Delete;
