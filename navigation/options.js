import { Ionicons } from "@expo/vector-icons"
import { View, Text } from "react-native"

export const navOptions = (nav) => {
    return {
        headerTintColor: "red",
        headerStyle: { 
            backgroundColor : "black",
            // Add headerTitleStyle for customizing the font
            headerTitleStyle: {
                fontFamily: "Roboto", // Change to your preferred elegant font
                fontSize: 24, // Adjust font size as needed
            }
        }, 
        headerLeft: () => (
            <View>
<Ionicons
                name="camera-outline"
                size={32}
                color="red" // Change color to white to match headerTintColor
                style={{ marginLeft: 20 }} // Apply left margin directly to Ionicons component
                onPress={() => nav.toggleDrawer()}
            />
            </View>
            
        ),
        // headerRight: () => (
        //     <Text
        //         style={{
        //             paddingLeft: 20,
        //             fontFamily: "Roboto", // Change to your preferred elegant font
        //             fontSize: 24, // Adjust font size as needed
        //             color: "white" // Change color to white to match headerTintColor
        //         }}
        //     >
        //         logo
        //     </Text>
        // )
    }
}
