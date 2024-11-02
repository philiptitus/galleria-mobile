import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { MyDrawer } from '../../navigation/drawer';
import { Provider } from 'react-redux';
import { store, persistor } from '../../server/store';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Alert, Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Updates from 'expo-updates'; // Import expo-updates for OTA updates
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTokenToBackend } from '@/server/actions/notificationActions';
// import { sendTokenToBackend } from '../../server/actions/postActions';

// Function to register for push notifications and get the token
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notifications!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: ""
    })).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Function to check for and apply updates
async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Notify user and reload the app
      Alert.alert('Update available', 'Restart the app to apply the update.', [
        { text: 'Restart now', onPress: () => Updates.reloadAsync() }
      ]);
    }
  } catch (e) {
    // Handle errors
    console.log(e);
  }
}

// New component to handle push notification setup
const PushNotificationSetup = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user); // Adjust this selector based on your Redux state structure

  useEffect(() => {
    async function setupPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await dispatch(sendTokenToBackend(token, userInfo));
        console.log(token)
        console.log("Called from index.tsx")
      }
    }
    setupPushNotifications();

    // Handle notification received while the app is in the foreground
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);

      // Manually present the notification if the app is in the foreground
      if (Platform.OS === 'android') {
        Notifications.presentNotificationAsync(notification.request.content);
      }
    });

    // Cleanup the listener on unmount
    return () => subscription.remove();
  }, [dispatch, userInfo]);

  return null;
}

export default function App() {
  useEffect(() => {
    checkForUpdates(); // Check for updates when the app loads
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <PushNotificationSetup />
          <MyDrawer />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
