import React, { useLayoutEffect, useState } from "react"
import CameraRoll from "@react-native-community/cameraroll";
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../conts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard'
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/state";

const QrcodeShow = (props: any) => {

    const { cardId } = useSelector((state: IRootState) => state.userInfo);
    let svg = ""

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Pressable style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 32,
                }} onPress={() => saveQrToDisk()}>
                    <Text style={{
                        fontSize: 18,
                        lineHeight: 21,
                        fontWeight: 'bold',
                        color: COLORS.white,
                    }}>Save as image</Text>
                </Pressable>
            ),
        });
    }, [props.navigation]);

    const saveQrToDisk = () => {
        svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath + `/ecardexpress_${cardId}.png`, data, 'base64')
                .then((success) => {
                    return CameraRoll.save(RNFS.CachesDirectoryPath + `/ecardexpress_${cardId}.png`)
                })
                .then(() => {
                    //this.setState({ busy: false, imageSaved: true })
                    Toast.show({
                        type: 'success',
                        text1: 'Saved to gallery',
                        topOffset: 5,
                        visibilityTime: 2000, //default 4000  
                        autoHide: true
                    });
                })
        })
    }

    const copyToClipboard = () => {
        Clipboard.setString(cardId);
        Toast.show({
            type: 'success',
            text1: 'Copied to clipboard!'+ cardId,
            topOffset: 5,
            visibilityTime: 1000, //default 4000  
            autoHide: true
        });
        console.log("clicked to clipboard")
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={styles.title}>Your personal code:</Text>
            </View>
            <View style={styles.upperPart}>
                <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                    <Text style={styles.buttonText}>{cardId}</Text>
                    <FontAwesomeIcon icon={faClipboard} style={{ color: COLORS.light, marginHorizontal: 25 }} size={30} />
                </TouchableOpacity>

                <View style={styles.lowerPart}>
                    <View style={{marginVertical:50}}>
                    <QRCode
                        value={`cardId=${cardId}`}
                        size={200}
                        getRef={(c=>svg=c)}
                    />
                    </View>
                </View>
            </View>


        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    title: {
        fontSize: 30,
        marginLeft: 10,
        alignContent: 'center'
    },
    upperPart: {
        alignItems: 'center',
        justifyItems: 'center',
        display: "flex",
    },
    lowerPart: {
        width: "80%",
        alignItems: 'center',
        justifyItems: 'center',
        display: "flex",
        height: 300,
        backgroundColor: COLORS.white
    },
    button: {
        width: "80%",
        height: 70,
        backgroundColor: "white",
        marginVertical: 16,
        display: "flex",
        justifyContent: 'center',
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
        fontSize: 30,
        marginLeft: 20,
        // marginRight: 20,
    },
})

export default QrcodeShow