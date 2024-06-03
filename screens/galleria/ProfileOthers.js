import React, { useEffect, useState } from 'react';
import { View,  TextInput, TouchableOpacity, StyleSheet, ImageBackground ,useColorScheme, ScrollView, RefreshControl, Animated, Dimensions} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/server/actions/userAction';
import {ActivityIndicator} from 'react-native';
import { Image } from 'react-native';
import { Text } from 'react-native';
import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper

// import { useSnackbar } from 'notistack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { RadioGroup, RadioButton } from 'react-native-paper';
import FileUpload from '../../components/galleria/FileUpload'
import { useRoute } from '@react-navigation/native';
import { useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getUserDetails , followUser} from '@/server/actions/userAction';
import { USER_UPDATE_PROFILE_RESET } from '@/server/constants/userConstants';
import API_URL from '@/server/constants/URL';
import FollowerList from '@/components/galleria/Follower';
import FollowingList from '../../components/galleria/Following'
import MobileTab from '@/components/galleria/MobileTab';

import { Modal, Portal , PaperProvider } from 'react-native-paper';
import { HomeTabs } from '@/navigation/tabs';



const FloatingButton = ({  }) => {
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
    }, 3000);

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
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 25,
          elevation: 5,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Follows You </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};




const ProfileOthers = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [isCurrentUserFollower, setIsCurrentUserFollower] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isCurrentUserFollowed, setIsCurrentUserFollowed] = useState(false);


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;
  const [follower, setFollower] = useState(true);
  const isFocused = useIsFocused();
  const screenheight = Dimensions.get('window').height;

  const followUserState = useSelector((state) => state.userFollow) || {};
  const {
    error: errorFollow,
    success: successFollow,
  } = followUserState;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const colorScheme = useColorScheme();
  const route = useRoute();
  const { userId } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const followers = user?.followers
  const following = user?.following



  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');




  // useEffect(() => {
  //   if (!userInfo) {
  //     const intervalId = setInterval(() => {
  //       navigation.navigate('Login');
  //     }, 500); // Reduced interval time to 500 milliseconds
  
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userInfo, navigation]);



  

  // const handleIsPrivateChange = (value) => {
  //   setIsPrivate(value === 'private');
  // };
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

 

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails(userId));

    }
  }, [dispatch, userInfo]);



  const refreshHandler = async () => {
    setRefreshing(true);
    await dispatch(getUserDetails(userId));
    setRefreshing(false);
  };
  

  
  
  useEffect(() => {
    if (Array.isArray(followers)) {
      setIsCurrentUserFollower(followers.some(follower => follower.follower_name === userInfo.email));
    } else {
      setIsCurrentUserFollower(false);
    }
    
    // Log a message when the component is loaded

  }, [userInfo, followers]);


  useEffect(() => {
    if (Array.isArray(following)) {
      setIsCurrentUserFollowed(following.some(following => following.following_name === userInfo.email));
    } else {
      setIsCurrentUserFollowed(false);
    }
    
    // Log a message when the component is loaded

  }, [userInfo, following]);
 
 
  
  const handleClick = () => {
    // Show a success snackbar when the button is clicked
      setIsChecked(!isChecked); // Toggle isChecked state
          dispatch(followUser(userId));
          {!isCurrentUserFollower && user.isPrivate && successFollow && 
            
            
          
            showSnackbar("Requested", 'success');

          }

          {!isCurrentUserFollower  && successFollow && 
            
            
          
            showSnackbar("Following", 'success');

          }

          {isCurrentUserFollower  && successFollow && 
            
            
          
            showSnackbar("Unfollowed", 'success');

          }
          
          
          
            {!isCurrentUserFollower && user.isPrivate && errorFollow &&
              
              
            
              showSnackbar("Your Request Has Already Been Sent..", 'success');

            }


  };

  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible2(true);
  };

  const onDismissSnackBar = () => setVisible2(false);

  
  return (

    <PaperProvider>
      
<View style={{backgroundColor:"black", minHeight: screenheight}}>


<View style={{backgroundColor:"black"}}>



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
        <FollowerList 
        
        userId={userId}/>
        }
        {!follower && 
                <FollowingList userId={userId}/>

        }
      </Modal>
    </Portal>
    


    {loading ? 
    <View style={[styles.container2, styles.horizontal]}>
      <ActivityIndicator size="large" color="red" />
    </View> :


<View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
    
<View style={{}}>
  
  <Image
    source={{ uri: `${API_URL}${user?.avi}` }}
    style={{ width: 100, height: 100, borderRadius: 50 }}
    onError={() => console.log('Error loading image')} // Add error handling
  />
  {isCurrentUserFollowed && 

<FloatingButton/>

}
</View>
{userInfo && (
  <View style={{ alignItems: 'center' }}>
    <Text style={{color:"white"}}>{user?.name}</Text>
    <Text style={{color:"red"}}>@{user?.email}</Text>
    {user?.isPrivate && 
    <Text style={{color:"orange"}}>PRIVATE ACCOUNT</Text>
    }
    <Text style={{color:"white"}}>Joined: {formatTimestamp(user?.date_joined)}</Text>

  </View>
)}
<View>
  <Text style={{color:"white"}}>{user?.bio}</Text>
</View>
<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <TouchableOpacity 
    style={{
      marginRight: 18
    }}
    onPress={() => navigation.navigate('Followers', { uId: user?.id })}      >

    
    
    
    
    
    <Ionicons name="people" size={24} color="red" />
    <Text style={{ color: 'white', marginLeft: 0 }}>
      Followers: {user?.total_followers}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity 
    onPress={() => navigation.navigate('Following', { uId: user?.id })}      




style={{ marginRight: 0 }}
>
<Ionicons name="people" size={24} color="red" />
<Text style={{ color: 'white', marginLeft: 0 }}>
Following: {user?.total_following}
</Text>
</TouchableOpacity>

{userInfo?.email != user?.email && 
<TouchableOpacity 

style={{
marginLeft: 18
}}
onPress={() => navigation.navigate('Chat', { receiver_id: userId })}>

<Ionicons
          name="send"
          size={24}
          color="red"
          style={{ marginVertical: 10 }}
        />
</TouchableOpacity>
}

{!isCurrentUserFollower && userInfo?.email != user?.email &&

<TouchableOpacity
style={{
marginLeft: 18
}}
onPress={handleClick}
>
{isChecked ? (
<Ionicons
name="checkmark-circle"
size={24}
color="red"
style={{ marginVertical: 10 }}
/>
) : (
<Ionicons
name="add"
size={24}
color="red"
style={{ marginVertical: 10 }}
/>
)}
</TouchableOpacity>
}
{isCurrentUserFollower && userInfo?.email != user?.email &&
<TouchableOpacity
style={{
marginLeft: 18
}}
onPress={handleClick}
>
{isChecked ? (
<Ionicons
name="add"
size={24}
color="red"
style={{ marginVertical: 10 }}
/>
) : (
<Ionicons
name="checkmark-circle"
size={24}
color="red"
style={{ marginVertical: 10 }}
/>
)}
</TouchableOpacity>
}
</View>

</View>

{isCurrentUserFollower && user?.isPrivate &&

<View>
  <MobileTab id={user?.id} showBookmark={false}
  
  

  />
</View>

}


{!user?.isPrivate &&

<View>
  <MobileTab id={user?.id} showBookmark={false}
  
  


  />
</View>

}

</View>
  }





</View>

<Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
</View>

    </PaperProvider>


  );
};

const styles = StyleSheet.create({

  text: {
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
    height:400
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    left: -40,
  },
});


export default ProfileOthers;
