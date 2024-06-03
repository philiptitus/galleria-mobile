import React, { useState, useEffect , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, StyleSheet, ImageBackground, ActivityIndicator, TextInput} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Badge } from 'react-native-paper';
import API_URL from '@/server/constants/URL'
import { Ionicons } from '@expo/vector-icons';
import { setFetchPostsToFalse } from '@/server/actions/notificationActions';



const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(true);
  const [trigger2, setTrigger2] = useState(false);


  const [page, setPage] = useState(1);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false); // Add this state
  const [refreshing2, setRefreshing2] = useState(false); // Add this state

  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const [message, setMessage] = useState([]);
  const [error, setError] = useState(null);
  const screenWidth2 = Dimensions.get('window').width;
  const fetchDataInterval = useRef(null);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const screenheight = Dimensions.get('window').height;
  const [loading2, setLoading2] = useState(true);

  // useEffect(() => {
  //   if (!userInfo) {
  //     const intervalId = setInterval(() => {
  //       navigation.navigate('Login');
  //     }, 500); // Reduced interval time to 500 milliseconds
  
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userInfo, navigation]);

  const fetchData = async () => {
    setLoading(true);

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const response = await axios.get(`${API_URL}/api/notifications/conversations/?name=${searchText}&page=${page}`, config);

    // Sort conversations so that those with unread messages come first
    const sortedConversations = response.data.results.sort((a, b) => b.unread_count - a.unread_count);

    setConversations(sortedConversations);
    setTotalPages(response.data.total_pages);

    setLoading(false);
    setLoading2(false);

  };

  // Fetch data initially and whenever page, searchText, or userInfo changes
  useEffect(() => {
    fetchData();
  }, [page, searchText, userInfo]);

  // Set up the interval to fetch data every second
  useEffect(() => {
    if (!searchText && trigger) {
      fetchDataInterval.current = setInterval(fetchData, 1000);
    
      return () => clearInterval(fetchDataInterval.current);
    }
  }, [userInfo, searchText, trigger]);
  


  const startFetchDataInterval = () => {
    if (!fetchDataInterval.current) {
      fetchDataInterval.current = setInterval(fetchData, 1000);
    }
  };


  const handleLoadMore = () => {
      setRefreshing2(true); // Start the refreshing animation
      setPage((prevPage) => prevPage + 1);
      // setRefreshing2(false); // Start the refreshing animation

  
    // Clear the fetchData interval to stop the looping process
    if (fetchDataInterval.current) {
      clearInterval(fetchDataInterval.current);
    }
    setTrigger(false)


  };

  const handleLoadLess = () => {
    if (page > 1) { // Ensure the page number does not go below 1
      setRefreshing2(true); // Start the refreshing animation
      setPage((prevPage) => prevPage - 1);
  
      // Clear the fetchData interval to stop the looping process
      setTrigger(true)


      // setRefreshing2(false); // Stop the refreshing animation
    }
  };
  
  
  const handleRefresh = async () => {
    setRefreshing(true); // Start the refreshing animation
    // setPage(1); // Reset page to 1 before fetching new data
    setConversations([]); // Clear current posts to avoid duplicates

    await fetchData();

    setRefreshing(false); // Stop the refreshing animation
  };


  const renderItem = ({ item }) => (
    <View style={{

      backgroundColor: '#1c1c1c',
      borderRadius: 15,
      marginVertical: 5,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
      width: screenWidth2,
    }}>
      <TouchableOpacity onPress={() => navigation.navigate('Chat', { receiver_id: item.id })}>
        <View style={styles.itemContent}>
          <View style={styles.itemText}>
            <Image
              source={{ uri: item.avi }}
              style={styles.avatar}
            />
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
          {item.unread_count !== 0 && <Badge style={styles.badge}>{item.unread_count}</Badge>}
        </View>
      </TouchableOpacity>
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


    <ImageBackground source={require('../../assets/images/cloud.jpg')} style={styles.backgroundImage}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Conversations  <Text style={{color:"red"}}> - beta version</Text></Text>
<Text>Check The web app for best experience</Text>
          {/* <TextInput
        placeholder='Search For An Older Converstion Here'
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        style={{
          width: '100%',
          padding: 8,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'white',
          color: 'black', // Adjust text color as needed
          backgroundColor: 'white', // Adjust background color as needed
        }}
      /> */}
          {conversations.length < 1 && (
  loading2 ? (
    <ActivityIndicator size="large" color="red" />
  ) : (
    <View style={styles.emptyMessage}>
      <Text style={styles.emptyText}>Nothing Here Hop Over To A Friends Profile And Click On</Text>
      <Ionicons
        name="send"
        size={24}
        color="red"
        style={styles.icon}
      />
      <Text style={styles.emptyText}>To Start The Conversation...</Text>
    </View>
  )
)}



          <View>
            <FlatList
              data={conversations}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReachedThreshold={0.5}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListFooterComponent={refreshing2 && <ActivityIndicator color='red' />}

            />


          </View>

        </View>

      </ScrollView>
      <View style={styles.buttonContainer}>
{ conversations.length > 9 &&       
      <TouchableOpacity style={styles.button} onPress={handleLoadMore}>
          <Text style={styles.buttonText}>Load More</Text>

          </TouchableOpacity>}
          {page !== 1 &&  
          <TouchableOpacity style={styles.button} onPress={handleLoadLess}>
          <Text style={styles.buttonText}>Previous</Text>

          </TouchableOpacity>
          }
          </View>
    </ImageBackground>
}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginTop: 30,
    marginBottom: 30,
    fontFamily: 'ComicNeue-Bold', // Cartoonish font
  },
  emptyMessage: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'ComicNeue-Regular', // Cartoonish font
  },
  icon: {
    marginVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    width: 600,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'red',
  },
  itemName: {
    color: 'red',
    fontSize: 18,
    fontFamily: 'ComicNeue-Bold', // Cartoonish font
  },
  badge: {
    backgroundColor: 'red',
    color: 'white',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 120,
    marginVertical: 10, // Add some space between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Chat;
