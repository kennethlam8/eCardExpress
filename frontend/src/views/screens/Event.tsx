import React, { useEffect, useState } from "react"
import { Image, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native"
import { View, Text, StatusBar } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { useDispatch, useSelector } from "react-redux"
import COLORS from "../../conts/colors"
import { IEventState, EventInfo } from "../../redux/event/state"
import { fetchEvents } from "../../redux/event/thunks"
import Modal from "react-native-modal";




const Event = (props: any) => {

    const [isJoinModalVisible, setJoinModalVisible] = useState(false);

    const toggleJoinModal = () => {
        setJoinModalVisible(!isJoinModalVisible);
    };

    const [joinCode, setJoinCode] = useState('')

    const events = useSelector((state: IEventState) => state.events);
    // console.log('events:', events);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchEvents())
        const willFocusSubscription = props.navigation.addListener('focus', () => {
            dispatch(fetchEvents())
        });

        return willFocusSubscription;
    }, [])

    const eventToArray = Object.values(events)[0]
    const eventInfo = eventToArray


    // const joinEventSubmit = (event: EventInfo) => {
    //     if (event.invitation_code == joinCode) {

    //     }
    // }
    const eventStatusBtn = (event: EventInfo) => {
        if (event.status == 'prepare') {
            return (
                <View style={styles.eventInfo}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('../../assets/img/icon/rec.png')}
                            style={{
                                width: 18,
                                height: 18,
                                tintColor: '#D0D2D4'
                            }}
                        />
                        <Text style={styles.eventStatusText}>

                            {event.status.replace('prepare', 'Preparing')}

                        </Text>
                    </View>
                </View>

            )
        }
        if (event.status == 'start') {
            return (
                <View style={styles.eventInfo}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('../../assets/img/icon/rec.png')}
                            style={{
                                width: 18,
                                height: 18,
                                tintColor: '#079f34'
                            }}
                        />

                        <Text style={styles.eventStatusStartText}>Start</Text>
                    </View>
                </View>

            )
        }
        if (event.status == 'end') {
            return (
                <View style={styles.eventInfo}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('../../assets/img/icon/rec.png')}
                            style={{
                                width: 18,
                                height: 18,
                                tintColor: '#b0061c'
                            }}
                        />
                        <Text style={styles.eventStatusEndText}>End</Text>
                    </View>
                </View>

            )
        }
    }

    const eventContainer = (event: EventInfo) => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }} key={event.id}>
                <TouchableOpacity onPress={() => { props.navigation.navigate("EventDetail", { eventId: event.id }) }}>
                    <View style={styles.events}>
                        <View style={styles.eventName}>
                            <Text style={styles.eventNameText} numberOfLines={5}>
                                {event.name}
                            </Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/host.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={5}>{event.organiser}</Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/date.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={2}>
                                {event.start_date_time?.substring(0, 10)}
                            </Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/clock.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={2}>
                                {new Date(event.start_date_time).toTimeString().substring(0, 5)}  -  {new Date(event.end_date_time).toTimeString().substring(0, 5)}
                            </Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Image
                                source={require('../../assets/img/icon/location.png')}
                                style={styles.eventInfoIcon}
                            />
                            <Text style={styles.eventInfoText} numberOfLines={8}>{event.location}</Text>
                        </View>

                        {eventStatusBtn(event)}

                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            <View style={{ backgroundColor: "#fff", height: 140, }}>
                <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
                <View style={styles.eventHeaderContainer}>
                    <View style={{ flex: 1 }}><Text style={styles.eventTitle}>Event</Text></View>
                    <View>
                        <TouchableOpacity style={styles.joinBtn} onPress={toggleJoinModal}>
                            <Text style={styles.btnText}>Join</Text>
                        </TouchableOpacity>
                        <Modal
                            animationIn={"bounceIn"}
                            animationOut={"bounceOut"}
                            isVisible={isJoinModalVisible}
                            animationInTiming={300}
                            animationOutTiming={300}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={toggleJoinModal}>
                                    <View style={styles.backDropView} />
                                </TouchableWithoutFeedback>
                            }
                        >

                            <TouchableWithoutFeedback onPress={toggleJoinModal}>
                                <View style={styles.backDropTransparentView} ></View>
                            </TouchableWithoutFeedback>

                            <View style={styles.modalView}>

                                <View style={styles.groupModalHeader}>

                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1D9BF0' }}>Join Event</Text>
                                    </View>

                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 18, marginHorizontal: 15, position: 'relative' }}>
                                    <View style={styles.joinEventInfoContainer}>
                                        <View>
                                            <Text style={{ color: '#444444' }}>6-digit Invitation Code  :</Text>
                                        </View>
                                        <View>
                                            <TextInput
                                                style={styles.joinEventInput}
                                                placeholder='000000'
                                                onChangeText={(code) => setJoinCode(code)}
                                                value={joinCode}
                                                maxLength={6}
                                                keyboardType='numeric'
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.eventJoinBtn} >
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Modal>

                    </View>
                    <View>
                        <TouchableOpacity style={styles.createBtn} onPress={() => { props.navigation.navigate("EventCreate") }}>
                            <Text style={styles.btnText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }}>

                {eventInfo.map((event: EventInfo) => eventContainer(event))}

            </ScrollView >

        </View >
    )
}

const styles = StyleSheet.create({
    eventHeaderContainer: {
        marginTop: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    eventTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#121212'
    },
    joinBtn: {
        width: 70,
        height: 30,
        backgroundColor: "#1D9BF0",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 4,
        marginRight: 10
    },
    createBtn: {
        width: 70,
        height: 30,
        backgroundColor: "#1D9BF0",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 4
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    events: {
        width: 370,
        height: 'auto',
        backgroundColor: "#fff",
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingBottom: 30,
        shadowColor: 'grey',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: -5,
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
        marginTop: 15,
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
        lineHeight: 16,
        fontSize: 15
    },
    backDropTransparentView: {
        flex: 1,
        marginTop: 90,
        backgroundColor: "transparent",
    },
    backDropView: {
        flex: 1,
        backgroundColor: "#000000aa",
    },
    modalView: {
        flex: 1,
        position: "absolute",
        backgroundColor: "#DDDCDB",
        borderRadius: 10,
        elevation: 5,
        bottom: '50%',
        width: "100%",
        height: 200,
    },
    groupModalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: 40,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        position: 'relative',
    },
    joinEventInfoContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        position: 'relative',
        padding: 10
    },
    eventJoinBtn: {
        backgroundColor: '#1D9BF0',
        width: 70,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        position: 'absolute',
        bottom: -10,
        left: -30,
    },
    joinEventInput: {
        width: '100%',
        height: 50,
        borderWidth: 0.5,
        marginTop: 10,
        borderRadius: 10,
        fontSize: 25,
        borderColor: '#c5c6c6',
        paddingHorizontal: 10
    },
    eventStatusStartText: {
        marginLeft: 20,
        color: "#079f34",
        fontWeight: 'bold',
        lineHeight: 18,
        fontSize: 15
    },
    eventStatusEndText: {
        marginLeft: 20,
        color: "#b0061c",
        fontWeight: 'bold',
        lineHeight: 18,
        fontSize: 15
    }
})


export default Event