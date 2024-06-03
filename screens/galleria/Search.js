import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import API_URL from '@/server/constants/URL';
import { Image } from 'react-native';



const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
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
      const response = await axios.get(`${API_URL}/api/users/?name=${searchText}&page=${page}`, config);
      const searchedUsers = response.data.results.reverse();
      setData(searchedUsers);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setError('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Other', { userId: item.id })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <View style={{ marginRight: 10 }}>
        <Image 
  source={{ uri: API_URL + item.avi }} 
  style={{ width: 50, height: 50, borderRadius: 25 }} 
/>
        </View>
        <Text style={{ color: 'white' }}>{item.name}</Text>
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

    <View style={{ flex: 1, backgroundColor: 'black', padding: 10 }}>
      <TextInput
        placeholder='Search Someone Here'
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
      />
      {data.length === 0 && <Text style={{ color: 'white' }}>Nothing Found</Text>}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator color='red' />}
      />
    </View>
}

</View>


  );
};

export default SearchScreen;


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
});