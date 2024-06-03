import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Snackbar } from 'react-native-paper'; // Import Snackbar
import API_URL from '@/server/constants/URL';
import Post from '@/components/galleria/Post';

const Slices = () => {
  const [posts, setPosts] = useState([]);
  const screenheight = Dimensions.get('window').height;

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false); // Add this state
  const [noPostsFound, setNoPostsFound] = useState(false); // Add this state
  const [focusedIndex, setFocusedIndex] = useState(null);
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { success: successCreate } = postCommentCreate;

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
      const response = await axios.get(`${API_URL}/api/posts/slices/?name=${searchText}&page=${page}`, config);
      if (response.data.results && response.data.results.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
        setTotalPages(response.data.total_pages);
        setNoPostsFound(false); // Reset noPostsFound state
      } else {
        setNoPostsFound(true); // Set noPostsFound state to true
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Start the refreshing animation
    setPage(1); // Reset page to 1 before fetching new data
    setPosts([]); // Clear current posts to avoid duplicates

    await fetchData();

    setRefreshing(false); // Stop the refreshing animation
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderItem = ({ item }) => (
    <View>
      <Post
        date={formatTimestamp(item.created_date)}
        user={item.user}
        caption={item.caption}
        description={item.description}
        total_likes={item.total_likes}
        total_bookmarks={item.total_bookmarks}
        total_comments={successCreate ? item.total_comments + 1 : item.total_comments}
        avi={item.user_avi}
        name={item.user_name}
        id={item.id}
        likers={item.likers}
        bookers={item.bookers}
        comments={item.comments}
        currentUserEmail={userInfo?.email}
        poster={item}
      />
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

    <View style={styles.screen}>
      {noPostsFound && (
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={refreshing} // Add this prop
        ListFooterComponent={
          loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="red" />
            </View>
          )
        }       />
      <Snackbar
        visible={noPostsFound}
        duration={3000}
        style={{ backgroundColor: 'red' }}
      >
        No posts found
      </Snackbar>
    </View>

}
    </View>
  );
};

export default Slices;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black'
  },
  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    zIndex: 1, // Ensure the button is above the FlatList
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, // Add some space between buttons
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height, // Ensure the loader container is full height
  },
});
