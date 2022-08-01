import React from "react"
import { View, Text, Button } from "react-native"
import Footer from "../components/Footer"

const MeWithoutFooter = (props: any) => {
    return (
        <View>
            <Text>Me Without Footer!!!</Text>
            <Button
                title="Go to without footer"
                onPress={() => {
                    props.navigation.navigate("Footer")
                }}
            />
        </View>
    )
}

export default MeWithoutFooter