import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { MyDrawer } from '../../navigation/drawer';
import { Provider } from 'react-redux';
import {store, persistor} from '../../server/store'
import { PersistGate } from 'redux-persist/integration/react';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

      <PaperProvider>

      <MyDrawer/>

      </PaperProvider>
      </PersistGate>

        </Provider>

  );
}


