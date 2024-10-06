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
import API_URL from "@/server/constants/URL";
import Post from "@/components/galleria/Post";

const BookmarksScreen = () => {
  const route = useRoute();
  const { id } = route.params || {}; // Default to an empty object if route.params is undefined
  const fetchPosts = useSelector((state) => state.fetchPostsState.fetchPosts);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false); // Add this state
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const followUserState = useSelector((state) => state.userFollow) || {};
  const { error: errorFollow, success: successFollow } = followUserState;
  const userLogin = useSelector(state => state.userLogin || {});
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { success: successCreate } = postCommentCreate;
  const navigatedRef = useRef(false);

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
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/api/posts/bookmarks/?name=${searchText}&page=${page}`, config);
      if (response.data && response.data.results) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
        setTotalPages(response.data.total_pages);
      } else {
        setPosts([]); // Default to an empty array if response data is not as expected
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchData();
    }
  }, [userInfo, page, successFollow]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    fetchData()

  };

  const logoutHandler = () => {
    dispatch(logout()); // Dispatch the logout action
    navigation.navigate('Login');
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
        <Text onPress={handleRefresh} style={{ fontSize: 20, fontWeight: 'bold', color: 'blue' }}>My Bookmarked Posts </Text>
        <Ionicons name="bookmark-sharp" size={24} color="blue" style={{ marginLeft: 8 }} />
      </View>

      {loading && posts.length == 0 ? (
        <ActivityIndicator color='red' />
      ) : posts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>
            It seems you have not saved any Post yet.
          </Text>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Galleria')}>
            <Text style={styles.buttonText}>Browse Some Suggested Posts</Text>
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

export default BookmarksScreen;

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
