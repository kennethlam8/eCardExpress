import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useMemo } from "react"
import { View, Text, StatusBar, Image, StyleSheet, ScrollView, BackHandler, Alert, Platform } from "react-native"
import { Directions, TouchableOpacity } from "react-native-gesture-handler"
import { useDispatch, useSelector } from "react-redux"
import COLORS from "../../conts/colors"
import { getMyInfo } from "../../redux/userInfo/thunks"
import { IRootState } from "../../redux/state";
import { receiveNotification } from "../../redux/card/action"
import { EventInfo, IEventState } from "../../redux/event/state"
import { fetchEvents } from "../../redux/event/thunks"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation'
import { getAllCard, getCardByID } from "../../redux/card/thunks"
import CardPreview from "../components/CardPreview"
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'


const Home = (props: any) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: IRootState) => state.auth.isLoggedIn)
    const email = useSelector((state: IRootState) => state.auth.email)
    const { requestReceived } = useSelector((state: IRootState) => state.card)
    const { name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic, cardId, firstName } = useSelector((state: IRootState) => state.userInfo);
    const cards = useSelector((state: IRootState) => state.userAllCard.cards);
    let uniqueID = ""

    const backAction = () => {
        BackHandler.exitApp()
        return true;
    };

    const filteredCards = useMemo(() => {
        return cards.filter(card => {
            if (card.card_id != uniqueID) {
                uniqueID = card.card_id
                return card
            }
        })
    }, [cards])


    //redirect to HomePage
    const checkUserLogInStatus = async () => {
        try {
            let values = await AsyncStorage.multiGet(['@email', '@isLoggedIn',])
            let emailByLocalStorage = values[0][1]
            let isLoggedInByLocalStorage = values[1][1]
            // console.log("HOme:" + isLoggedInByLocalStorage)
            // console.log("HOme:" + emailByLocalStorage)
            if (emailByLocalStorage && isLoggedInByLocalStorage || isLoggedIn && email) {
                await dispatch(getMyInfo({ email: emailByLocalStorage || email, isLoggedIn: isLoggedInByLocalStorage || isLoggedIn })).unwrap()
                await dispatch(getAllCard()).unwrap()
                return
            }
            props.navigation.navigate("LoginMain")

        } catch (e) {
            console.log(e)
        }
    }

    const checkCardRequest = async () => {
        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'cardRequested')
        let result = await res.json()
        let cards = result.data
        // console.log("requests :", cards)
        if (cards && cards.length > 0) {
            dispatch(receiveNotification({ requestReceived: true }))
        }
    }

    useEffect(() => {
        checkUserLogInStatus()
        checkCardRequest()
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [isLoggedIn]);

    const cardDetail = async (cardId: string) => {
        try {
            await dispatch(getCardByID(cardId)).unwrap()
            props.navigation.navigate("CardDetail")
        } catch (e) {
            console.log(e)
        }
    }
    const events = useSelector((state: IEventState) => state.events);

    // console.log('home events : ', events)

    useEffect(() => {
        dispatch(fetchEvents())
        const willFocusSubscription = props.navigation.addListener('focus', () => {
            dispatch(fetchEvents())
        });

        return willFocusSubscription;
    }, [])

    const eventToArray = Object.values(events)[0]
    const eventInfo = eventToArray

    // console.log('event info after arrayed :', eventInfo)

    const eventContainer = (event: EventInfo) => {
        return (
            <View key={event.id}>
                <TouchableOpacity onPress={() => { props.navigation.navigate("EventDetail", { eventId: event.id }) }}>
                    <View style={styles.events}>
                        <View style={styles.eventName}>
                            <Text style={styles.eventNameText} numberOfLines={1}>
                                {event.name}
                            </Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/host.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={1}>{event.organiser}</Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/date.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={1}>{event.start_date_time?.substring(0, 10)}</Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/clock.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={1}>
                                {new Date(event.start_date_time).toTimeString().substring(0, 5)}  -  {new Date(event.end_date_time).toTimeString().substring(0, 5)}
                            </Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/location.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={1}>{event.location}</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 20,
                            marginVertical: 15
                        }}>
                            <Image
                                source={require('../../assets/img/icon/rec.png')}
                                style={{
                                    width: 18,
                                    height: 18,
                                    tintColor: '#D0D2D4'
                                }}
                            />
                            <Text style={styles.eventStatusText}>
                                {
                                    event.status == 'prepare'
                                        ? event.status.replace('prepare', 'Preparing')
                                        : event.status
                                }
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }


    return (

        <View style={{ backgroundColor: "#fff", flex: 1, marginTop: Platform.OS !== 'ios' ? -70 : 0 }}>
            <View style={{ backgroundColor: COLORS.primaryColor, height: 300, }}>
                <StatusBar barStyle={'light-content'} backgroundColor={COLORS.primaryColor} />
                <View style={styles.welcomeHeader}>
                    <Text style={styles.welcomeHeaderUser}>Hello {firstName}</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate("CardRequest")}>
                        <View style={styles.notification}>
                            <Image source={require('../../assets/img/icon/notification.png')}
                                style={{ width: 20, height: 20, tintColor: "#fff" }}
                            />
                            {requestReceived ?
                                <View style={styles.notificationIcon}>
                                    {/* <FontAwesomeIcon icon={faCircleExclamation} style={{color:COLORS.notificationRed}} size={12}/> */}
                                </View> : <Text style={styles.hideNotificationIcon}></Text>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Footer", { screen: 'Me' })}>
                        <View style={styles.userIcon}>
                            {profilePic ? <Image source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${profilePic}` }} style={{ height: 60, width: 60, borderRadius: 60 }} resizeMode="cover" /> :
                                <FontAwesomeIcon icon={faUser} style={{ color: COLORS.white }} size={30} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { props.navigation.navigate("Event") }}>
                    <View>
                        <Text style={styles.eventHighlightTitle}>Event Highlight</Text>
                    </View>
                </TouchableOpacity>

            </View>
            <View style={{ backgroundColor: "#F2F3F5", height: 200 }}></View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.eventsContainer}>
                {/* {eventInfo.map((event: EventInfo) => eventContainer(event))} */}
                {
                    eventInfo
                        ? eventInfo.map((event: EventInfo) => eventContainer(event))
                        : <View>
                            <TouchableOpacity onPress={() => { props.navigation.navigate("Event") }}>
                                <View style={styles.events}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        <Text style={{ color: '#999999', fontSize: 20 }}>No event yet</Text>
                                        <Text></Text>
                                        <Text style={{ color: '#999999', fontSize: 20 }}>Click <Text style={{ color: '#1D9BF0' }}>here</Text> to join or create !</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.navigation.navigate("Event") }}>
                                <View style={styles.events}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        <Text style={{ color: '#999999', fontSize: 20 }}>No event yet</Text>
                                        <Text></Text>
                                        <Text style={{ color: '#999999', fontSize: 20 }}>Click <Text style={{ color: '#1D9BF0' }}>here</Text> to join or create !</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </View>
                }

            </ScrollView>
            <View style={styles.recentCardContainer}>
                <View><Text style={styles.recentCard}>Recent Card</Text></View>
                <TouchableOpacity onPress={() => { props.navigation.navigate("SearchCard") }}>
                    <View><Text style={styles.seeAll}>See All  &gt;</Text></View>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.cardsContainer} contentContainerStyle={{ alignItems: 'center', }} >
                {filteredCards.length > 0 ? filteredCards.map((card, key) =>
                    <CardPreview key={key} name={`${card.first_name} ${card.last_name}`} email={card.email} defaultImageIndex={card.default_image_index} imageBg={card.image_bg} imageFormat={card.image_format}
                        address={card.address} title={card.title} company={card.company_name} profilePic={card.profile_pic}
                        telephones={[{ card_id: card.card_id, tel_number: card.tel_number, country_code: card.country_code, category: card.category }]} cardImage={card.card_image}
                        date={card.created_at.split("T")[0]} time={card.created_at.split("T")[1].slice(0, 5)} onPress={() => cardDetail(card.card_id)}
                    ></CardPreview>) : ""}

                {/* <View style={styles.cards}></View>
                <View style={styles.cards}></View> */}
            </ScrollView>

        </View >

    )
}

const styles = StyleSheet.create({
    welcomeHeader: {
        marginTop: 90,
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        borderBottomColor: '#74c3f7',
        paddingBottom: 30
    },
    welcomeHeaderUser: {
        flex: 1,
        fontSize: 30,
        color: '#fff',
        lineHeight: 70,
        fontWeight: 'bold',
        textTransform:'capitalize'
    },
    notification: {
        width: 35,
        height: 35,
        borderRadius: 50,
        backgroundColor: '#0084de',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginRight: 20
    },
    userIcon: {
        width: 60,
        height: 60,
        borderRadius: 60,
        backgroundColor: COLORS.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        overflow: 'hidden',
    },
    // cardWithoutPhoto: {
    //     width: 60,
    //     height: 60,
    //     backgroundColor: COLORS.grey,
    //     borderRadius: 60,
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    eventHighlightTitle: {
        fontSize: 20,
        color: '#fff',
        lineHeight: 70,
        fontWeight: 'bold',
        marginLeft: 20
    },
    eventsContainer: {
        // width: 1000,
        height: 210,
        position: 'absolute',
        top: 260,
        overflow: 'scroll',
        flexDirection: 'row'
    },
    events: {
        width: 330,
        height: '100%',
        backgroundColor: "#fff",
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
    },
    recentCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        height: 65,
        paddingHorizontal: 20,
    },
    recentCard: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#121212"
    },
    seeAll: {
        color: 'grey',
        lineHeight: 75
    },

    eventName: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    eventNameText: {
        color: '#1D9BF0',
        fontWeight: 'bold',
        fontSize: 20
    },
    eventInfo: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 13,
        marginLeft: 20,
    },
    eventInfoIcon: {
        width: 18,
        height: 18,
        tintColor: 'grey'
    },
    eventInfoText: {
        marginLeft: 20,
        color: "#555555",
        fontWeight: 'bold',
        lineHeight: 20,
        fontSize: 15
    },
    eventStatusText: {
        marginLeft: 20,
        color: "#D0D2D4",
        fontWeight: 'bold',
        lineHeight: 20,
        fontSize: 15
    },
    cardsContainer: {
        height: 200,
        // backgroundColor: "black",

    },
    notificationIcon: {
        width: 12,
        height: 12,
        borderRadius: 100,
        // backgroundColor: '#D41211',
        backgroundColor: COLORS.notificationRed,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    hideNotificationIcon: {
        position: 'absolute'
    },
})

export default Home


{/* <TouchableOpacity>
                    <View style={styles.cards}>
                        <View style={styles.recentCardHeader}>
                            <View style={styles.recentCardHeaderView}>
                                <Text style={styles.recentCardHeaderText} numberOfLines={1}>30-6-2022</Text>
                            </View>
                            <View style={styles.recentCardHeaderView}>
                                <Text style={styles.recentCardHeaderText} numberOfLines={1}>17:35</Text>
                            </View>
                            <View
                                style={styles.recentCardHeaderView}>
                                <Text style={styles.recentCardHeaderText} numberOfLines={1}>Central</Text>
                            </View>
                        </View>
                        <View style={styles.recentCardContent}>
                            <View style={{ width: 120, height: 120 }}>
                                <Image
                                    source={require('../../assets/img/card/card-template-01.jpg')}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ marginLeft: 20, marginTop: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D9BF0', marginBottom: 13 }} numberOfLines={1}>Gordon Lau</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555', marginBottom: 13 }} numberOfLines={1}>Curriculum Director</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555' }} numberOfLines={1}>Tecky Academy</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> */}