import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '@/server/actions/userAction';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API_URL from '@/server/constants/URL'
import { useRoute } from '@react-navigation/native';


const FollowingList = ({ avatar, userId }) => {
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const dispatch = useDispatch();
  const route = useRoute();
  const screenheight = Dimensions.get('window').height;

  const { uId } = route.params;
const navigation = useNavigation()
  useEffect(() => {
    dispatch(getUserDetails(uId));
  }, [dispatch, userId]);

  const dynamicData = user && user.following.map((following) => ({
    id: following.custom_id,
    text: following.following_name,
    imageUrl: following.following_avi,
  }));

  const renderRow = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
  {/* <TouchableOpacity onPress={() => navigation.navigate('Other', { userId: item.id })} style={{ marginRight: 10 }}> */}
     
  <Image
      source={{ uri: API_URL + item.imageUrl }}
      style={{ width: 50, height: 50, borderRadius: 25 }}
    />
      {/* </TouchableOpacity> */}
      <Text style={{ color: 'white' }}>{item.text}</Text>
    </View>
  );

  return (
    <View style={{backgroundColor:"black", minHeight:screenheight}}>

      {dynamicData && dynamicData.length === 0 ? (
        <Text style={{ color: 'red' }}>No users found</Text>
      ) : (
        <FlatList
          data={dynamicData}
          renderItem={renderRow}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default FollowingList;
