import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerItemList, createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { Linking, SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from "@/server/actions/userAction";
import { useNavigation } from '@react-navigation/native';
import { HomeStack } from '@/navigation/stack'
import { createPost } from "@/server/actions/postActions";
import { POST_CREATE_RESET } from "@/server/constants/postConstants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '@/server/constants/URL';
import Test from '@/screens/galleria/Test'
import Chat from '@/screens/galleria/Chat'
import NewPost from '@/screens/galleria/NewPost'







const Drawer = createDrawerNavigator();

export const MyDrawer = () => {
  const navigation = useNavigation(); // Get the navigation object
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const postCreate = useSelector((state) => state.postCreate);
  const { success, loading, error, post } = postCreate;
  const [navigated, setNavigated] = useState(false);


  
  const userDetails = useSelector((state) => state.userDetails);
  const {  user } = userDetails;
  const navigatedRef = useRef(false);

  const logoutHandler = () => {
    dispatch(logout()); // Dispatch the logout action
    navigation.navigate('Login'); 
    console.log("Pressssssssssss")
    // Navigate to the login screen
  };





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

  return (
    <Drawer.Navigator 
      drawerContent={(props) => {
        return (
          <SafeAreaView
            style={{
              marginTop: "30px",
              flex: 1,
              backgroundColor:"#A91D3A",
              color:"red"
            }}
          >
            
            <View style={{ flex: 1 }}>
              <TouchableOpacity  onPress={() => navigation.navigate('Profile')}>

              <Image 
                source={{ uri: `${API_URL}${userInfo?.avi}` }} 
                style={{ width: 150, height: 150, borderRadius: 75, margin: 30, marginLeft: 70 }}
                />
                              </TouchableOpacity>

              <Text>{'\n'}</Text>
              <DrawerItemList {...props}/>
            </View>

            <DrawerItem
              name="Logout" 
              label="Logout"
              onPress={logoutHandler} // Add onPress event handler for logout
              icon={() => <MaterialCommunityIcons name='logout' size={22}/>}
            />
            <DrawerItem
              label="About"
              onPress={() => Linking.openURL('https://mrphilip.pythonanywhere.com/portfolio/galleria')}
              icon={() => (
                <Ionicons name='information' size={22}/>
              )}
            />
            <DrawerItem
              label=""
              onPress={() => {}}
              icon={() => (
                <Text style={{ fontSize: 10, color:"blue" }}>© Philip Titus 2024 All Rights Reserved</Text>
              )}
            />
          </SafeAreaView>
        );
      }}
      screenOptions={{ headerShown: false }}
      // Disable swipe gesture to open the drawer
      gestureEnabled={false} 
    >
      <Drawer.Screen 
        name="HomeStack" 
        component={HomeStack} 
        options={{
          title: "My Feed",
          drawerIcon: () => <Ionicons name='home' size={22}/>
        }}
      />
      <Drawer.Screen 
        name="ChatStack" 
        component={Chat} 
        options={{
          title: "Chat",
          drawerIcon: () => <MaterialCommunityIcons name='message' size={22}/>
        }}
      />
      <Drawer.Screen 
        name="NotificationStack" 
        component={Test} 
        options={{
          title: "Notifications",
          drawerIcon: () => <MaterialCommunityIcons name='heart' size={22}/>
        }}
      />
    </Drawer.Navigator>
  );
}
