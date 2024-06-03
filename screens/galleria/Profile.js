import React, { useEffect, useState,  useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground ,useColorScheme, ScrollView, RefreshControl, Dimensions} from 'react-native';
import { useNavigation, useIsFocused , useFocusEffect} from '@react-navigation/native'; // Import useIsFocused hook
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/server/actions/userAction';
import {ActivityIndicator} from 'react-native';
import { Image } from 'react-native';
// import { useSnackbar } from 'notistack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { RadioGroup, RadioButton } from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns';
import { getUserDetails } from '@/server/actions/userAction';
import { USER_UPDATE_PROFILE_RESET } from '@/server/constants/userConstants';
import API_URL from '@/server/constants/URL';
import { createPost } from '@/server/actions/postActions';
import { Modal, Portal , PaperProvider } from 'react-native-paper';
import { POST_CREATE_RESET } from '@/server/constants/postConstants';
import MobileTab from '@/components/galleria/MobileTab';
import FollowingList from '@/components/galleria/Following';
import FollowerList from '@/components/galleria/Follower';

const MyProfileScreen = () => {

  const [visible, setVisible] = React.useState(false);
  const screenheight = Dimensions.get('window').height;

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);


  const postCreate = useSelector((state) => state.postCreate);
  const { success: successPost, loading:loadingPost, error:errorPost, post } = postCreate;



  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;
  const isFocused = useIsFocused();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState('');
  const [follower, setFollower] = useState(true);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avi, setAvi] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [refreshing, setRefreshing] = useState(false);


  // useEffect(() => {
  //   if (!userInfo) {
  //     const intervalId = setInterval(() => {
  //       navigation.navigate('Login');
  //     }, 500); // Reduced interval time to 500 milliseconds
  
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userInfo, navigation]);


  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avi', file);
    formData.append('user_id', userInfo?.id);

    setAvi(URL.createObjectURL(e.target.files[0]));

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(`/api/users/upload/`, formData, config);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleIsPrivateChange = (value) => {
    setIsPrivate(value === 'private');
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const now = new Date();
    const timeDifference = formatDistanceToNow(date, { addSuffix: true });
    return timeDifference;
  };

 

  const submiterHandler = () => {
    dispatch(createPost())

  };


  useEffect(() => {
    dispatch({ type: POST_CREATE_RESET });

    // if (success) {
    //   navigate(`/new/${post.id}`);
    // }
  }, [dispatch, userInfo, post]);


  useEffect(() => {
    if (successPost) {
      navigation.navigate('NewPost', { newId: post.id })
    }
  }, [successPost, navigation]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, userInfo, navigation]);


//   useEffect(() => {
//     if (userInfo.email != user?.email) {
// refreshHandler()
//     }
//   }, [dispatch, userInfo, user]);



// useFocusEffect(
//   useCallback(() => {
//     // Your logic when the screen is focused
//     console.log('Screen focused');
//     if (userInfo?.email != user?.email) {
// refreshHandler()
//     }


//     return () => {
//       // Your logic when the screen is unfocused
//       console.log('Screen unfocused');
//       // Clear the interval

//     };
//   }, [userInfo, user])
// );


useFocusEffect(
  useCallback(() => {
    console.log('Screen focused');
    if (userInfo?.email === user?.email) {
      if (user?.is_tutorial === false) {

        navigation.navigate('tutorial');
      }
    } else {
      refreshHandler();
    }
    return () => {
      console.log('Screen unfocused');
    };
  }, [userInfo, user, navigation])
);



  // useFocusEffect(
  //   useCallback(() => {zzz
  //     // Your logic when the screen is focused
  //     console.log('Screen focused');
  //     if (userInfo.email != user.email) {
  //       refreshHandler()
  //           }  
  //     // if (fetchPosts) {
  //     //   fetchDataInterval.current = setInterval(fetchData, 1000);
  //     // }
  
  //     return () => {
  //       // Your logic when the screen is unfocused
  //       console.log('Screen unfocused');
 
  //       // Clear the interval

  //     };
  //   }, [userInfo, user])
  // );





  const refreshHandler = async () => {
    setRefreshing(true);
    await dispatch(getUserDetails('profile'));
    setRefreshing(false);
  };
  

  

  const submitHandler = (e) => {

    navigation.navigate("Settings")
  };

 

  
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

    <ScrollView
    
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
    }
    >
    <PaperProvider>

    <View style={{backgroundColor:"black", minHeight: screenheight }}>



<Portal>
      <Modal 
        style={styles.modal}
        backdropDismiss={false}
        visible={visible}
      >
        <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color="red" />
        </TouchableOpacity>
        {follower && 
        <FollowerList userId={userInfo?.id}/>
        }
        {!follower && 
                <FollowingList userId={userInfo?.id}/>

        }
      </Modal>
    </Portal>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
      {loadingPost ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        

        <TouchableOpacity onPress={submiterHandler} style={{ alignItems: 'center' }}>
          <Ionicons name="add" size={24} color="red" />
          <Text style={{ color: 'red', fontSize: 16, marginTop: 5 }}>New</Text>
        </TouchableOpacity>
      )}
    </View>
  <View>
    <Ionicons
    style={{marginRight: 20}}
      onPress={submitHandler}
      name="settings" size={24} color="red" />
  </View>
</View>


  {loading &&
    <View style={[styles.container2, styles.horizontal]}>
      <ActivityIndicator size="large" color="red" />
    </View> }
    
  <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
  <View style={{}}>
    <Image
      source={{ uri: `${API_URL}${userInfo?.avi}` }}
      style={{ width: 100, height: 100, borderRadius: 50 }}
      onError={() => console.log('Error loading image')} // Add error handling
    />
  </View>
  {userInfo && (
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.text, colorScheme === 'dark' && styles.darkText]}>{userInfo?.name}</Text>
      <Text style={[styles.text, styles.smallText, colorScheme === 'dark' && styles.darkText]}>@{userInfo?.email}</Text>

      <Text style={[styles.text, colorScheme === 'dark' && styles.darkText]}>Joined: {formatTimestamp(user?.date_joined)}</Text>

    </View>
  )}
  <View>
    <Text style={[styles.text, colorScheme === 'dark' && styles.darkText]}>{userInfo?.bio}</Text>
  </View>
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity 
      style={{
        marginRight: 50
      }}
      onPress={() => navigation.navigate('Followers', { uId: userInfo?.id })}      >
      <Ionicons name="people" size={24} color="red" />
      <Text style={{ color: 'white', marginLeft: 10 }}>
        Followers: {user?.total_followers}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={() => navigation.navigate('Following', { uId: userInfo?.id })}      

style={{ marginRight: 20 }}
>
<Ionicons name="people" size={24} color="red" />
<Text style={{ color: 'white', marginLeft: 10 }}>
  Following: {user?.total_following}
</Text>
</TouchableOpacity>

  </View>

  </View>
  <View>
    <MobileTab id={userInfo?.id} showBookmark={true}
    
    showRequests={user?.isPrivate}
    showLike={true}
    showDelete={true}


    />
  </View>

</View>




</View>
</PaperProvider>
</ScrollView>

    }
</View>
  );
};

const styles = StyleSheet.create({

  text: {
    color: '#ffffff', // Default text color
  },

  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, // Add some space between buttons
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 50,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    alignItems: 'center',
  },
  inputBox: {
    position: 'relative',
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  label: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#03a9f4',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    left: -40,
  },
});

export default MyProfileScreen;
