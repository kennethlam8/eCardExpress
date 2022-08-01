import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    StyleSheet, TouchableOpacity, Text, Button, Image, ActivityIndicator, SafeAreaView, Dimensions, Pressable
} from 'react-native';
import MlkitOcr from 'react-native-mlkit-ocr';
import ImagePicker from 'react-native-image-crop-picker';
import COLORS from '../../conts/colors';
import Modal from "react-native-modal";
import { CardFormatter } from '../components/CardFormatter';
import { ScrollView } from 'react-native-gesture-handler';

const DEFAULT_HEIGHT = 500;
const DEFAULT_WIDTH = 1000;
const defaultPickerOptions = {
    cropping: true,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
};
const sampleCard = {
    first_name: 'Michael',
    last_name: 'Wan',
    title: 'Senior Associate',
    company_name: 'LimeTree Capital Advisors Limited',
    tel: [{ country_code: "852", tel_number: "21178596", category: "work" }],
    fax: [{ country_code: "852", tel_number: "21178591", category: "fax" }],
    email: "michael.wan@limetreecapital.com",
    address: "702, Henley Building, 5 Queen's Road Central, Hong Kong"
}

// let text_arr = []
// text_arr.push(<Text>hello</Text>)

// for (let key in sampleCard) {
//     text_arr.push(<Text style={{margin:2}}>{sampleCard[key]}</Text>)
//   }
//console.log("text arr: ", text_arr)
const defaultScanResult = {
    first_name: '',
    last_name: '',
    title: '',
    company_name: '',
    tel: [],
    email: "",
    address: ""
}

const Camera = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    //const [text, setText] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [scanResult, setScanResult] = useState(defaultScanResult);

    useEffect(() => {
        setTimeout(() => { setModalVisible(true) }, 400)
    }, [])

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const recognizeTextFromImage = async (path) => {
        setIsLoading(true);
        try {
            const recognizedText = await MlkitOcr.detectFromUri(path);
            console.log("ocr result: ", recognizedText);
            // const textShown = recognizedText.map(data => {
            //     return data.text + " "
            // })
            //setText(textShown);
            if (recognizedText.length < 1) {
                setScanResult(defaultScanResult)
            } else {
                let formattedData = CardFormatter(recognizedText)
                console.log(formattedData)
                setScanResult(formattedData)
            }
        } catch (err) {
            console.error(err);
            //setText('');
            setScanResult(defaultScanResult)
            toggleModal();
        }

        setIsLoading(false);
        //setProgress(0);
    };

    const recognizeFromPicker = async (options = defaultPickerOptions) => {
        try {
            const image = await ImagePicker.openPicker({
                width: 2048, // if too low, picker will ask for cropping the pic
                height: 1024,
            });
            console.log("picker set ", image.path)
            setImgSrc({ uri: image.path });
            console.log("image format: ", image.mime, " , size: ", image.size)
            await recognizeTextFromImage(image.path);
        } catch (err) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
            setModalVisible(true);
        }
    };

    const recognizeFromCamera = async (options = defaultPickerOptions) => {
        try {
            const image = await ImagePicker.openCamera({
                width: 5000, // if too low, picker will ask for cropping the pic
                height: 2500,
                //cropping: true, 
                includeBase64: true,           
            });
            setImgSrc({ uri: image.path });
            await recognizeTextFromImage(image.path);
        } catch (err) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
            setModalVisible(true);
        }
    };

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Pressable style={styles.headerButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.headerText}>Select Image</Text>
                </Pressable>
                // <Button
                //     onPress={() => setModalVisible(true)}
                //     title="Select Image"
                //     style={{borderRadius: 0, elevation: 0}} />
            ),
        });
    }, [props.navigation]);

    const navigateWithResult = (page) => {
        let navigationObject = scanResult
        navigationObject["imgSrc"] = imgSrc
        console.log("object to be sent: ", navigationObject);
        props.navigation.navigate(page, navigationObject) //"CardCreate"
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Scan Result</Text>
                {/* <View style={styles.options}>
                    <View style={styles.button}>
                        <Button
                            disabled={isLoading}
                            title="Select Image"
                            onPress={toggleModal}
                        />
                    </View>
                </View> */}
                {isModalVisible &&
                    (<Modal isVisible={isModalVisible}
                        onBackdropPress={() => setModalVisible(false)} >
                        <View style={styles.content}>
                            <Text style={styles.contentTitle}>Select an image source:</Text>
                            <TouchableOpacity
                                style={styles.contentButton}
                                disabled={isLoading}
                                onPress={() => {
                                    setModalVisible(false);
                                    recognizeFromCamera()
                                }}>
                                <Text style={styles.contentText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contentButton}
                                disabled={isLoading}
                                onPress={() => {
                                    setModalVisible(false);
                                    recognizeFromPicker()
                                }}>
                                <Text style={styles.contentText}>From Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>)}
                {imgSrc && (
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={imgSrc} resizeMode="contain" />
                        {isLoading ? (
                            <ActivityIndicator size="large" color={COLORS.primaryColor} />
                        ) :
                            <View style={{flex: 1, paddingHorizontal:30}}>
                                <ScrollView style={{  flex: 1, margin: 2}}>
                                    <Text>First name: {scanResult["first_name"]}</Text>
                                    <Text>Last name: {scanResult["last_name"]}</Text>
                                    <Text>Title: {scanResult["title"]}</Text>
                                    <Text>Company name: {scanResult["company_name"]}</Text>
                                    {scanResult["tel"].map(a => {
                                        return <Text key={a["index"]}>{a["index"] == 0 ? "Phone: " : "              "}+{a["country_code"]} {a["tel_number"]} {a["category"]}</Text>
                                    })}
                                    <Text>Email: {scanResult["email"]}</Text>
                                    <Text>Address: {scanResult["address"]}</Text>
                                </ScrollView>
                                <View style={{
                                    marginVertical: 10,
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    paddingHorizontal: 20,
                                    alignContent: "flex-start",
                                    height: 100
                                }}>
                                    <TouchableOpacity style={styles.rescanBtn} onPress={toggleModal}>
                                        <Text style={styles.btnText}>Re-scan</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.createBtn} onPress={() => { navigateWithResult("CardCreate") }}>
                                        <Text style={styles.btnText}>Create</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                )}
                {!imgSrc && (
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 225,
                        width: 400,
                        backgroundColor: "grey",
                    }}>
                        <Image style={{
                            marginVertical: 15,
                            height: 300 / 2.5,
                            width: 300 / 2.5,
                        }} source={require('../../assets/img/icon/gallery.png')} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
} /* <Text style={{margin:2}}>{text}</Text> */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    button: {
        marginHorizontal: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginVertical: 15,
        height: DEFAULT_HEIGHT / 2.5,
        width: DEFAULT_WIDTH / 2.5,
    },
    title: {
        fontSize: 20,
        textAlign: 'left',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    contentButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 70,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 5

    },
    contentText: {
        fontSize: 20,
        marginBottom: 12,
        borderRadius: 4
    },
    rescanBtn: {
        width: 120,
        height: 40,
        backgroundColor: "#1D9BF0",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 4,
        marginRight: 10
    },
    createBtn: {
        width: 120,
        height: 40,
        backgroundColor: "#00CA4E",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 4
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
      },
     headerText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
});

export default Camera
