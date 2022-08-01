import React, { useEffect, useLayoutEffect, useState } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../screens/PublicCard";
import { View, Image, Text, StyleSheet, TouchableOpacity, Pressable, Alert, TouchableWithoutFeedback, SafeAreaView, TextInput, StatusBar, Platform, TouchableNativeFeedback } from "react-native";
import Modal from "react-native-modal";
import COLORS from "../../conts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import CardholderSearch from "../screens/CardholderSearch";
import PublicCard from "../screens/PublicCard";
import SuggestCard from "../screens/SuggestCard";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { faFilter, faMagnifyingGlass, faRotate, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getCardByID } from "../../redux/card/thunks";
import { useDispatch } from "react-redux";


const Tab = createMaterialTopTabNavigator();


const SearchCard = (props: any) => {
    const dispatch = useDispatch()
    const [isModalVisible, setModalVisible] = useState(false);
    const [keyWord, setKeyword] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pagePosition, setPagePosition] = useState(0)
    const [disable, setDisable] = useState(false)

    let index = 0 //will not update in render by update in scripte
    let inputedKeyword = ""

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View style={styles.iconBar}>
                    <View style={styles.iconButtonContainer}>
                        <TouchableOpacity style={styles.iconButton} disabled={disable} onPress={() => refreshPage()}>
                            <FontAwesomeIcon icon={faFilter} style={{ color: COLORS.white }} size={18} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconButtonContainer}>
                        <TouchableOpacity style={styles.iconButton} disabled={disable} onPress={() => refreshPage()}>
                            <FontAwesomeIcon icon={faRotate} style={{ color: COLORS.white }} size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        });
    }, [props.navigation]);

    useEffect(() => {
        index = pageIndex
    }, []);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const changeTab = (i) => {
        index = i
        setPageIndex(index)
        setKeyword('')
        console.log("page index changed - ", index);
        console.log("set page index changed - ", pageIndex);
        // switch (index) {
        //     case 0:
        //        // props.navigation.navigate('My Card', { keyword: inputedKeyword }); //, { names: ['Brent', 'Satya', 'Michaś'] }
        //         break
        //     case 1:
        //        // props.navigation.navigate('Public', { keyword: inputedKeyword });
        //         console.log('navigate to page 1')
        //         break
        //     case 2:
        //        // props.navigation.navigate('Suggestion', { keyword: inputedKeyword });
        //         break
        // }
    }

    const refreshPage = () => {
        setDisable(true)
        console.log("refresh page: ", index)
        switch (index) {
            case 0:
                props.navigation.navigate('My Card', { keyword: inputedKeyword }); //, { names: ['Brent', 'Satya', 'Michaś'] }
                break
            case 1:
                props.navigation.navigate('Public', { keyword: inputedKeyword });
                console.log('navigate to page 1 - ', inputedKeyword)
                break
            case 2:
                props.navigation.navigate('Suggestion', { keyword: inputedKeyword });
                break
        }
        setTimeout(() => { setDisable(false) }, 5000)
    }

    const onChangeKeyword = (index, text) => {
        setKeyword(text)
        switch (index) {
            case 0:
                props.navigation.navigate('My Card', { keyword: text }); //, { names: ['Brent', 'Satya', 'Michaś'] }
                console.log('navigate to page 0')
                break
            case 1:
                props.navigation.navigate('Public', { keyword: text });
                console.log('navigate to page 1')
                break
            case 2:
                props.navigation.navigate('Suggestion', { keyword: text });
                break
        }
        
        inputedKeyword=text
        // if (index === 1)
        //     props.navigation.navigate('Public', { keyword: text });
        console.log('changing text: ', text)
    }

    const cardDetail = async (cardId:string) => {
        console.log('Card detail card id: ', cardId)
        try{
            await dispatch(getCardByID(cardId)).unwrap()
            props.navigation.navigate("CardDetail")
        }catch(e){
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            {/*   <Text>Current Page: {pageIndex}</Text> */}
            <View>
                <View style={styles.searchBar}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: COLORS.black }} size={18} />
                    <TextInput
                        style={styles.searchBarText}
                        placeholder='Search cards here'
                        onChangeText={(text) => onChangeKeyword(pageIndex, text)}
                        value={keyWord}
                    />
                    <TouchableNativeFeedback onPress={() => onChangeKeyword(pageIndex, '')}>
                        <View>
                            <FontAwesomeIcon icon={faXmark} style={{ color: COLORS.black }} size={18} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>

            <Tab.Navigator screenOptions={{
                tabBarStyle: [{ ...styles.shadow }],

            }}>
                <Tab.Screen name="My Card" component={CardholderSearch}
                    initialParams={{
                        onChangeTab: (index) => {
                            changeTab(0)
                        },
                        toCardDetail: (cardId) => {
                            cardDetail(cardId)
                        }
                    }} />
                <Tab.Screen name="Public" component={PublicCard}
                    initialParams={{
                        onChangeTab: (index) => {
                            changeTab(1)
                        },
                        toCardDetail: (cardId) => {
                            cardDetail(cardId)
                        }
                    }} />
                {/* <Tab.Screen name="Suggestion" component={SuggestCard}
                    initialParams={{
                        onChangeTab: (index) => {
                            changeTab(2)
                        },
                        toCardDetail: (cardId) => {
                            cardDetail(cardId)
                        }
                    }} /> */}
            </Tab.Navigator>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    iconBar: {
        //width:'90%',
        margin: 5,
        //flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    iconButtonContainer: {
        margin: 5,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: COLORS.white,
        padding: 5
    },
    iconButton: {
        // margin: 5,
        //marginHorizontal: 20,
    },
    searchBar: {
        //width:'90%',
        margin: 5,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#c5c6c6',
    },
    searchBarText: {
        width: '100%',
        height: 50,
        fontSize: 20,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
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
        backgroundColor: COLORS.white,
        position: 'absolute',
        top: -10,
        right: 1
    },
    hideNotificationIcon: {
        position: 'absolute'
    }
})


export default SearchCard
