import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding'
import { faSuitcase } from '@fortawesome/free-solid-svg-icons/faSuitcase'
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons/faSquarePollHorizontal'
import React, { useEffect, useRef, useState } from "react"
import { View, Text, Button, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground, Animated, PanResponder, Pressable, Linking } from "react-native"
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
import Modal from "react-native-modal";


const CardDetail = (props: any) => {
    const dispatch = useDispatch();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const scrollTop = useRef(new Animated.Value(0)).current;
    const maxHeight = useRef(new Animated.Value(0)).current;
    let scrollPosition = 0
    let animatedHeight: number = 0;
    const [scrollEnable, setScrollEnable] = useState(true)
    const [isPhoneModalVisible, setPhoneModalVisible] = useState(false);
    const { email, name, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic } = useSelector((state: IRootState) => state.cardDetail);
    let telephonesCopy = telephones.slice(1)
    let descriptionArray = description.split("\n")
    // console.log({ email, name, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic })


    const openPhoneModal = () => {
        setPhoneModalVisible(true);
    };

    useEffect(() => {
    }, [])


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
            <Modal
                animationIn={"zoomIn"}
                animationOut={"zoomOut"}
                isVisible={isPhoneModalVisible}
                animationInTiming={300}
                animationOutTiming={300}
                onBackdropPress={() => setPhoneModalVisible(false)}
            >
                <View style={styles.modalView}>
                    {telephones.length > 0 ? telephones.map((telephone, key) => {
                        return (
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${telephone["tel_number"]}`)} key={key}>
                                <View style={[styles.eachRow, { paddingVertical: 10, paddingHorizontal: 16 }]} >
                                    <View style={[styles.infoIconContainer]}>
                                        <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.light }} size={16} />
                                    </View>
                                    <View style={{ marginLeft: 24 }}>
                                        <Text style={styles.info}>{"+" + telephone["country_code"] + telephone["tel_number"]}</Text>
                                        <Text style={styles.label}>{telephone.category}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }) : ""}
                </View>
            </Modal>
            <View style={styles.header}>
            </View>
            <View style={Platform.OS === 'ios' ? styles.iostransparentHeader : styles.transparentHeader} >
                <Pressable onPress={() => { props.navigation.goBack() }} >
                    <View style={{ backgroundColor: "transparent", marginRight: 16, }}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} size={18} />
                    </View>
                </Pressable>
                <Text style={styles.headerText}>Card Details</Text>
            </View>
            <Animated.View style={[styles.businessCardContainer, cardAnimation]}>
                {imageFormat == "1" ? <BusinessCardStyleA name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={imageBg}></BusinessCardStyleA> : ""}
                {imageFormat == "2" ? <BusinessCardStyleB name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={imageBg}></BusinessCardStyleB> : ""}
                {imageFormat == "3" ? <BusinessCardStyleC name={name} email={email} title={title} company={company} profilePic={profilePic} telephones={telephones} address={address} imageBg={imageBg}></BusinessCardStyleC> : ""}
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
                                    <View style={styles.cardPersonInfo}>
                                        {/* {profilePic ?
                                            <Image source={require('../../assets/img/user/user-icon-01.jpg')} style={styles.cardPersonPhoto} /> :
                                            <View style={styles.cardWithoutPhoto}>
                                                <FontAwesomeIcon icon={faUser} style={styles.userIcon} size={36} />
                                            </View>
                                        } */}
                                        <View style={styles.cardWithoutPhoto}>
                                            <FontAwesomeIcon icon={faUser} style={styles.userIcon} size={36} />
                                        </View>
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
                                {/* {descriptionArray ? descriptionArray.map((item, key) => <Text key={key} style={[styles.cardDescriptions, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode='tail'>{item}</Text>) : ""} */}
                                {/* <Text style={[styles.cardDescriptions, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode='tail'>- Engaged in web application and mobile apps development</Text> */}
                            </View>
                        </View>
                    </View>
                    <View style={styles.functionRow}>
                        <Pressable onPress={openPhoneModal} disabled={telephones.length > 0 ? false : true}>
                            {/* onPress={() => Linking.openURL(`tel:${telephones[0]["tel_number"]}`)}> */}
                            <View style={styles.functionItem}>
                                <View style={[styles.functionCircle, { backgroundColor: telephones.length > 0 ? COLORS.primaryColor : COLORS.light }]}>
                                    <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.white }} size={16} />
                                </View>
                                <Text style={[styles.functionText, { color: telephones.length > 0 ? COLORS.primaryColor : COLORS.light }]}>Tel</Text>
                            </View>
                        </Pressable>
                        <Pressable >
                            <View style={styles.functionItem}>
                                <View style={styles.functionCircle}>
                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: COLORS.white }} size={16} />
                                </View>
                                <Text style={styles.functionText}>Address</Text>
                            </View>
                        </Pressable>
                        <Pressable>
                            <View style={styles.functionItem}>
                                <View style={styles.functionCircle}>
                                    <FontAwesomeIcon icon={faSquarePollHorizontal} style={{ color: COLORS.white }} size={18} />
                                </View>
                                <Text style={styles.functionText}>Note</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={{ backgroundColor: COLORS.androidDefaultBackground, height: 6 }}></View>
                    <View style={styles.bottomPart}>
                        {telephones.length > 0 ?
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${telephones[0]["tel_number"]}`)}>
                                <View style={styles.eachRow}>
                                    <View style={styles.infoIconContainer}>
                                        <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.light }} size={16} />
                                    </View>
                                    <View style={styles.rightColumn}>
                                        <Text style={styles.info}>{"+" + telephones[0]["country_code"] + telephones[0]["tel_number"]}</Text>
                                        <Text style={styles.label}>{telephones[0].category}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity> : ""}
                        <>
                            {telephones.length > 1 ? telephonesCopy.map((telephone, key) => {
                                return (
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${telephone["tel_number"]}`)} key={key}>
                                        <View style={styles.eachRow} >
                                            <View style={styles.infoIconContainer}>
                                            </View>
                                            <View style={styles.rightColumn}>
                                                <Text style={styles.info}>{"+" + telephone["country_code"] + telephone["tel_number"]}</Text>
                                                <Text style={styles.label}>{telephone.category}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
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
    arrow: {
        color: COLORS.white,
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
    transparentHeader: {
        height: 56,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 10,
        position: "absolute",
    },
    iostransparentHeader: {
        height: 56,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 10,
        position: "absolute",
        top: 50
    },
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
        textTransform: 'capitalize',
    },
    cardP: {
        height: 20,
    },
    cardPText: {
        flex: 1,
        width: 240,
        fontSize: 14,
        textTransform: 'capitalize',
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
        height: 80,
        paddingTop: 8,
    },
    functionItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 56,
    },
    functionCircle: {
        width: 35,
        height: 35,
        borderRadius: 35,
        backgroundColor: COLORS.primaryColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    functionText: {
        color: COLORS.primaryColor,
        fontSize: 12,
    },
    backDropView: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000aa",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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


export default CardDetail 