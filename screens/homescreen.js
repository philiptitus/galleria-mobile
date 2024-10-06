import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Text, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native'; // Import useIsFocused hook
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import API_URL from '../server/constants/URL';
import Post from '../components/galleria/Post';
import { logout } from "@/server/actions/userAction";
import { setFetchPostsToFalse } from '@/server/actions/notificationActions';
import { Ionicons } from '@expo/vector-icons';

const Homescreen = () => {
  const postDelete = useSelector((state) => state.postDelete);
  const { success, error: errorDelete } = postDelete;
  const fetchPosts = useSelector((state) => state.fetchPostsState.fetchPosts);

  const screenheight = Dimensions.get('window').height;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const followUserState = useSelector((state) => state.userFollow) || {};
  const { error: errorFollow, success: successFollow } = followUserState;
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  
  const dispatch = useDispatch();
  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { success: successCreate } = postCommentCreate;
  const [navigated, setNavigated] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!userInfo && !navigatedRef.current) {
      const interval = setInterval(() => {
        if (!navigatedRef.current) {
          logoutHandler();
          navigatedRef.current = true;
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
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
    const response = await axios.get(`${API_URL}/api/posts/?name=${searchText}&page=${page}`, config);
    setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
    setTotalPages(response.data.total_pages);
  }
  catch (error) {

    console.error('Error fetching posts:', error);
  } finally {
    setLoading(false);
  }  };



  

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused');
      if (userInfo) {
        fetchData();
        console.log(userInfo)
      }
      return () => {
        console.log('Screen unfocused');
      };
    }, [userInfo, navigation])
  );

  useEffect(() => {
    if (userInfo) {
      // fetchData();
    }
    if (success) {
      handleRefresh();
    }
  }, [userInfo, page, successFollow, success]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    fetchData()
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setPosts([]);

    await fetchData();

    setRefreshing(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 50 }}>
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
      <View style={{ backgroundColor: "black", minHeight: screenheight }}>
        {!userInfo ? (
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.button}
            >
              <Text style={{ color: "white" }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.screen}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text onPress={handleRefresh} style={styles.heading}>
                My Feed
              </Text>
              <Ionicons name="book-sharp" size={24} color="red" style={{ marginLeft: 8 }} />
            </View>
            {loading && posts.length === 0 ? (
              <ActivityIndicator color='red' />
            ) : posts.length === 0 ? (
              <View style={styles.noPostsContainer}>
                <Text style={styles.noPostsText}>
                  It seems you are not following anyone yet or the person you follow hasn't posted anything.
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
                  <Text style={styles.buttonText}>Search for People to Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Galleria')}>
                  <Text style={styles.buttonText}>Browse Some Suggested Posts</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <FlatList
                  data={posts}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={renderFooter}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  contentContainerStyle={styles.contentContainer}
                />
                {/* Positioning the "Load More" button outside of the FlatList */}
                <View style={styles.loadMoreContainer}>
                  <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                    <Ionicons name="arrow-down-circle-outline" size={32} color="red" />
                    <Text style={styles.loadMoreText}>Load More</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
  },
  heading: {
    color: "red",
    fontSize: 20,
    marginBottom: 10,
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  loadMoreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'black',
  },
  loadMoreText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },
  loadMoreContainer: {
    backgroundColor: 'black',
    paddingBottom: 10,
  },
});
