import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import React, { useEffect, useRef, useState } from "react"
import { View, Text, Button, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground, TouchableNativeFeedback, ScrollView, Alert } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { useDispatch, useSelector } from "react-redux"
import COLORS from "../../conts/colors"
import { IRootState } from "../../redux/state"
import BusinessCardStyleA from "../components/BusinessCardStyleA"
import BusinessCardStyleB from "../components/BusinessCardStyleB"
import BusinessCardStyleC from "../components/BusinessCardStyleC"
import { updateCardStyle } from '../../redux/userInfo/thunks';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from "react-native-modal";

const defaultPickerOptions = {
    cropping: true,
    height: 500,
    width: 1000,
};

const CardStyle = (props: any) => {
    const dispatch = useDispatch()
    const refScrollView = useRef<any>();
    const [chosenFormat, setChosenFormat] = useState("")
    const [chosenBackground, setChosenBackground] = useState("")
    const [defaultImage, setDefaultImage] = useState("")        //1:e-card, 2:user's uploaded card
    const { email, name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic, cardId } = useSelector((state: IRootState) => state.userInfo);
    console.log({ email, name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic })
    const [isModalVisible, setModalVisible] = useState(false);
    const [imgSrc, setImgSrc] = useState<{ uri: string } | null>(null);

    const format1 = [1, 2, 3, 4, 5, 6]
    const format2 = [7, 8, 9, 10, 11, 12]
    const format3 = [10, 11, 12]

    useEffect(() => {
        setChosenFormat(imageFormat)
        setChosenBackground(imageBg)
        setDefaultImage(defaultImageIndex)

    }, [])

    const createAlert = () =>
        Alert.alert(
            "Save?",
            "Would you like to save your changes?",
            [
                {
                    text: "No",
                    onPress: () => props.navigation.navigate("Me"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => updateCard() }
            ]
        );

    //fetch to server
    const updateCard = async () => {
        try {
            let fetchItem = new FormData()
            chosenFormat == "0" ? fetchItem.append("card_format", "") : fetchItem.append("card_format", chosenFormat)
            chosenBackground == "0" ? fetchItem.append("card_bg", "") : fetchItem.append("card_bg", chosenBackground)
            fetchItem.append("card_id", cardId)
            fetchItem.append("default_image_index", defaultImage)
            if (imgSrc) {
                fetchItem.append("ecard_image", {
                    uri: imgSrc.uri,//"file:///storage/emulated/0/Android/data/com.ecardexpress/files/Pictures/7ab4d6da-2bee-47ca-acc5-fcc2afa747fb.jpg",
                    type: 'image/jpg',
                    name: 'card.jpg',
                });
            }
            await dispatch(updateCardStyle(fetchItem)).unwrap()
            props.navigation.navigate("Me")
        } catch (e) {
            console.log(e)
        }
    }

    const recognizeFromPicker = async (options = defaultPickerOptions) => {
        try {
            const image = await ImagePicker.openPicker({
                width: 2048, // if too low, picker will ask for cropping the pic
                height: 1024,
            });
            console.log("picker set")
            setImgSrc({ uri: image.path });
            setChosenFormat("0")
            setChosenBackground("0")
            setDefaultImage("2")

        } catch (err: any) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    };

    const recognizeFromCamera = async (options = defaultPickerOptions) => {
        try {
            const image = await ImagePicker.openCamera({
                width: 2048, // if too low, picker will ask for cropping the pic
                height: 1024,
            });
            setImgSrc({ uri: image.path });
            setChosenFormat("0")
            setChosenBackground("0")
            setDefaultImage("2")
        } catch (err: any) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (chosenFormat != imageFormat || chosenBackground != imageBg || defaultImage != defaultImageIndex) {
                        createAlert()
                    } else {
                        props.navigation.goBack()
                    }
                }}>
                    <View style={{ backgroundColor: COLORS.primaryColor, marginRight: 16, }}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerText}>Card Style</Text>
            </View>
            <View style={styles.cardRow}>
                <View style={styles.cardPreview}>
                    {defaultImage == "2" ? "" : chosenFormat == "1" ? <BusinessCardStyleA imageStyle={{ borderRadius: 8, }} name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={chosenBackground}></BusinessCardStyleA> : ""}
                    {defaultImage == "2" ? "" : chosenFormat == "2" ? <BusinessCardStyleB imageStyle={{ borderRadius: 8, }} name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={chosenBackground}></BusinessCardStyleB> : ""}
                    {defaultImage == "2" ? "" : chosenFormat == "3" ? <BusinessCardStyleC imageStyle={{ borderRadius: 8, }} name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={chosenBackground}></BusinessCardStyleC> : ""}
                    {defaultImage == "1" ? "" : imgSrc ? <ImageBackground source={imgSrc} resizeMode="stretch" style={{ width: "100%", height: 190 }} imageStyle={{ borderRadius: 8, }}></ImageBackground> :
                        <ImageBackground style={{ width: "100%", height: 190 }} resizeMode="stretch"  imageStyle={{ borderRadius: 8, }} source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${cardImage}` }} />}
                </View>
            </View>
            <View style={styles.uploadRow}>
                <TouchableNativeFeedback onPress={() => (imgSrc || cardImage) && defaultImage == "1" ? setDefaultImage("2") : setModalVisible(true)}>
                    <Text style={styles.uploadText}>{(imgSrc || cardImage) && defaultImage == "1" ? "Use My Business Card" : "Upload My Business Card"}</Text>
                </TouchableNativeFeedback>
            </View>
            {isModalVisible &&
                (<Modal isVisible={isModalVisible}
                    onBackdropPress={() => setModalVisible(false)} >
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>Select an image source:</Text>
                        <TouchableOpacity
                            style={styles.contentButton}
                            onPress={() => {
                                setModalVisible(false);
                                recognizeFromCamera()
                            }}>
                            <Text style={styles.contentText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.contentButton}
                            onPress={() => {
                                setModalVisible(false);
                                recognizeFromPicker()
                            }}>
                            <Text style={styles.contentText}>From Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>)}
            <View style={styles.row}>
                <Text style={styles.rowText}>Select Card Format</Text>
                <View style={styles.chooseStyleRow}>
                    <TouchableNativeFeedback onPress={() => {
                        setChosenFormat("1")
                        setChosenBackground("1")
                        setDefaultImage("1")
                        refScrollView.current.scrollTo({ x: 0, y: 0, animated: true })
                    }}>
                        <View style={styles.cardFormat1}>
                            <View style={styles.circle}></View>
                            <View style={styles.cardFormat1Right}>
                                <View style={styles.rectangle1}></View>
                                <View style={styles.rectangle1}></View>
                                <View style={styles.rectangle1}></View>
                                <View style={styles.space}></View>
                                <View style={styles.rectangle2}></View>
                                <View style={styles.rectangle2}></View>
                                <View style={styles.rectangle2}></View>
                            </View>
                            {chosenFormat == "1" ? <View style={styles.chosenFormat}>
                                <View style={styles.tick}>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: COLORS.white, }} size={16} />
                                </View>
                            </View> : ""}
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => {
                        setChosenFormat("2")
                        setChosenBackground("7")
                        setDefaultImage("1")
                        refScrollView.current.scrollTo({ x: 0, y: 0, animated: true })
                    }}>
                        <View style={styles.cardFormat2}>
                            <View style={styles.rectangle1}></View>
                            <View style={styles.rectangle1}></View>
                            <View style={styles.rectangle1}></View>
                            <View style={styles.space}></View>
                            <View style={styles.rectangle2}></View>
                            <View style={styles.rectangle2}></View>
                            <View style={styles.rectangle2}></View>
                            {chosenFormat == "2" ? <View style={styles.chosenFormat}>
                                <View style={styles.tick}>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: COLORS.white, }} size={16} />
                                </View>
                            </View> : ""}
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => {
                        setChosenFormat("3")
                        setChosenBackground("10")
                        setDefaultImage("1")
                        refScrollView.current.scrollTo({ x: 0, y: 0, animated: true })
                    }}>
                        <View style={styles.cardFormat3}>
                            <View style={styles.rectangle1}></View>
                            <View style={styles.rectangle1}></View>
                            <View style={styles.rectangle1}></View>
                            <View style={styles.line}></View>
                            <View style={styles.space}></View>
                            <View style={styles.cardFormat3Bottom}>
                                <View style={styles.rectangle2}></View>
                                <View style={styles.rectangle2}></View>
                                <View style={styles.rectangle2}></View>
                            </View>
                            {chosenFormat == "3" ? <View style={styles.chosenFormat}>
                                <View style={styles.tick}>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: COLORS.white, }} size={16} />
                                </View>
                            </View> : ""}
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Select Card Background</Text>
                <View style={styles.chooseStyleRow}>
                    <ScrollView ref={refScrollView} horizontal={true} showsHorizontalScrollIndicator={false} >
                        {/* {chosenFormat == "0" ? format1.map(e => <Background number={e} key={e} chosen={chosenBackground}> </Background>) : ""} */}
                        {chosenFormat == "1" ? format1.map(e => <Background number={e} key={e} chosen={chosenBackground} onclick={() => {
                            setChosenBackground(`${e}`)
                        }}></Background>) : ""}
                        {chosenFormat == "2" ? format2.map(e => <Background number={e} key={e} chosen={chosenBackground} onclick={() => { setChosenBackground(`${e}`) }}></Background>) : ""}
                        {chosenFormat == "3" ? format3.map(e => <Background number={e} key={e} chosen={chosenBackground} onclick={() => { setChosenBackground(`${e}`) }}></Background>) : ""}
                    </ScrollView>
                </View>
            </View >
            {/* <View style={styles.row}>
                <Text style={styles.rowText}>Select Card Information</Text>
                <Text style={styles.rowText}>Select Card Background</Text>
            </View> */}
            <View style={styles.buttonRow}>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Save"
                        onPress={() => {
                            updateCard()
                        }}
                    />
                </View>
            </View>
        </SafeAreaView >
    )
}

interface Props {
    background: string;
}


const Background = (props: any) => {
    // const [chosenBg, setChosenBg] = useState(props.number)

    return (
        <TouchableWithoutFeedback onPress={
            props.onclick
        }>
            <View style={styles.background}>
                {props.number == 1 ? <Image source={require("../../assets/img/card/business-card-background1.png")} style={styles.image} /> : ""}
                {props.number == 2 ? <Image source={require("../../assets/img/card/business-card-background2.png")} style={styles.image} /> : ""}
                {props.number == 3 ? <Image source={require("../../assets/img/card/business-card-background3.png")} style={styles.image} /> : ""}
                {props.number == 4 ? <Image source={require("../../assets/img/card/business-card-background4.png")} style={styles.image} /> : ""}
                {props.number == 5 ? <Image source={require("../../assets/img/card/business-card-background5.png")} style={styles.image} /> : ""}
                {props.number == 6 ? <Image source={require("../../assets/img/card/business-card-background6.png")} style={styles.image} /> : ""}
                {props.number == 7 ? <Image source={require("../../assets/img/card/business-card-background7.png")} style={styles.image} /> : ""}
                {props.number == 8 ? <Image source={require("../../assets/img/card/business-card-background8.png")} style={styles.image} /> : ""}
                {props.number == 9 ? <Image source={require("../../assets/img/card/business-card-background9.png")} style={styles.image} /> : ""}
                {props.number == 10 ? <Image source={require("../../assets/img/card/business-card-background10.png")} style={styles.image} /> : ""}
                {props.number == 11 ? <Image source={require("../../assets/img/card/business-card-background11.png")} style={styles.image} /> : ""}
                {props.number == 12 ? <Image source={require("../../assets/img/card/business-card-background12.png")} style={styles.image} /> : ""}
                {props.chosen == props.number ?
                    <View style={styles.chosenBackground}>
                        <View style={styles.tick}>
                            <FontAwesomeIcon icon={faCircleCheck} style={{ color: COLORS.white, }} size={16} />
                        </View>
                    </View> : ""}
            </View>
        </TouchableWithoutFeedback>)
}



const styles = StyleSheet.create({
    header: {
        // flex: 1,
        height: 56,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: COLORS.primaryColor,
    },
    arrow: {
        color: COLORS.white,
    },
    headerText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 18,
    },
    cardRow: {
        width: '100%',
        display: "flex",
        alignItems: "center",
        marginTop: 10,
    },
    cardPreview: {
        width: '95%',
        borderRadius: 1,

    },
    uploadRow: {
        marginVertical: 10,
    },
    uploadText: {
        color: COLORS.primaryColor,
        textAlign: 'center',
    },
    row: {
        paddingHorizontal: 10,
        paddingTop: 12,
    },
    rowText: {
        color: COLORS.black,
    },
    chooseStyleRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 16,
        borderBottomColor: '#9e9e9e33',
        borderBottomWidth: 1,
    },
    cardFormat1: {
        width: 80,
        height: 48,
        backgroundColor: COLORS.grey,
        borderRadius: 5,
        marginRight: 16,
        marginBottom: 20,
        display: "flex",
        alignItems: "flex-start",
        padding: 8,
        flexDirection: "row",
    },
    cardFormat1Right: {
        marginLeft: 5,
    },

    cardFormat2: {
        width: 80,
        height: 48,
        backgroundColor: COLORS.grey,
        borderRadius: 5,
        marginRight: 16,
        marginBottom: 20,
        display: "flex",
        alignItems: "flex-end",
        padding: 8,
        // flexDirection: "row",
    },
    cardFormat3: {
        width: 80,
        height: 48,
        backgroundColor: COLORS.grey,
        borderRadius: 5,
        marginRight: 16,
        marginBottom: 20,
        display: "flex",
        alignItems: "flex-start",
        padding: 8,
    },
    cardFormat3Bottom: {
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
    },
    chosenFormat: {
        width: 80,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
        backgroundColor: "#4e4e4e",
        position: "absolute",
        zIndex: 1,
        bottom: 0,
        right: 0,
        borderRadius: 5,
    },
    tick: {
        backgroundColor: COLORS.green,
        borderRadius: 100,
    },
    rectangle1: {
        backgroundColor: COLORS.white,
        height: 2,
        width: 28,
        marginBottom: 3,
        borderRadius: 2,
    },
    rectangle2: {
        backgroundColor: COLORS.white,
        height: 2,
        width: 48,
        marginBottom: 3,
        borderRadius: 2,
    },
    circle: {
        backgroundColor: COLORS.white,
        width: 12,
        height: 12,
        borderRadius: 100,
    },
    space: {
        paddingVertical: 2,
    },
    line: {
        backgroundColor: COLORS.white,
        height: 0.5,
        width: "100%",
    },
    background: {
        width: 70,
        height: 48,
        borderRadius: 5,
        marginRight: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.lightLineColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    image: {
        resizeMode: 'stretch',
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    chosenBackground: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
        backgroundColor: "#4e4e4e",
        position: "absolute",
        zIndex: 1,
        bottom: 0,
        right: 0,
        borderRadius: 5,
        borderColor: COLORS.lightLineColor,
        borderWidth: 1,
    },
    buttonRow: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "100%",
        bottom: 30,
    },
    buttonContainer: {
        width: "90%",
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentText: {
        fontSize: 20,
        marginBottom: 12,
        borderRadius: 4
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
})

export default CardStyle