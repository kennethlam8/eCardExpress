import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import PencilSquare from "react-native-bootstrap-icons/icons/pencil-square";
import Palette from "react-native-bootstrap-icons/icons/palette";
import BoxArrowRight from "react-native-bootstrap-icons/icons/box-arrow-right";
import { faQrcode } from '@fortawesome/free-solid-svg-icons/faQrcode'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding'
import { faSuitcase } from '@fortawesome/free-solid-svg-icons/faSuitcase'
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import React, { useEffect, useRef, useState } from "react"
import { View, Text, Button, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground, Animated, PanResponder, Pressable } from "react-native"
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler"
import COLORS from "../../conts/colors"
import BusinessCardStyleA from "../components/BusinessCardStyleA";
import BusinessCardStyleB from "../components/BusinessCardStyleB";
import BusinessCardStyleC from "../components/BusinessCardStyleC";
import BusinessCardStyleD from "../components/BusinessCardStyleD";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo, logOut } from '../../redux/userInfo/thunks';
import { IRootState } from "../../redux/state";
import { setSocketUserId } from "../../redux/card/action";
//import { setSocketUserId } from "../components/Socket";


const Me = (props: any) => {
    const dispatch = useDispatch();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const scrollTop = useRef(new Animated.Value(0)).current;
    const maxHeight = useRef(new Animated.Value(0)).current;
    let scrollPosition = 0
    let animatedHeight: number = 0;
    const [scrollEnable, setScrollEnable] = useState(true)
    const { email, name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic, cardId } = useSelector((state: IRootState) => state.userInfo);
    let descriptionArray = description.split("\n")
    let telephonesCopy = telephones.slice(1)



    // console.log({ email, name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic,  cardId })

    // const getMe = async () => {
    //     try {
    //         const email = await AsyncStorage.getItem('email')
    //         const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    //         await dispatch(getMyInfo({ email: email, isLoggedIn: isLoggedIn })).unwrap()
    //     }
    //     catch (e) {
    //         console.log(e)
    //     }
    // }


    useEffect(() => {

    }, [])


    // clear all local data and redirect to login page
    const clearAllData = async () => {
        try {
            await AsyncStorage.clear()
            props.navigation.navigate("LoginMain")
            await dispatch(logOut()).unwrap()
            await dispatch(setSocketUserId({ socketUserId: '' }))
        } catch (e) {
            console.log(e)
        }
    }

    const slideDown = () => {
        Animated.spring(animatedValue, {
            toValue: 190,
            useNativeDriver: false,
        }).start(() => {
            // animatedValue.setValue(0);
        });
    };

    const slideUp = () => {
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false,
        }).start(() => {
            // animatedValue.setValue(190);
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            // onStartShouldSetPanResponder: () => {
            //     scrollTop.addListener(value => scrollPosition = value.value)
            //     if (scrollPosition == 0) {
            //         return true
            //     } else {
            //         return false
            //     }
            // },
            onMoveShouldSetPanResponder: (event, gesture) => {
                maxHeight.addListener(value => animatedHeight = value.value)
                scrollTop.addListener(value => scrollPosition = value.value)
                if (animatedHeight + gesture.dy > 0 && scrollPosition == 0) {
                    return true
                }
                animatedValue.setValue(0)
                return false
            },
            onPanResponderMove: (event, gesture) => {
                maxHeight.addListener(value => animatedHeight = value.value)
                if (animatedHeight + gesture.dy < 200 && animatedHeight + gesture.dy >= 0) {
                    animatedValue.setValue(animatedHeight + gesture.dy);
                }
            },
            onPanResponderRelease: async (event, gesture) => {
                if (gesture.dy > 0) {
                    slideDown();
                    maxHeight.setValue(190)
                    setScrollEnable(false)
                } else if (animatedHeight + gesture.dy < 190) {
                    slideUp();
                    maxHeight.setValue(0)
                    setScrollEnable(true)
                }
            },
        }),
    ).current;


    const cardAnimation = {
        opacity: animatedValue.interpolate({
            inputRange: [0, 190],
            outputRange: [0.2, 1],
        }),
        transform: [{
            translateY: animatedValue.interpolate({
                inputRange: [0, 190],
                outputRange: [-56, Platform.OS === 'ios' ? 48 : 0],
            })
        }]
    };

    //find the layout of each element
    const onLayout = (event: any) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;
        console.log(x)
        console.log(y)
        console.log(height)
        console.log(width)
        console.log(windowHeight)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            <View style={styles.header}>
                <Text style={styles.headerText}>My-Card</Text>
            </View>
            <Animated.View style={[styles.businessCardContainer, cardAnimation]}>
                {defaultImageIndex == "1" ? imageFormat == "1" ? <BusinessCardStyleA name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={imageBg}></BusinessCardStyleA> : "" : ""}
                {defaultImageIndex == "1" ? imageFormat == "2" ? <BusinessCardStyleB name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={imageBg}></BusinessCardStyleB> : "" : ""}
                {defaultImageIndex == "1" ? imageFormat == "3" ? <BusinessCardStyleC name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={imageBg}></BusinessCardStyleC> : "" : ""}
                {defaultImageIndex == "2" ? <ImageBackground style={{ width: "100%", height: 190 }} resizeMode="stretch" source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${cardImage}` }} /> : ""}
            </Animated.View>

            {/* <BusinessCardStyleD></BusinessCardStyleD> */}
            <Animated.View {...panResponder.panHandlers} style={{ flex: 1, position: "relative", zIndex: 5, backgroundColor: COLORS.primaryColor, transform: [{ translateY: animatedValue }] }}>
                <ScrollView style={[styles.slidePart]} onScroll={(e) => {
                    scrollTop.setValue(e.nativeEvent.contentOffset.y)
                }}
                    scrollEnabled={scrollEnable}
                >
                    <View style={styles.upperPart}>
                        <View style={styles.cardBackground} >
                            <View style={styles.cardBox}>
                                {/* <View style={styles.cardPersonIcon}></View> */}
                                <View style={styles.cardInnerUpper}>
                                    <View style={{ width: 70, height: 65 }}>
                                        {profilePic ?
                                            <Image source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${profilePic}` }} style={styles.cardPersonPhoto} /> :
                                            <View style={styles.cardWithoutPhoto}>
                                                <FontAwesomeIcon icon={faUser} style={styles.userIcon} size={36} />
                                            </View>
                                        }
                                    </View>
                                    <View style={styles.cardPersonInfo}>
                                        <View style={styles.cardH}>
                                            <Text style={[styles.cardHText, { textTransform: 'capitalize' }]} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
                                        </View>
                                        {title ?
                                            <View style={styles.cardP}>
                                                <Text style={[styles.cardPText, { textTransform: 'capitalize' }]} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                                            </View>
                                            : ""}
                                        {company ?
                                            <View style={styles.cardP}>
                                                <Text style={[styles.cardPText, { textTransform: 'capitalize' }]} numberOfLines={1} ellipsizeMode='tail'>{company}</Text>
                                            </View>
                                            : ""}
                                    </View>
                                </View>
                                {descriptionArray ? descriptionArray.map((item, key) => <Text key={key} style={[styles.cardDescriptions, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode='tail'>{item}</Text>) : ""}
                                {/* <Text style={[styles.cardDescriptions, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode='tail'>- Engaged in web application and mobile apps development</Text> */}
                            </View>
                        </View>
                    </View>
                    <View style={styles.functionRow}>
                        <Pressable onPress={() => { props.navigation.navigate("ProfileEdit") }}>
                            <View style={styles.functionItem}>
                                <PencilSquare fill={COLORS.primaryColor} width="36" height="36" viewBox="-5 -5 25 25" ></PencilSquare>
                                <Text style={styles.functionText}>Edit Profile</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => { props.navigation.navigate("CardStyle") }}>
                            <View style={styles.functionItem}>
                                <Palette fill={COLORS.primaryColor} width="36" height="36" viewBox="-5 -5 25 25" ></Palette >
                                <Text style={styles.functionText}>Card Style</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => { props.navigation.navigate("Qrcode Show") }}>
                            <View style={styles.functionItem}>
                                <View style={styles.qrCodeContainer}>
                                    <FontAwesomeIcon icon={faQrcode} style={styles.qrCode} size={24} />
                                </View>
                                <Text style={styles.functionText}>Card Code</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => { clearAllData() }}>
                            <View style={styles.functionItem}>
                                <BoxArrowRight fill={COLORS.primaryColor} width="36" height="36" viewBox="-5 -5 25 25" ></BoxArrowRight>
                                <Text style={styles.functionText}>Sign Out</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={{ backgroundColor: COLORS.androidDefaultBackground, height: 6 }}></View>
                    <View style={styles.bottomPart}>
                        {telephones.length > 0 ?
                            <View style={styles.eachRow}>
                                <View style={styles.infoIconContainer}>
                                    <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.light }} size={16} />
                                </View>
                                <View style={styles.rightColumn}>
                                    <Text style={styles.info}>{"+" + telephones[0]["country_code"] + telephones[0]["tel_number"]}</Text>
                                    <Text style={styles.label}>{telephones[0].category}</Text>
                                </View>
                            </View> : ""}
                        <>
                            {telephones.length > 1 ? telephonesCopy.map((telephone, key) => {
                                return (
                                    <View style={styles.eachRow} key={key}>
                                        <View style={styles.infoIconContainer}>
                                        </View>
                                        <View style={styles.rightColumn}>
                                            <Text style={styles.info}>{"+" + telephone["country_code"] + telephone["tel_number"]}</Text>
                                            <Text style={styles.label}>{telephone.category}</Text>
                                        </View>
                                    </View>)
                            }) : ""}
                        </>
                        <View style={styles.eachRow}>
                            <View style={styles.infoIconContainer}>
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: COLORS.light }} size={16} />
                            </View>
                            <View style={styles.rightColumn}>
                                <Text style={styles.info}>{email}</Text>
                                <Text style={styles.label}>work</Text>
                            </View>
                        </View>
                        {address ?
                            <View style={styles.eachRow}>
                                <View style={styles.infoIconContainer}>
                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: COLORS.light }} size={16} />
                                </View>
                                <View style={styles.rightColumn}>
                                    <Text style={[styles.info, { textTransform: 'capitalize' }]}>{address}</Text>
                                    <Text style={styles.label}>work</Text>
                                </View>
                            </View> : ""}
                        {company ?
                            <View style={styles.eachRow}>
                                <View style={styles.infoIconContainer}>
                                    <FontAwesomeIcon icon={faBuilding} style={{ color: COLORS.light }} size={16} />
                                </View>
                                <View style={styles.rightColumn}>
                                    <Text style={[styles.info, { textTransform: 'capitalize' }]}>{company}</Text>
                                    <Text style={styles.label}>Office</Text>
                                </View>
                            </View> : ""}
                        {title ?
                            <View style={styles.eachRow}>
                                <View style={styles.infoIconContainer}>
                                    <FontAwesomeIcon icon={faSuitcase} style={{ color: COLORS.light }} size={16} />
                                </View>
                                <View style={styles.rightColumn}>
                                    <Text style={[styles.info, { textTransform: 'capitalize' }]}>{title}</Text>
                                    <Text style={styles.label}>Title</Text>
                                </View>
                            </View> : ""}
                        {website ?
                            <View style={styles.eachRow}>
                                <View style={styles.infoIconContainer}>
                                    <FontAwesomeIcon icon={faGlobe} style={{ color: COLORS.light }} size={16} />
                                </View>
                                <View style={styles.rightColumn}>
                                    <Text style={styles.info}>{website}</Text>
                                    <Text style={styles.label}>Website</Text>
                                </View>
                            </View> : ""}
                    </View>
                    <View style={{ backgroundColor: COLORS.androidDefaultBackground, height: 16 }}></View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView >



        /* <View>
    
            <View>
                <Text style={{ fontSize: 30, marginTop: 30 }}>
                    No Header in ME Page
                </Text>
                <Button title="LogOut"
                    onPress={() =>
                        props.navigation.navigate('LoginMain')}></Button>
            </View>
        </View> */
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: 0,
        flex: 1,
        display: "flex",
    },
    header: {
        // flex: 1,
        height: 56,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: COLORS.primaryColor,
        zIndex: 2,
    },

    // content: {
    //     flex: 9,
    // },
    headerText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 18,
    },

    slidePart: {
        flex: 1,
        backgroundColor: "white",
        position: "relative",
        zIndex: 5,
    },
    businessCardContainer: {
        width: "100%",
        height: 190,
        backgroundColor: COLORS.white,
        position: "absolute",
        top: 56,
        zIndex: 4,
    },
    cardBackground: {
        backgroundColor: COLORS.primaryColor,
        height: 80,
        width: "100%",
        display: "flex",
        alignItems: "center",
        paddingTop: 10,
    },
    upperPart: {
        height: 180,
        backgroundColor: COLORS.white,

    },
    cardBox: {
        width: "95%",
        maxHeight: 180,
        minHeight: 160,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        paddingVertical: 16,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardInnerUpper: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 18,
    },
    cardPersonPhoto: {
        width: 64,
        height: 64,
        // backgroundColor: COLORS.primaryColor,
        borderRadius: 64,
        resizeMode: 'cover',
    },
    cardWithoutPhoto: {
        width: 64,
        height: 64,
        backgroundColor: COLORS.light,
        borderRadius: 64,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    userIcon: {
        color: COLORS.white,
        position: "relative",
        bottom: 0,
    },
    cardPersonInfo: {
        marginLeft: 8,
    },
    cardH: {
        height: 24,
    },
    cardHText: {
        fontWeight: 'bold',
        color: COLORS.darkGrey,
        fontSize: 18,
        flex: 1,
        width: 190,
    },
    cardP: {
        height: 20,
    },
    cardPText: {
        flex: 1,
        width: 240,
        fontSize: 14,
        // lineHeight: 14,
    },
    selfDescription: {
        width: "100%",
    },
    cardDescriptions: {
        width: "100%",
        flex: 1,
        // marginBottom:1,
    },
    functionRow: {
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        bottom: 0,
        backgroundColor: COLORS.white,
        height: 64,
        // paddingHorizontal: 16,
    },
    functionItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    functionText: {
        color: COLORS.primaryColor,
        fontSize: 12,
    },
    qrCode: {
        color: COLORS.primaryColor,
        position: "relative",
        bottom: 4,
    },
    qrCodeContainer: {
        width: 36,
        height: 36,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",

    },
    bottomPart: {
        backgroundColor: COLORS.white,
    },
    eachRow: {
        minHeight: 48,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        // backgroundColor: COLORS.primaryColor,
    },
    rightColumn: {
        marginLeft: 16,
    },
    infoIconContainer: {
        width: 16,
        height: 16,
    },
    info: {
        color: COLORS.black,
        fontSize: 13,
    },
    label: {
        color: COLORS.grey,
        fontSize: 13,
    }
})


export default Me