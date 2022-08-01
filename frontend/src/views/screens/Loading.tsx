import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect } from "react"
import { View, Text, SafeAreaView, StatusBar } from "react-native"
import { useDispatch } from "react-redux"
import COLORS from "../../conts/colors"
import { getAllCard } from "../../redux/card/thunks"
import { getMyInfo } from "../../redux/userInfo/thunks"
import Footer from "../components/Footer"

const Loading = (props: any) => {
    console.log("running loading page...")
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => {
            checkUserLogInStatus()
        }, 1000)
    }, [])

    const checkUserLogInStatus = async () => {
        try {
            let values = await AsyncStorage.multiGet(['@email', '@isLoggedIn',])
            let emailByLocalStorage = values[0][1]
            let isLoggedInByLocalStorage = values[1][1]
            // console.log("HOme:" + isLoggedInByLocalStorage)
            // console.log("HOme:" + emailByLocalStorage)
            if (emailByLocalStorage && isLoggedInByLocalStorage) {

                const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'loginByEmail', {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ email: emailByLocalStorage, isLoggedIn: isLoggedInByLocalStorage })
                })
                const data = await res.json()

                if(res.ok) {
                    console.log("login by email success")
                    props.navigation.navigate("Footer", { screen: 'Home' })
                    return
                } 

                // await dispatch(getMyInfo({ email: emailByLocalStorage, isLoggedIn: isLoggedInByLocalStorage })).unwrap()
                // await dispatch(getAllCard()).unwrap()
                console.log("login by email error - ", data.error)
                props.navigation.navigate("Footer", { screen: 'Home' })
                return
            }
            props.navigation.navigate("LoginMain")

        } catch (e) {
            console.log(e)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <View style={{ backgroundColor: COLORS.white, flex: 1 }}>

            </View>
        </SafeAreaView>
    )
}

export default Loading