import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import API_URL from '@/server/constants/URL';



const Galleria = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false); // Add this state

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
        const response = await axios.get(`${API_URL}/api/posts/gallery/?name=${searchText}&page=${page}`);
        setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
        setTotalPages(response.data.total_pages);
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
  


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Post', { postId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemText}>
        <Text style={styles.subtitle}>@{item.user_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{backgroundColor:"black", minHeight: 1000}}>
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

    <View style={styles.container}>
      <Text style={styles.header}>eXplore</Text>
      <Text style={styles.subheader}>Find new people to follow from these posts</Text>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        onRefresh={handleRefresh}
        refreshing={refreshing} // Add this prop
        columnWrapperStyle={styles.row}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="red" />}
      />
    </View>

          }
    </View>
  );
};

export default Galleria;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'red',
  },
  subheader: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  itemContainer: {
    flex: 1,
    margin: 1,
  },
  image: {
    width: Dimensions.get('window').width / 3 - 10,
    height: Dimensions.get('window').width / 3 - 10,
    borderRadius: 10,
  },
  itemText: {
    alignItems: 'center',
    color:"white",
  },
  title: {
    fontSize: 6,
    fontWeight: 'bold',
    color:"red",
  },
  subtitle: {
    fontSize: 8,
    color: 'red',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, // Add some space between buttons
  },
});
