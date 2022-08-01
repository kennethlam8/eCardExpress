import React, { useLayoutEffect, useState } from "react"
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Pressable, Image, Button, Alert, ActivityIndicator, TextInput, ToastAndroid } from "react-native"
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import RNFS from 'react-native-fs';
import COLORS from "../../conts/colors";
import BarcodeMask from "../components/BarcodeMask";
import { useDispatch } from "react-redux";
import { setSocketUserId } from "../../redux/card/action";
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';

let cardIdSent = ""

const showToast = (status, data) => {
    console.log("showing toast")
    Toast.show({
        type: status,
        text1: data,
        topOffset: 5,
        visibilityTime: 1000,
        autoHide: true
    });
}

const progressStatus = ["scanning", "loading", "complete"]

const CELL_COUNT = 6;

const Qrcode = (props) => {
    const dispatch = useDispatch();
    const [{ cameraRef }, { takePicture }] = useCamera(null);
    const [scanResult, setScanResult] = useState(progressStatus[0]);
    const [userName, setUserName] = useState('');
    const [scanMode, setScanMode] = useState(false);
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

    const [errMsg, setErrMsg] = useState('');

    const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [cardEx, SetCardEx] = useState(true)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () =>
            (scanResult == progressStatus[0] ?
                <Pressable style={styles.headerButton} onPress={() => {
                    setScanMode(!scanMode)
                    console.log("Scan Mode: " + scanMode)
                }}>
                    <Text style={styles.headerText}>{(!scanMode ? "Manually Input" : "Scan")}</Text>
                </Pressable> : ""
            ),
        });

    }, [props.navigation, scanMode, scanResult]);

    async function sendCardRequest(cardId, props, callback) {
        cardIdSent = ""
        console.log("Sending fetch card " + cardId)
        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `cardCode/${cardId}`)
    
        let result = await res.json()
        console.log("Send request result: ", result)
    
        if (res.status.toString().startsWith("5")) {
            console.log("Internal create user error - ", result.error)
            return "Internal create user error"
        }
    
        if (res.status.toString().startsWith("4")) {
            return `"Error: ", ${result.message}`
        } else {
            //errLabel.classList.add("success")
        }
    
        if (res.ok) {
            //skChase.classList.remove("show"
            SetCardEx(true)
            callback[0](result.data[0].first_name)
            callback[1](progressStatus[2])
            cardIdSent = cardId
            /* setTimeout(() => {
                props.navigation.navigate("Footer")
            }, 1000); */
        }
    }

    const captureHandle = async () => {
        try {
            const data = await takePicture();
            console.log(data.uri);
            const filePath = data.uri;
            const newFilePath = RNFS.ExternalDirectoryPath + '/MyTest.jpg';
            RNFS.moveFile(filePath, newFilePath)
                .then(() => {
                    console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const barcodeHandle = async (data) => {
        setScanResult(progressStatus[1])
        try {
            console.log("Barcode data:", data.data);
            let cardCode = data.data.split('=')
            if (cardCode[0] == "cardId") {
                let error = await sendCardRequest(cardCode[1], props, [setUserName, setScanResult])
                if (error) {
                    throw error
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Error occurred",
                [
                    {
                        text: "Return to Home",
                        onPress: () => props.navigation.navigate("Footer"),
                        style: "cancel"
                    },
                    { text: "Re-scan", onPress: () => setScanResult(progressStatus[0]) }
                ]
            );
        }
    }

    const cardCodeFormat = [false, false, true, true, true, true]

    const codeHandle = async (input) => {
        setValue(input)
        if (input.length == CELL_COUNT) {
            if (/^[a-zA-Z0-9]+$/.test(input)) {
                input = input.toUpperCase()
                let codeInputFormat = input.split("").map((word) => {
                    return (/^[0-9]+$/.test(word))
                })
                console.log("Code pattern entered: ", codeInputFormat)

                if (codeInputFormat.sort().join(',') !== cardCodeFormat.sort().join(',')) {
                    setErrMsg('Invalid Code')
                    return
                }

                //setScanResult(progressStatus[1])
                try {
                    let error = await sendCardRequest(input, props, [setUserName, setScanResult])
                    if (error) {
                        throw error
                    }
                } catch (error) {
                    console.log(error);
                    if (error == "Internal create user error") {
                        await dispatch(setSocketUserId({ socketUserId: '' }))
                        setErrMsg('Network error. Please try again')
                    } else {
                        setErrMsg('Invalid Code')
                    }
                    setScanResult(progressStatus[0])
                }

            } else {
                setErrMsg('Invalid Code')
            }
        } else if (input.length < CELL_COUNT) {
            setErrMsg('')
        }
    }

    const allowExchange = (newValue) => {
        SetCardEx(newValue)
        if (cardIdSent)
            sendAllowCardExchange(newValue)
    }


    async function sendAllowCardExchange(newValue) {
        console.log("patch card request - " + cardIdSent)
        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'cardExchangeRequest', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                card_id: cardIdSent,
                allow_ex: newValue,
            }),
        })

        let result = await res.json()
        console.log("Send request result: ", result)

        if (res.status.toString().startsWith("5")) {
            console.log("Internal create user error - ", result.error)
            showToast('error', "Network error")
            SetCardEx(!newValue)
            return "Internal create user error"
        }

        if (res.status.toString().startsWith("4")) {
            showToast('error', "Unknown error")
            SetCardEx(!newValue)
            return `"Error: ", ${result.message}`
        }

        if (res.ok) {
            if (newValue) {
                showToast('success', "Card Exchange allowed")
            } else {
                showToast('success', "Card Exchange disallowed")
            }
        }
    }

    return (
        <SafeAreaView style={styles.body}>
            {scanResult == progressStatus[0] && !scanMode && (
                <View style={styles.container}>
                    <RNCamera
                        ref={cameraRef}
                        //type={RNCamera.Constants.Type.back}
                        style={styles.preview}
                        captureAudio={false}
                        onBarCodeRead={barcodeHandle}
                    >
                        <BarcodeMask
                            width={100} height={300} backgroundColor={COLORS.black} outerMaskOpacity={0.8}
                        />
                        {/*  <TouchableOpacity
                            onPress={() => captureHandle()}
                        >
                            <Image source={require('../../assets/img/icon/rec.png')} style={styles.captureIcon} />
                        </TouchableOpacity> */}
                    </RNCamera>
                    <View style={[{ alignItems: 'center' }]}>
                        <Text style={{ textTransform: "capitalize", fontSize: 20 }}>Scanning...</Text>
                    </View>
                </View>
            )}
            {scanResult == progressStatus[1] && !scanMode && (
                <View style={[styles.container, styles.horizontal, { flex: 6 }]}>
                    <ActivityIndicator size="large" color={COLORS.primaryColor} />
                </View>
            )}
            {scanResult == progressStatus[2] && (
                <View style={[{ flex: 1, alignItems: 'center' }]}>
                    <Text style={{ textTransform: "capitalize", fontSize: 16, marginVertical:15 }}>card request successfully sent to {userName}</Text>
                    <Image source={require('../../assets/img/other/Eo_circle_green_checkmark.svg.png')}
                        style={[styles.scanSuccess]} />
                    <TouchableOpacity style={{
                        marginVertical: 20,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        paddingHorizontal: 20,
                        alignItems: "center",
                    }} onPress={() => allowExchange(!cardEx)}>
                        <CheckBox
                            disabled={false}
                            value={cardEx}
                            onValueChange={(newValue) => allowExchange(newValue)}
                        />
                        <Text style={{fontSize: 16}}>{cardEx ? "Your card will be exchanged" : "Allow your card to be exchanged"}</Text>
                    </TouchableOpacity>
                    <Button title="Send next request" onPress={() => {
                        setScanResult(progressStatus[0])
                        SetCardEx(false)
                    }} />
                </View>
            )}
            {scanResult == progressStatus[0] && scanMode && (
                <View style={styles.root}>
                    <Text style={styles.title}>Enter Code</Text>
                    <CodeField
                        ref={ref}
                        {...codeFieldProps}
                        value={value}
                        onChangeText={codeHandle}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        //keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <Text style={styles.errMsg}>{errMsg}</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

export const CELL_SIZE = 40;
export const CELL_BORDER_RADIUS = 8;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        //backgroundColor: 'black'
    },
    body: {
        flex: 1,
    },
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        //overflow: 'hidden'
    },
    scanSuccess: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 150,
        height: 150,
        resizeMode: 'cover',
    },
    scanSuccessText: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: 16,
        color: 'green',
        marginBottom: 16,
    },
    captureIcon: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    root: { padding: 20, minHeight: 300 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        marginHorizontal: 8,
        height: CELL_SIZE * 1.5,
        width: CELL_SIZE, //40
        lineHeight: CELL_SIZE * 1.5, //38
        //...Platform.select({ web: { lineHeight: 65 } }),
        fontSize: 30,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#00000000',
        borderRadius: CELL_BORDER_RADIUS,
        color: '#3759b8',
        backgroundColor: '#fff',
        textTransform: "capitalize",
        // IOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        // Android
        elevation: 3,
    },
    focusCell: {
        borderColor: '#000',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 32,
    },
    headerText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    errMsg: { textAlign: 'left', fontSize: 30, marginTop: 20, color: COLORS.red },
})


export default Qrcode