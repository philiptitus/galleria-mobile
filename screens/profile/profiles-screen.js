import {View, Text, StyleSheet, Button} from "react-native"
import {useNavigation } from '@react-navigation/native'


const Profilescreen = () => {
  const navigation = useNavigation()
  return (
    <View >
        <Text>Profile Screen</Text>
        <Button title="Some Profile" onPress={() => navigation.navigate('Profile', {profileId: 1})} />
 </View>
  )
}

export default Profilescreen


const styles = StyleSheet.create({
    screen : {

      padding : 20
    }
  })