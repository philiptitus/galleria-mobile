import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import API_URL from '@/server/constants/URL'
import { useRoute } from '@react-navigation/native';
import { getUserDetails } from '@/server/actions/userAction';



const FollowerList = ({ avatar, userId }) => {
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const dispatch = useDispatch();
  const route = useRoute();
  const { uId } = route.params;
  const screenheight = Dimensions.get('window').height;


  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getUserDetails(uId));
  }, [dispatch]);

  const dynamicData = user && user.followers.map((follower) => ({
    id: follower.custom_id,
    text: follower.follower_name,
    imageUrl: follower.follower_avi,
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

export default FollowerList;
