import { useNavigation, useRoute } from "@react-navigation/native"
import { useLayoutEffect } from "react"
import {View, Text, StyleSheet} from "react-native"
import {HeaderBackButton} from '@react-navigation/elements'


const ProfileDetail = () => {
  const route = useRoute()

const navigation = useNavigation()

useLayoutEffect (() => {
  navigation.setOptions({
     headerLeft : () => (
      <HeaderBackButton
      tintColor="red"
      onPress={() => navigation.goBack()}
      />
    )
  })
}, [])

  const {profileId} = route.params
  return (
    <View style={styles.screen}>
        <Text>Profile Id:   {profileId}</Text>


    </View>
  )
}

export default ProfileDetail


const styles = StyleSheet.create({
    screen : {

      padding : 20
    }
  })