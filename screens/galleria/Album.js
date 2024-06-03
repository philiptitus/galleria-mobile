import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Text, TouchableOpacity } from "react-native";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { logout } from "@/server/actions/userAction";
import { setFetchPostsToFalse } from '@/server/actions/notificationActions';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { createPost } from '@/server/actions/postActions';

import API_URL from "@/server/constants/URL";
import Post from "@/components/galleria/Post";



const AlbumScreen = () => {


  const fetchPosts = useSelector((state) => state.fetchPostsState.fetchPosts);

  // useEffect(() => {
  //   if (fetchPosts) {
  //     dispatch(setFetchPostsToFalse());

      
  //   }
  //   // Dispatch the action to set fetchPosts to false
  // }, [dispatch, fetchPosts]);

  // useEffect(() => {
  //   let intervalId;

  //   if (fetchPosts) {
  //     // Start the interval only if fetchPosts is true
  //     intervalId = setInterval(() => {
  //       // Dispatch the action to set fetchPosts to false every second
  //       dispatch(setFetchPostsToFalse());
  //     }, 1000);
  //   }

  //   // Clean up function to clear the interval when fetchPosts becomes false
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [fetchPosts, dispatch]);




  const route = useRoute();
  const { id } = route.params;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false); // Add this state
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const followUserState = useSelector((state) => state.userFollow) || {};
  const {
    error: errorFollow,
    success: successFollow,
  } = followUserState;
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { success: successCreate } = postCommentCreate;
  const [navigated, setNavigated] = useState(false);
  const navigatedRef = useRef(false);

  const hasNavigated = useRef(false);
  const intervalRef = useRef(null);
  // useEffect(() => {
  //   if (!userInfo) {
  //     intervalRef.current = setInterval(() => {
  //       if (!userInfo) {
  //         navigation.navigate('Login');
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //     }, 1000); // Check every second
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [userInfo, navigation]);

  const submiterHandler = () => {
    dispatch(createPost())

  };

  const postDelete = useSelector((state) => state.postDelete);
  const { success, error:errorDelete } = postDelete;

  const postCreate = useSelector((state) => state.postCreate);
  const { success: successPost, loading:loadingPost, error:errorPost, post } = postCreate;

  useEffect(() => {
    if (successPost) {
      navigation.navigate('NewPost', { newId: post.id })
    }
  }, [successPost, navigation]);

  useEffect(() => {
    if (!userInfo && !navigatedRef.current) {    
        const interval = setInterval(() => {
          if (!navigatedRef.current) {
            logoutHandler();
            navigatedRef.current = true;
            clearInterval(interval); // Clear the interval immediately after navigation
          }
        }, 1000);

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [userInfo, navigation]);


  const fetchData = async () => {
    try{
      setLoading(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
 
      const response = await axios.get(`${API_URL}/api/posts/${id}/album/?name=${searchText}&page=${page}`, config);
      setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
      console.log("Fetching albbbbbbbbummmmmm")

      setTotalPages(response.data.total_pages);
    }
    catch (error) {

      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchData();

    }
    if (success) {
      handleRefresh() 
     }
  }, [ userInfo, page, successFollow, success]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (posts.length === 0) {
  //       fetchData();
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [posts]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    fetchData()
  };

  const logoutHandler = () => {
    dispatch(logout()); // Dispatch the logout action
    navigation.navigate('Login'); 
    console.log("Pressssssssssss")
    // Navigate to the login screen
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


  const renderFooter = () => {
    if (loading) return <ActivityIndicator color="red" />;
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
        {loading ?
      <ActivityIndicator color="red" />  :

      <View>


      <Ionicons name="arrow-down-circle-outline" size={32} color="red" />

      </View>

      }

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text  onPress={handleRefresh} style={{ fontSize: 20, fontWeight: 'bold', color: 'purple' }}>Album </Text>
    <Ionicons name="book-sharp" size={24} color="purple" style={{ marginLeft: 8 }} />
  </View>


      {loading && posts.length == 0 ? (

<ActivityIndicator color='red' />
      ) : posts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>
           Nothing new..
          </Text>
          <TouchableOpacity style={styles.button} onPress={submiterHandler}>
          {loadingPost ? (
        <ActivityIndicator size="large" color="purple" />
      ) : (

            <Text style={styles.buttonText}>Make Your Own Post</Text>
          )}

          </TouchableOpacity>

        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "black"
  },
  heading: {
    color: "red",
    fontSize: 20,
    marginBottom: 10, // Add some margin for better spacing
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPostsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20, // Add some space between text and buttons
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, // Add some space between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loadMoreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'black',
  },
});
