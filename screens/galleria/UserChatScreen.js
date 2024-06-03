import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator , Animated, ImageBackground} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '@/server/constants/URL'
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { BackHandler } from 'react-native';
import { createChat, deleteMessage, toggleFetchPosts, setFetchPostsToFalse } from '@/server/actions/notificationActions';







const FloatingButton = ({ onPress }) => {
  const position = useRef(new Animated.Value(-100)).current; // Start position off-screen

  useEffect(() => {
    // Animate the button to float down from the top
    Animated.timing(position, {
      toValue: 0, // End position
      duration: 1000, // Animation duration
      useNativeDriver: true,
    }).start();

    // Animate the button to float back up after 5 seconds
    const timeout = setTimeout(() => {
      Animated.timing(position, {
        toValue: -100, // End position (off-screen)
        duration: 1000, // Animation duration
        useNativeDriver: true,
      }).start();
    }, 55000);

    return () => clearTimeout(timeout);
  }, [position]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        transform: [{ translateY: position }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 25,
          elevation: 5,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Refresh</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};








const UserChatScreen = () => {
  const fetchPosts = useSelector((state) => state.fetchPostsState.fetchPosts);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchDataInterval = useRef(null);
  const [trigger, setTrigger] = useState(true);
  const [loading2, setLoading2] = useState(true);


  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [totalPages, setTotalPages] = useState(1);
  const { receiver_id } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [refreshing2, setRefreshing2] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [content, setContent] = useState('');
  const chatCreate = useSelector((state) => state.chatCreate);
  const { loading: loadingChat, error: errorChat, success, chat } = chatCreate;

  const submitHandler = () => {
    dispatch(createChat({ receiver_id: receiver_id, content }));
    setContent(''); // Clear the input field
  };


  
  useFocusEffect(
    useCallback(() => {
      // Your logic when the screen is focused
      console.log('Screen focused');
      dispatch(toggleFetchPosts());
  
      // if (fetchPosts) {
      //   fetchDataInterval.current = setInterval(fetchData, 1000);
      // }
  
      return () => {
        // Your logic when the screen is unfocused
        console.log('Screen unfocused');
        dispatch(setFetchPostsToFalse());
        setConversations:[]
        setLoading(true)
        // Clear the interval

      };
    }, [userInfo, searchText, setConversations])
  );


  useEffect(() => {
    const fetchDataLoop = setInterval(() => {
      // Check if fetchPosts and trigger are true
      if (fetchPosts === true && trigger === true) {
        // Fetch data
        fetchData();
        console.log("Fetching");
      } else {
        console.log("We can't fetch anything");
        // Clear the interval if conditions are not met
        clearInterval(fetchDataLoop);
      }
    }, 1000);
  
    // Cleanup function to clear the interval when component unmounts or fetchPosts/trigger changes
    return () => {
      clearInterval(fetchDataLoop);
    };
  }, [fetchPosts, trigger]); // Run this effect whenever fetchPosts or trigger changes
  
  

  // useEffect(() => {
  //   const fetchDataLoop = setInterval(() => {
  //     // Check if fetchPosts is true
  //     if (fetchPosts === true && trigger === true) {
  //       // Fetch data
  //       fetchData();
  //       console.log("Fecthing")

  //     } else {
  //       console.log("We cant Fetch anthing")
  //       // setLoading(true)
  //       // setConversations:[]


  //     }
  //   }, 1000);

  //   // Cleanup function to clear the interval when component unmounts or fetchPosts becomes false
  //   return () => {
  //     clearInterval(fetchDataLoop);
  //   };
  // }, [fetchPosts, trigger]); // Run this effect whenever fetchPosts changes


  useEffect(() => {
    const backAction = () => {
      // Your custom logic here
      console.log('Back button pressed');
      // return true; // Return true to prevent the default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // useEffect(() => {
  //   // Dispatch the action to toggle fetchPosts to true
  //   dispatch(toggleFetchPosts());
  // }, [dispatch]);



  // useEffect(() => {
  //   let intervalId;

  //   if (!fetchPosts) {
  //     // Start the interval only if fetchPosts is true
  //     intervalId = setInterval(() => {
  //       // Dispatch the action to set fetchPosts to false every second
  //       dispatch(toggleFetchPosts());
  //     }, 1000);
  //   }

  //   // Clean up function to clear the interval when fetchPosts becomes false
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [fetchPosts, dispatch]);




  const fetchData = async () => {
    setLoading(true);

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      }
    };


    
      
      const response = await axios.get(`${API_URL}/api/notifications/chats/${receiver_id}/?name=${searchText}&page=${page}`, config);
      setConversations(response.data.results);
      setTotalPages(response.data.total_pages);
 
      setLoading(false);
      setLoading2(false);





  };


  useEffect(() => {
    fetchData();
  }, [page, searchText, userInfo]);

  // useEffect(() => {
  //   if (fetchPosts === true) {
  //     fetchData();

      
  //   }
  // }, [page, searchText, userInfo, fetchPosts]);



  // useFocusEffect(

  //   useCallback(() => {
  //     fetchDataInterval.current = setInterval(fetchData, 1000);

  //     return () => {
  //       if (fetchDataInterval.current && fetchPosts) {
  //         clearInterval(fetchDataInterval.current);
  //         fetchDataInterval.current = null;
  //       }
  //     };



  //   }, [searchText, userInfo])


  // );

  const handleLoadMore = () => {
    setTrigger(false)
    setRefreshing2(true); // Start the refreshing animation
    setPage((prevPage) => prevPage + 1);
  };

  const handleLoadLess = () => {
    if (page > 1) {
      setRefreshing2(true);
      setPage((prevPage) => prevPage - 1);
      setTrigger(true)
    }
    if (page != 1) {
      setPage((prevPage) => prevPage - 1);

      
    }
  };

  const handleRefresh = async () => {
    setTrigger(true)

    setRefreshing(true);
    setConversations([]);
    await fetchData();
    setRefreshing(false);
  };

  const handleDelete = (messageId) => {
    dispatch(deleteMessage(messageId));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const timeDifference = formatDistanceToNow(date, { addSuffix: true });
    return timeDifference;
  };

  const renderItem = ({ item }) => (


    <View
      style={{
        backgroundColor: 'black',
        marginBottom: 20,
        alignSelf: userInfo?.id === item.sender ? 'flex-end' : 'flex-start',
        padding: 10,
        maxWidth: '80%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: userInfo?.email === item.name ? 'red' : 'blue',
            }}
          >
            {item.name}
          </Text>
          <Text style={{ marginLeft: 10, color: 'gray' }}>
            {formatDistanceToNow(item.timestamp)}
          </Text>

        </View>
        
      </View>
      
      <View
        style={{
          backgroundColor: userInfo?.id === item.sender ? '#ff3333' : '#333',
          borderRadius: 15,
          padding: 15,
          marginTop: 10,
          marginBottom: 40,
          borderTopLeftRadius: userInfo?.id === item.sender ? 15 : 0,
          borderTopRightRadius: userInfo?.id === item.sender ? 0 : 15,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      >
        <Text style={{ color: 'white' }}>{item.content}</Text>
        {userInfo?.id === item.sender && item.is_read && (
            <Ionicons
              name="eye-outline"
              size={24}
              color="green"
              style={{ marginLeft: 10 }}
            />
          )}
          {userInfo?.id === item.sender && !item.is_read && (
            <Ionicons
              onPress={() => handleDelete(item.id)}
              name="trash-outline"
              size={24}
              color="blue"
              style={{ marginLeft: 10 }}
            />
          )}
      </View>
    </View>
  );

  return (
    
    <View style={styles.container}>
                <View>
            <View>
              <Text style={{color:"red" }}>Beta Version -- 1.0</Text>
              <Text style={{color:"red" }}>You wil only be able to see the latest 10 messages exchanged in this beta version. Having any Problems, dont worry just refresh the screen.</Text>

              <TextInput
                style={styles.input}
                placeholder="Write a message Here"
                multiline
                value={content}
                placeholderTextColor="red"
                onChangeText={setContent}
              />

              {loadingChat ? 
                        <TouchableOpacity style={styles.sendButton} onPress={submitHandler}>
                          <Text style={styles.sendIcon}>⌛</Text>
                      </TouchableOpacity> :
                                    <TouchableOpacity style={styles.sendButton} onPress={submitHandler}>
                                    <Ionicons name="send-outline" size={24} color="green" style={styles.sendIcon} />
                                  </TouchableOpacity>
              
            }

            </View>
          </View>
{trigger === false &&
  <FloatingButton  onPress={handleRefresh}/>

}

      <ScrollView style={styles.scrollView}>







  { 
  
  conversations.length < 1 && (
    loading2 ? (
      <ActivityIndicator size="large" color="red" />
    ) : (
  
      <View style={styles.emptyMessage}>
      <Text style={styles.emptyText}>Nothing Here Send Something To Start A Convo⌛ </Text>
      <Ionicons
        name="send"
        size={24}
        color="red"
        style={styles.icon}
      />
    </View>
    ))}
  
  
  
  
  
  
  <View style={styles.container}>












          <FlatList
            data={conversations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}

            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={refreshing2 && <ActivityIndicator color='red' />}

          />
        </View>






      </ScrollView>
      {/* <View style={styles.buttonContainer}>
        {conversations.length === 10 &&
        <TouchableOpacity style={styles.button} onPress={handleLoadMore}>
          <Text style={styles.buttonText}>Load More</Text>
        </TouchableOpacity>
         }
        {page !== 1 &&
          <TouchableOpacity style={styles.button} onPress={handleLoadLess}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        }
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    height: 50,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 50,
  },
  sendIcon: {
    color: 'white',
  },
  scrollView: {
    marginBottom: 60,
  },
  messageContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
  },
  icon: {
    color: 'blue',
  },
  messageContent: {
    marginTop: 5,
    color: "white"
  },
  loadMoreButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  loadMoreIcon: {
    color: 'red',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 120,
    marginVertical: 10,
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

export default UserChatScreen;
