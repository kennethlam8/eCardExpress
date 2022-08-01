import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar, Platform, TouchableOpacity, BackHandler } from 'react-native';

const LoginMain = (props: any) => {

    const backAction = () => {
        BackHandler.exitApp()
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={'dark-content'} backgroundColor="white" />
            <View style={styles.container}>
                {/* <Text style={styles.slogan}>Start Using</Text> */}
                <Image source={require('../../assets/img/brand-logo/eCardExpressLogo01.png')} style={styles.logo} />
                <Text style={styles.signup}>Sign up or Login</Text>
                <TouchableOpacity style={styles.button} >
                    <Image source={require('../../assets/img/brand-logo/google-logo.png')} style={styles.googleLogo} />
                    <Text style={styles.buttonText}>Continue With Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    onPress={() => { props.navigation.navigate("CardCreate") }}>
                    <Image source={require('../../assets/img/brand-logo/facebook-logo.png')} style={styles.facebookLogo} />
                    <Text style={styles.buttonText}>Continue With Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { props.navigation.navigate("LoginStep2") }}>
                    <Image source={require('../../assets/img/brand-logo/eCardExpressLogo02.png')} style={styles.facebookLogo} />
                    <Text style={styles.buttonText}>Continue With eCardExpress</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    slogan: {
        fontSize: 35,
        color: 'black',
    },
    logo: {
        width: 250,
        height: 250,
        alignContent: 'center',
        marginBottom: 24,
    },
    signup: {
        fontSize: 16,
        color: 'black',
        marginBottom: 16,
    },
    button: {
        width: "70%",
        height: 40,
        backgroundColor: "white",
        marginBottom: 16,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 5,
        flexDirection: "row",
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    buttonText: {
        fontSize: 14,
    },
    googleLogo: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        marginLeft: 7,
        marginRight: 20,
    },
    facebookLogo: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        marginLeft: 2,
        marginRight: 16,
    },
    ecardogo: {
        width: 16,
        height: 16,
        marginLeft: 2,
        resizeMode: 'contain',
    },
});

export default LoginMain;