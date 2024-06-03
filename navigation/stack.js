import { createStackNavigator } from '@react-navigation/stack';
import Homescreen from '@/screens/homescreen';
import { navOptions } from '@/navigation/options';

import { useNavigation } from '@react-navigation/native';

import { HomeTabs } from '@/navigation/tabs';

import LoginScreen from '@/screens/galleria/Login';
import RegisterScreen from '@/screens/galleria/Register';
import ForgotPassword from '@/screens/galleria/ForgotPassword';
import Settings from '@/screens/galleria/Settings';

import SearchScreen from '@/screens/galleria/Search';
import ProfileOthers from '@/screens/galleria/ProfileOthers';
import UserChatScreen from '@/screens/galleria/UserChatScreen';

import Likes from '@/components/galleria/Likes';

import Bookmarks from '@/components/galleria/PostBookmarks';
import Comments from '@/components/galleria/PostComments';
import PostScreen from '@/screens/galleria/PostScreen';
import OtpScreen from '@/screens/galleria/OtpScreen';
import NewPost from '@/screens/galleria/NewPost';
import FollowerList from '@/components/galleria/Follower';
import FollowingList from '@/components/galleria/Following';
import AlbumScreen from '@/screens/galleria/Album';
import Comment from '@/components/galleria/Comments';
import Requests from '@/components/galleria/Requests';

import BookmarksScreen from '@/screens/galleria/BookmarksScreen';
import LikesScreen from '@/screens/galleria/LikesScreen';

import Simple from '@/screens/galleria/TutorialScreen';


const Stack = createStackNavigator();



export const HomeStack = () => {
   const navigation = useNavigation()
  return (
    <Stack.Navigator
    
    screenOptions={() => navOptions(navigation)}
    >
      

      <Stack.Screen name="Galleria"  component={HomeTabs} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Password Reset" component={ForgotPassword} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Other" component={ProfileOthers} />
      <Stack.Screen name="Chat" component={UserChatScreen} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="tutorial" component={Simple} />


      <Stack.Screen name="Bookmarks" component={Bookmarks} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="Comment" component={Comment} />


      <Stack.Screen name="Post" component={PostScreen} />


      <Stack.Screen name="Verify" component={OtpScreen} />
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="NewPost" component={NewPost} />


      <Stack.Screen name="Followers" component={FollowerList} />
      <Stack.Screen name="Following" component={FollowingList} />


      <Stack.Screen name="Albums" component={AlbumScreen} />
      <Stack.Screen name="Like" component={LikesScreen} />
      <Stack.Screen name="Bookmark" component={BookmarksScreen} />

      <Stack.Screen name="Requests"  component={Requests} />


 </Stack.Navigator>
  );
}


export const ProfileStack = () => {
  const navigation = useNavigation()
 return (
   <Stack.Navigator
   
   screenOptions={() => navOptions(navigation)}
   >

</Stack.Navigator>
 );
}


export const LoginStack = () => {
  const navigation = useNavigation()
 return (
   <Stack.Navigator
   
   screenOptions={() => navOptions(navigation)}
   >
     
     <Stack.Screen name="Login" component={LoginScreen} />
     <Stack.Screen name="Register" component={RegisterScreen} />

</Stack.Navigator>
 );
}