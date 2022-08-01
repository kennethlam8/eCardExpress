import React, { useState } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Event from "../screens/Event";
import Me from "../screens/Me";
import Scan from "../screens/Scan";
import { View, Image, Text, StyleSheet, TouchableOpacity, Pressable, Alert, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import COLORS from "../../conts/colors";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/state";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation'
import SearchCard from "./SearchCard";

//ignore all warning 
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);


const Tab = createBottomTabNavigator();

const Footer = (props: any) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const { requestReceived } = useSelector((state: IRootState) => state.card)
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const qrcodeNavigater = () => {
        props.navigation.navigate("Qrcode")
        toggleModal()
    }
    const cameraNavigater = () => {
        props.navigation.navigate("Upload Card")
        toggleModal()
    }
    const albumNavigater = () => {
        props.navigation.navigate("CardCreate")
        toggleModal()
    }


    return (

        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: [{ height: 90, ...styles.shadow }],

            }}
        >

            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image
                            source={require('../../assets/img/icon/home.png')}
                            resizeMode='contain'
                            style={{
                                width: 22,
                                height: 22,
                                tintColor: !focused ? 'grey' : '#1D9BF0'
                            }}
                        />
                        <Text
                            style={{
                                color: !focused ? 'grey' : '#1D9BF0',
                                marginTop: 3,
                            }}>Home</Text>

                        {requestReceived ?
                            <View style={styles.notificationIcon}>
                                {/* <FontAwesomeIcon icon={faCircleExclamation} style={{ color: COLORS.notificationRed }} size={12} /> */}
                            </View> : <Text style={styles.hideNotificationIcon}></Text>}
                    </View>
                )
            }} />
            <Tab.Screen name="Search Card" component={SearchCard} options={{
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image
                            source={require('../../assets/img/icon/search.png')}
                            resizeMode='contain'
                            style={{
                                width: 22,
                                height: 22,
                                tintColor: !focused ? 'grey' : '#1D9BF0'
                            }}
                        />
                        <Text
                            style={{
                                color: !focused ? 'grey' : '#1D9BF0',
                                marginTop: 3,
                            }}>Search</Text>
                    </View>
                )
            }} />
            <Tab.Screen
                name="Scan"
                component={Scan}
                listeners={{
                    tabPress: e => {
                        e.preventDefault();
                    },
                }}
                options={{
                    headerStyle: { backgroundColor: COLORS.primaryColor },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <TouchableOpacity onPress={toggleModal}>
                                <Image
                                    source={require('../../assets/img/icon/scan-icon.png')}
                                    resizeMode='contain'
                                    style={{
                                        marginTop: 15,
                                        width: 55,
                                        height: 55,
                                        tintColor: '#1D9BF0',
                                    }}
                                />
                            </TouchableOpacity>

                            <Modal
                                animationIn={"fadeInUp"}
                                isVisible={isModalVisible}
                                animationInTiming={300}
                                animationOutTiming={300}
                                customBackdrop={
                                    <TouchableWithoutFeedback onPress={toggleModal}>
                                        <View style={styles.backDropView} />
                                    </TouchableWithoutFeedback>
                                }
                            >
                                <TouchableWithoutFeedback onPress={toggleModal}>
                                    <View style={styles.backDropTransparentView} >

                                        <View style={styles.modalView}>
                                            <TouchableOpacity onPress={qrcodeNavigater} style={styles.popUpIconContainer}>
                                                <Image
                                                    source={require('../../assets/img/icon/qrcode.png')}
                                                    resizeMode='contain'
                                                    style={styles.popUpIcon}
                                                />
                                                <Text style={styles.popUpText}>QRcode</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={cameraNavigater} style={styles.popUpIconContainer}>
                                                <Image
                                                    source={require('../../assets/img/icon/camera.png')}
                                                    resizeMode='contain'
                                                    style={styles.popUpIcon}
                                                />
                                                <Text style={styles.popUpText}>Upload</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={albumNavigater} style={styles.popUpIconContainer}>
                                                <Image
                                                    source={require('../../assets/img/icon/gallery.png')}
                                                    resizeMode='contain'
                                                    style={styles.popUpIcon}
                                                />
                                                <Text style={styles.popUpText}>Create</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </TouchableWithoutFeedback>

                            </Modal>
                        </View>
                    ),


                }} />
            <Tab.Screen name="Event" component={Event} options={{
                headerShown: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image
                            source={require('../../assets/img/icon/event.png')}
                            resizeMode='contain'
                            style={{
                                width: 22,
                                height: 22,
                                tintColor: !focused ? 'grey' : '#1D9BF0'
                            }}
                        />
                        <Text
                            style={{
                                color: !focused ? 'grey' : '#1D9BF0',
                                marginTop: 3,
                            }}>Event</Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Me" component={Me} options={{
                headerShown: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image
                            source={require('../../assets/img/icon/me.png')}
                            resizeMode='contain'
                            style={{
                                width: 22,
                                height: 22,
                                tintColor: !focused ? 'grey' : '#1D9BF0'
                            }}
                        />
                        <Text
                            style={{
                                color: !focused ? 'grey' : '#1D9BF0',
                                marginTop: 3,
                            }}>Me</Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'grey',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: -5
    },

    backDropTransparentView: {
        flex: 1,
        marginTop: 90,
        backgroundColor: "transparent",
    },
    backDropView: {
        flex: 1,
        marginBottom: 90,
        backgroundColor: "#000000aa",
    },
    modalView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 0,
        elevation: 5,
        bottom: 80,
        width: "100%",
        height: 75,
        marginLeft: 0,
        marginRight: 0,
    },
    popUpIconContainer: {
        justifyContent: "center",
        alignItems: "center",

    },
    popUpIcon: {
        marginTop: 8,
        width: 35,
        height: 35,
        tintColor: "#1D9BF0"
    },
    popUpText: {
        color: '#1D9BF0',
        marginTop: 1,
    },
    notificationIcon: {
        width: 12,
        height: 12,
        borderRadius: 100,
        // backgroundColor: '#D41211',
        backgroundColor: COLORS.notificationRed,
        position: 'absolute',
        top: -10,
        right: 1
    },
    hideNotificationIcon: {
        position: 'absolute'
    }
})


export default Footer
