import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { followPrivate } from '@/server/actions/userAction';

import { Ionicons } from '@expo/vector-icons';
import API_URL from '@/server/constants/URL'
import { useNavigation } from '@react-navigation/native';

const Requests = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const screenWidth2 = Dimensions.get('window').width;

  const followUserState = useSelector((state) => state.userFollow) || {};
  const { error: errorFollow, success: successFollow, loading: loadingFollow } = followUserState;

  const handleAcceptRequest = useCallback(async (id) => {
    try {
      await dispatch(followPrivate(id, { action: "accept" }));
      showSnackbar("Request Accepted", 'success');
      handleRefresh();
    } catch (error) {
      showSnackbar(error.message, 'error');
      console.error(error);
    }
  }, [dispatch]);

  const handleRejectRequest = useCallback(async (id) => {
    try {
      await dispatch(followPrivate(id, { action: "decline" }));
      showSnackbar("Request Rejected", 'error');
      handleRefresh();
    } catch (error) {
      showSnackbar(error.message, 'error');
      console.error('Error rejecting request:', error);
    }
  }, [dispatch]);

  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const onDismissSnackBar = () => setVisible(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.get(`${API_URL}/api/users/requests/?name=${searchText}&page=${page}`, config);
      setRequests(prevPosts => [...prevPosts, ...response.data.results]);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [userInfo, searchText, page]);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  useEffect(() => {
    if (successFollow) {
      showSnackbar("Response Sent", 'success');
      handleRefresh();
    }
    if (errorFollow) {
      showSnackbar("Something Went Wrong", 'error');
    }
  }, [dispatch, successFollow, errorFollow]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setRequests([]);
    await fetchData();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = useCallback(({ item }) => (
    <View style={{ width: screenWidth2 }}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => navigation.navigate('Other', { userId: item.requester })}>
          <Image source={{ uri: API_URL + item.avi }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ marginRight: 6 }} onPress={() => handleAcceptRequest(item.id)}>
            <Ionicons name="checkmark-circle" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRejectRequest(item.id)}>
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [handleAcceptRequest, handleRejectRequest, navigation]);

  return (
    <View style={styles.container}>
      {requests.length === 0  &&
      <Text style={{color:"yellow"}}>You haven't received any new follow requests</Text>
      }
      {loadingFollow && <ActivityIndicator size="small" color="green" />}
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => (loading ? <ActivityIndicator size="small" color="red" /> : null)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={{ backgroundColor: snackbarMessage.includes('error') ? 'red' : 'green' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    minHeight: 1200,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
  },
});

export default Requests;
