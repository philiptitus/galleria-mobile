import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { MyDrawer } from '../../navigation/drawer';
import { Provider } from 'react-redux';
import store from '../../server/store'
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
export default function App() {
  return (
    <Provider store={store}>

      <PaperProvider>

      <MyDrawer/>

      </PaperProvider>

        </Provider>

  );
}


