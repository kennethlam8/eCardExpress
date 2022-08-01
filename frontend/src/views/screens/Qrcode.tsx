// import React, { useLayoutEffect, useState } from "react"
// import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Button, Alert, ActivityIndicator, TextInput } from "react-native"
// import { RNCamera } from 'react-native-camera';
// import { useCamera } from 'react-native-camera-hooks';
// import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
// import RNFS from 'react-native-fs';
// import COLORS from "../../conts/colors";

// async function sendCardRequest(cardId, props, callback) {
//     console.log("Sending fetch card " + cardId)
//     let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `cardCode/${cardId}`)

//     if (res.status.toString().startsWith("5")) {
//         return "Internal create user error"
//     }

//     let result = await res.json()
//     console.log("Send request result: ", result)

//     if (res.status.toString().startsWith("4")) {
//         return `"Error: ", ${result.message}`
//     } else {
//         //errLabel.classList.add("success")
//     }

//     if (res.ok) {
//         //skChase.classList.remove("show"
//         callback[0](result.data[0].first_name)
//         callback[1](progressStatus[2])
//         /* setTimeout(() => {
//             props.navigation.navigate("Footer")
//         }, 1000); */
//     }
// }

// const progressStatus = ["scanning", "loading", "complete"]

// const CELL_COUNT = 6;

// const Qrcode = (props) => {
//     const [{ cameraRef }, { takePicture }] = useCamera(null);
//     const [scanResult, setScanResult] = useState(progressStatus[0]);
//     const [userName, setUserName] = useState('');
//     const [scanMode, setScanMode] = useState(false);
//     const [value, setValue] = useState('');
//     const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

//     const [errMsg, setErrMsg] = useState('');

//     const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
//         value,
//         setValue,
//     });

//     useLayoutEffect(() => {
//         props.navigation.setOptions({
//             headerRight: () => (
//                 <Button
//                     onPress={() => {
//                         setScanMode(!scanMode)
//                         console.log("Scan Mode: " + scanMode)
//                     }
//                     }
//                     title={(!scanMode ? "Manually Input" : "Scan")}
//                     disabled={scanResult != progressStatus[0]} />
//             ),
//         });

// }, [props.navigation, scanMode, scanResult]);

// const captureHandle = async () => {
//     try {
//         const data = await takePicture();
//         console.log(data.uri);
//         const filePath = data.uri;
//         const newFilePath = RNFS.ExternalDirectoryPath + '/MyTest.jpg';
//         RNFS.moveFile(filePath, newFilePath)
//             .then(() => {
//                 console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//     } catch (error) {
//         console.log(error);
//     }
// }

// const barcodeHandle = async (data) => {
//     setScanResult(progressStatus[1])
//     try {
//         console.log("Barcode data:", data.data);
//         let cardCode = data.data.split('=')
//         if (cardCode[0] == "cardId") {
//             let error = await sendCardRequest(cardCode[1], props, [setUserName, setScanResult])
//             if (error) {
//                 throw error
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         Alert.alert(
//             "Error",
//             "Error occurred",
//             [
//                 {
//                     text: "Return to Home",
//                     onPress: () => props.navigation.navigate("Footer"),
//                     style: "cancel"
//                 },
//                 { text: "Re-scan", onPress: () => setScanResult(progressStatus[0]) }
//             ]
//         );
//     }
// }

// const cardCodeFormat = [false, false, true, true, true, true]

// const codeHandle = async (input) => {
//     setValue(input)
//     if (input.length == CELL_COUNT) {
//         if (/^[a-zA-Z0-9]+$/.test(input)) {
//             input = input.toUpperCase()
//             let codeInputFormat = input.split("").map((word) => {
//                 return (/^[0-9]+$/.test(word))
//             })
//             console.log("Code pattern entered: ", codeInputFormat)

//             if (codeInputFormat.sort().join(',') !== cardCodeFormat.sort().join(',')) {
//                 setErrMsg('Invalid Code')
//                 return
//             }

//             //setScanResult(progressStatus[1])
//             try {
//                 let error = await sendCardRequest(input, props, [setUserName, setScanResult])
//                 if (error) {
//                     throw error
//                 }
//             } catch (error) {
//                 console.log(error);
//                 setErrMsg('Invalid Code')
//                 setScanResult(progressStatus[0])
//             }

//         } else {
//             setErrMsg('Invalid Code')
//         }
//     } else if (input.length < CELL_COUNT) {
//         setErrMsg('')
//     }
// }

// return (
//     <SafeAreaView style={styles.body}>
//         {scanResult == progressStatus[0] && !scanMode && (
//             <View style={styles.container}>
//                 <RNCamera
//                     ref={cameraRef}
//                     //type={RNCamera.Constants.Type.back}
//                     style={styles.preview}
//                     captureAudio={false}
//                     onBarCodeRead={barcodeHandle}
//                 >
//                     <TouchableOpacity
//                         onPress={() => captureHandle()}
//                     >
//                         <Image source={require('../../assets/img/icon/rec.png')} style={styles.captureIcon} />
//                     </TouchableOpacity>
//                 </RNCamera>
//             </View>
//         )}
//         {scanResult == progressStatus[1] && !scanMode && (
//             <View style={[styles.container, styles.horizontal, { flex: 6 }]}>
//                 <ActivityIndicator size="large" color={COLORS.primaryColor} />
//             </View>
//         )}
//         {scanResult == progressStatus[2] && (
//             <View style={[{ flex: 1, alignItems: 'center' }]}>
//                 <Text style={{ textTransform: "capitalize" }}>card request successfully sent to {userName}</Text>
//                 <Image source={require('../../assets/img/other/Eo_circle_green_checkmark.svg.png')}
//                     style={[styles.scanSuccess]} />
//                 <Button title="Send next request" onPress={() => setScanResult(progressStatus[0])} />
//             </View>
//         )}
//         {scanResult == progressStatus[0] && scanMode && (
//             <View style={styles.root}>
//                 <Text style={styles.title}>Enter Code</Text>
//                 <CodeField
//                     ref={ref}
//                     {...codeFieldProps}
//                     value={value}
//                     onChangeText={codeHandle}
//                     cellCount={CELL_COUNT}
//                     rootStyle={styles.codeFieldRoot}
//                     //keyboardType="number-pad"
//                     textContentType="oneTimeCode"
//                     renderCell={({ index, symbol, isFocused }) => (
//                         <Text
//                             key={index}
//                             style={[styles.cell, isFocused && styles.focusCell]}
//                             onLayout={getCellOnLayoutHandler(index)}>
//                             {symbol || (isFocused ? <Cursor /> : null)}
//                         </Text>
//                     )}
//                 />
//                 <Text style={styles.errMsg}>{errMsg}</Text>
//             </View>
//         )}
//     </SafeAreaView>
// )
// }

// export const CELL_SIZE = 40;
// export const CELL_BORDER_RADIUS = 8;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         //backgroundColor: 'black'
//     },
//     body: {
//         flex: 1,
//     },
//     preview: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         //overflow: 'hidden'
//     },
//     scanSuccess: {
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         width: 150,
//         height: 150,
//         resizeMode: 'cover',
//     },
//     scanSuccessText: {
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         fontSize: 16,
//         color: 'green',
//         marginBottom: 16,
//     },
//     captureIcon: {
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         width: 100,
//         height: 100,
//         resizeMode: 'cover',
//     },
//     horizontal: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         padding: 10
//     },
//     root: { padding: 20, minHeight: 300 },
//     title: { textAlign: 'center', fontSize: 30 },
//     codeFieldRoot: { marginTop: 20 },
//     cell: {
//         marginHorizontal: 8,
//         height: CELL_SIZE * 1.5,
//         width: CELL_SIZE, //40
//         lineHeight: CELL_SIZE * 1.5, //38
//         //...Platform.select({ web: { lineHeight: 65 } }),
//         fontSize: 30,
//         textAlign: 'center',
//         borderWidth: 2,
//         borderColor: '#00000000',
//         borderRadius: CELL_BORDER_RADIUS,
//         color: '#3759b8',
//         backgroundColor: '#fff',
//         textTransform: "capitalize",
//         // IOS
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.22,
//         shadowRadius: 2.22,
//         // Android
//         elevation: 3,
//     },
//     focusCell: {
//         borderColor: '#000',
//     },
//     errMsg: { textAlign: 'left', fontSize: 30, marginTop: 20, color: COLORS.red },
// })


// export default Qrcode


import React from "react"
import { Text, View } from "react-native"

const Qrcode = () => {
    return (
        <View>
            <Text>
                Qrcode
            </Text>
        </View>
    )
}

export default Qrcode