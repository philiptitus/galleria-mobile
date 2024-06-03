import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Image } from 'react-native';

import Homescreen from '@/screens/homescreen';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDispatch, useSelector } from 'react-redux';
import MyProfileScreen from '@/screens/galleria/Profile'; // Updated to use @ alias
import SearchScreen from '@/screens/galleria/Search';
import Galleria from '@/screens/galleria/Galleria';
import Slices from '@/screens/galleria/Slices';
import { getUserDetails } from '@/server/actions/userAction';
import API_URL from '@/server/constants/URL';


const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  const colorScheme = useColorScheme();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, userInfo]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'black',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTabs') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            if (user?.avi) {
              return (
                <Image
                  source={{ uri: `${API_URL}${userInfo?.avi}` }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                />
              );
            } else {
              iconName = focused ? 'person' : 'person-outline';
            }
          } else if (route.name === 'Galleria') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Slices') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          }

          return <Ionicons name={iconName} size={focused ? 35 : size} color='red' />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTabs"
        options={{ title: 'Home' }}
        component={Homescreen}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
      />
      <Tab.Screen
        name="Galleria"
        options={{ title: 'Galleria' }}
        component={Galleria}
      />
      <Tab.Screen
        name="Slices"
        options={{ title: 'Slices - Video Posts' }}
        component={Slices}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: 'My Profile' }}
        component={MyProfileScreen}
      />
    </Tab.Navigator>
  );
};
