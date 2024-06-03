import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl , FlatList, Dimensions} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import API_URL from '@/server/constants/URL'


const generateRandomKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


const Test = () => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false); // Add this state

  const [error, setError] = useState(null);
  const screenheight = Dimensions.get('window').height;

  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  // useEffect(() => {
  //   if (!userInfo) {
  //     const intervalId = setInterval(() => {
  //       navigation.navigate('Login');
  //     }, 500); // Reduced interval time to 500 milliseconds
  
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userInfo, navigation]);
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const response = await axios.get(`${API_URL}/api/notifications/?name=${searchText}&page=${page}`, config);
        setData((prevData) => [...prevData, ...response.data.results]);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error( error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, [page, searchText]);

    const handleRefresh = async () => {
      setRefreshing(true); // Start the refreshing animation
      setPage(1); // Reset page to 1 before fetching new data
      setData([]);

      await fetchData();

      setRefreshing(false); // Stop the refreshing animation


    };
  

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const renderItem = ({ item }) => (
<View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1e1e1e', borderRadius: 10, marginVertical: 25 }}>
    <View style={{ marginRight: 10 }}>
      {/* Uncomment and use this if you have an image to show */}
      {/* 
      <Image 
        source={{ uri: API_URL + item.avi }} 
        style={{ width: 50, height: 50, borderRadius: 25 }} 
      /> 
      */}
      <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
        {item.notification_type === 'account' && 'ACCOUNT'}
        {item.notification_type === 'chat' && 'CHAT'}
        {item.notification_type === 'comment' && 'COMMENT'}
        {item.notification_type === 'like' && 'LIKE'}
        {item.notification_type === 'follow' && 'FOLLOWS'}
      </Text>
    </View>
    <Text style={{ color: 'white', flex: 1 }} numberOfLines={2}>
      {item.message}
    </Text>
  </View>
  );
  
  return (
    <View style={{backgroundColor:"black", minHeight: screenheight}}>

{!userInfo ? 
          <View>

      <TouchableOpacity
      onPress={navigation.navigate("Login")}
      style={styles.button}
      >
      <Text style={{color:"white"}}>Sign In</Text>

      </TouchableOpacity>
      
      {/* <TouchableOpacity>sign in</TouchableOpacity> */}
      </View>
      :

    <View style={{ flex: 1, backgroundColor: 'black', padding: 10 }}>
      <Text style={styles.heading}>Notifications</Text>
        {data.length === 0 && <Text style={styles.nothingText}>Nothing New</Text>}

        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={() => generateRandomKey()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator color='red' />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      
      />
    </View>
}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:30,
    color:"white"
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, // Add some space between buttons
  },
  nothingText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  notificationContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
  },
  notificationType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color:"red"
  },
  notificationMessage: {
    fontSize: 16,
  },
  loadMoreButton: {
    alignItems: 'center',
    padding: 10,
  },
  loadMoreIcon: {
    color: 'red',
  },
});

export default Test;
