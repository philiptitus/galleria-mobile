import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { HomeStack } from "./navigation/stack";
import { MyDrawer } from './navigation/drawer';
export default function App() {
  return (
    <NavigationContainer>
        <MyDrawer/>
    </NavigationContainer>

  );
}


