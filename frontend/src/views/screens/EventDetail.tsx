import React, { useEffect, useRef, useState } from "react"
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import COLORS from "../../conts/colors"
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../../redux/event/thunks";
import { EventInfo, IEventState } from "../../redux/event/state";
import { TextInput } from "react-native-gesture-handler";


const EventDetail = (props: any) => {

    const { eventId } = props.route.params
    console.log(' EventDetail event id :', eventId)

    const [isModalVisible, setModalVisible] = useState(false);
    const [isNoteModalVisible, setNoteModalVisible] = useState(false);
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);
    const [eventNoteContent, setEventNoteContent] = useState('')

    const [eventData, setEventData] = useState<any>()
    console.log('eventData state : ', eventData)
    // console.log('eventData state .data (event detail) : ', eventData.data.groupList)
    // const [eventStatus, setEventStatus] = useState(eventData ? eventData.data.status : '')

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleNoteModal = () => {
        setNoteModalVisible(!isNoteModalVisible);
    };

    const toggleStatusModal = () => {
        setStatusModalVisible(!isStatusModalVisible);
    };


    useEffect(() => {
        fetchEventById()
            .catch(console.error);
        // setToggleRefresh(true)
    }, [])


    const fetchEventById = async () => {
        const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `events/${eventId}`)
        const data = await res.json()
        console.log('fetch event by id (Detail Page):', data)
        setEventData(data)
    }

    const eventStatusBtn = () => {
        if (eventData.data.status == 'prepare') {
            return (
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

                        {eventData.data.status.replace('prepare', 'Preparing')}

                    </Text>
                </View>
            )
        }
        if (eventData.data.status == 'start') {
            return (
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
            )
        }
        if (eventData.data.status == 'end') {
            return (
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
            )
        }
    }


    const onStatusSubmit = async (status: string) => {

        let eventSubmitData = new FormData();


        // eventSubmitData.append('group_names', eventData.data.groupList)
        let event = eventData.data
        for (let key in event) {
            if (key === 'groupList') {
                console.log('group > ', event[key])
                for (let i = 0; i < event[key].length; i++) {
                    console.log(' for i group:', event[key][i])
                    eventSubmitData.append("group_names_" + i, JSON.stringify(event[key][i]));
                }
                continue
            }
            if (key === 'status') {
                eventSubmitData.append('status', status)
                continue

            }
        }

        console.log('event status form data :', eventSubmitData)
        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `updateEventDetail/${eventId}`, {
            method: 'PATCH',
            body: eventSubmitData
        });
        if (res.status.toString().startsWith("5")) {
            console.log("Internal update status error")
            return
        }

        let result = await res.json()
        console.log("Check create event status result: ", result)

        if (res.status.toString().startsWith("4")) {
            console.log(result.message)
            return
        }
        if (res.ok) {
            console.log("Create event success")
            toggleStatusModal()
            fetchEventById()
        }

    }

    const onNoteSubmit = () => {

    }


    return (
        <SafeAreaView >
            <StatusBar barStyle={'light-content'} backgroundColor={COLORS.primaryColor} />

            {eventData && eventData.data && Object.keys(eventData.data).length > 0 ?
                <View>
                    <View style={styles.eventPhotoContainer}>
                        <Image
                            style={styles.eventPhoto}
                            source={eventData.data.banner_image
                                ? { uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${eventData.data.banner_image}` }
                                : require('../../assets/img/other/event-default-image.jpg')
                            } />


                    </View>
                    <View style={styles.eventBtnBar}>
                        <View>
                            <TouchableOpacity style={styles.eventDetailBtn} onPress={toggleModal}>
                                <Image
                                    source={require('../../assets/img/icon/group.png')}
                                    style={styles.eventDetailBtnIcon}
                                />
                                <Text style={styles.eventDetailBtnText}>Group</Text>
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
                                    <View style={styles.backDropTransparentView} ></View>
                                </TouchableWithoutFeedback>

                                <View style={styles.modalView}>
                                    <View style={styles.groupModalHeader}>
                                        <View>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1D9BF0' }}>Group</Text>
                                        </View>
                                        <TouchableOpacity style={{ position: 'absolute', right: 20 }} onPress={toggleModal}>
                                            <Text style={{ color: '#1D9BF0' }}>x</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={{ paddingHorizontal: 15 }}>

                                        {eventData?.data.groupList.map((group: any) => {
                                            return (

                                                <View key={group.id}>

                                                    <TouchableOpacity onPress={() => { props.navigation.navigate("EventGroup", { groupId: group.id, groupName: group.group_name, eventId: eventId }), toggleModal() }} >
                                                        <View style={styles.eventGroupInfo}>
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                                                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#444444' }} numberOfLines={1}>{group.group_name}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                </View>
                                            )
                                        })}


                                    </ScrollView>

                                </View>
                            </Modal>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.eventDetailBtn} onPress={toggleNoteModal}>
                                <Image
                                    source={require('../../assets/img/icon/note.png')}
                                    style={styles.eventDetailBtnIcon}
                                />
                                <Text style={styles.eventDetailBtnText}>Note</Text>
                            </TouchableOpacity>
                            <Modal
                                animationIn={"fadeInUp"}
                                isVisible={isNoteModalVisible}
                                animationInTiming={300}
                                animationOutTiming={300}
                                customBackdrop={
                                    <TouchableWithoutFeedback onPress={toggleNoteModal}>
                                        <View style={styles.backDropView} />
                                    </TouchableWithoutFeedback>
                                }
                            >
                                <TouchableWithoutFeedback onPress={toggleNoteModal}>
                                    <View style={styles.backDropTransparentView} ></View>
                                </TouchableWithoutFeedback>

                                <View style={styles.modalView}>
                                    <View style={styles.groupModalHeader}>
                                        <View>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1D9BF0' }}>Note</Text>
                                        </View>
                                        <TouchableOpacity style={{ position: 'absolute', right: 20 }} onPress={toggleNoteModal}>
                                            <Text style={{ color: '#1D9BF0' }}>x</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={{ paddingHorizontal: 15 }}>
                                        <TextInput
                                            style={styles.eventNoteInfo}
                                            multiline={true}
                                            numberOfLines={30}
                                            onChangeText={(eventNoteContent) => setEventNoteContent(eventNoteContent)}
                                            value={eventNoteContent}
                                        />

                                    </ScrollView>
                                    <TouchableOpacity style={styles.eventNoteSaveBtnContainer} onPress={() => onNoteSubmit()}>
                                        <View style={styles.eventNoteSaveBtn}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>
                        <View>
                            {eventData.data.isHostIdMatchEventId
                                ?
                                <TouchableOpacity style={styles.eventDetailBtn} onPress={() => { props.navigation.navigate("EventEdit", { eventId: eventData.data.id }) }}>
                                    <Image
                                        source={require('../../assets/img/icon/edit.png')}
                                        style={styles.eventDetailBtnIcon}
                                    />
                                    <Text style={styles.eventDetailBtnText}>Edit</Text>
                                </TouchableOpacity>
                                :
                                <View style={styles.eventDetailBtn} >
                                    <Image
                                        source={require('../../assets/img/icon/edit.png')}
                                        style={{ width: 30, height: 30, tintColor: '#dddddd' }}
                                    />
                                    <Text style={{ marginTop: 4, color: '#dddddd', }}>Edit</Text>
                                </View>
                            }

                        </View>
                    </View>

                    <View >
                        <ScrollView >

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                                <View style={styles.events}>
                                    <View style={styles.eventName}>

                                        <Text style={styles.eventNameText} numberOfLines={10}>
                                            {eventData.data.name}
                                        </Text>

                                    </View>

                                    <View style={{ alignItems: 'flex-end' }}>

                                        {eventData.data.isHostIdMatchEventId
                                            ? <TouchableOpacity style={styles.statusEditBtn} onPress={toggleStatusModal}>

                                                {eventStatusBtn()}

                                            </TouchableOpacity>
                                            : <View style={styles.statusEditBtnDisable} >

                                                {eventStatusBtn()}

                                            </View>
                                        }

                                        <Modal
                                            animationIn={"slideInRight"}
                                            animationOut={"slideOutRight"}
                                            isVisible={isStatusModalVisible}
                                            animationInTiming={300}
                                            animationOutTiming={300}
                                            customBackdrop={
                                                <TouchableWithoutFeedback onPress={toggleStatusModal}>
                                                    <View style={{ flex: 1, backgroundColor: 'transparent' }} />
                                                </TouchableWithoutFeedback>
                                            }
                                        >

                                            <View style={styles.StatusModalView}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => { onStatusSubmit('start') }}>
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
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity onPress={() => { onStatusSubmit('end') }}>
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
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity onPress={() => { onStatusSubmit('prepare') }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Image
                                                                    source={require('../../assets/img/icon/rec.png')}
                                                                    style={{
                                                                        width: 18,
                                                                        height: 18,
                                                                        tintColor: '#D0D2D4'
                                                                    }}
                                                                />
                                                                <Text style={styles.eventStatusText}>Preparing</Text>
                                                            </View>

                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                            </View>
                                        </Modal>


                                    </View>



                                    <View style={styles.eventInfo}>
                                        <Image
                                            source={require('../../assets/img/icon/host.png')}
                                            style={styles.eventInfoIcon}
                                        />
                                        <Text style={styles.eventInfoText} numberOfLines={10}>
                                            {eventData.data.organiser}
                                        </Text>
                                    </View>

                                    <View style={styles.eventInfo}>
                                        <Image
                                            source={require('../../assets/img/icon/date.png')}
                                            style={styles.eventInfoIcon}
                                        />
                                        <Text style={styles.eventInfoText} numberOfLines={10}>
                                            {eventData.data.start_date_time?.substring(0, 10)}
                                        </Text>
                                    </View>

                                    <View style={styles.eventInfo}>
                                        <Image
                                            source={require('../../assets/img/icon/clock.png')}
                                            style={styles.eventInfoIcon}
                                        />
                                        <Text style={styles.eventInfoText} numberOfLines={10}>
                                            {new Date(eventData.data.start_date_time).toTimeString().substring(0, 5)}  -  {new Date(eventData.data.end_date_time).toTimeString().substring(0, 5)}
                                        </Text>
                                    </View>

                                    <View style={styles.eventInfo}>
                                        <Image
                                            source={require('../../assets/img/icon/location.png')}
                                            style={styles.eventInfoIcon}
                                        />
                                        <Text style={styles.eventInfoText} numberOfLines={10}>
                                            {eventData.data.location}
                                        </Text>
                                    </View>

                                    <View style={styles.eventInfo}>
                                        <Image
                                            source={require('../../assets/img/icon/address.png')}
                                            style={styles.eventInfoIcon}
                                        />
                                        <Text style={styles.eventInfoText} numberOfLines={10}>
                                            {eventData.data.event_address}
                                        </Text>
                                    </View>

                                    <View style={styles.eventInfo}>
                                        <Image
                                            source={require('../../assets/img/icon/participant.png')}
                                            style={styles.eventInfoIcon}
                                        />
                                        <Text style={styles.eventInfoText} numberOfLines={1}>{eventData.data.estimated_participant}</Text>
                                    </View>

                                </View>

                                <View style={styles.description}>
                                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                        <Image source={require('../../assets/img/icon/description.png')} style={styles.descriptionIcon} />
                                        <Text style={styles.descriptionText}>Description</Text>
                                    </View>
                                    <View style={styles.descriptionContent}>
                                        <Text style={styles.descriptionContentText}>
                                            {eventData.data.description}
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        </ScrollView >
                    </View>
                </View >
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#1D9BF0' }}>Loading...</Text>
                </View>
            }


        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    eventPhotoContainer: {
        backgroundColor: '#fff',
        width: '100%',
        height: 250,
    },
    eventPhoto: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    eventBtnBar: {
        backgroundColor: '#fff',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
    },
    eventDetailBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        width: 137,
        borderRightWidth: 1,
        borderRightColor: '#EBEBEB'
    },
    eventDetailBtnIcon: {
        width: 30,
        height: 30,
        tintColor: '#1D9BF0'
    },
    eventDetailBtnText: {
        marginTop: 4,
        color: '#1D9BF0',
    },
    events: {
        width: '100%',
        height: 'auto',
        backgroundColor: "#fff",
        marginTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
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
        marginTop: 20,
    },
    eventInfoIcon: {
        width: 19,
        height: 19,
        tintColor: 'grey'
    },
    eventInfoText: {
        marginLeft: 20,
        color: "#555555",
        fontWeight: 'bold',
        lineHeight: 20,
        fontSize: 16
    },

    description: {
        width: '100%',
        height: 'auto',
        backgroundColor: "#fff",
        marginTop: 20,
        marginBottom: 700,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    descriptionIcon: {
        width: 22,
        height: 22,
        tintColor: '#555555'
    },
    descriptionText: {
        marginLeft: 20,
        color: "#121212",
        fontWeight: 'bold',
        lineHeight: 21,
        fontSize: 18
    },
    descriptionContent: {
        // marginVertical: 20
        marginTop: 20,
        marginBottom: 300
    },
    descriptionContentText: {
        color: '#555555',
        fontSize: 15,
        lineHeight: 30
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
        bottom: 0,
        width: "100%",
        height: 440,
    },
    groupModalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#ffffff',
        height: 40,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        alignItems: 'center'
    },
    eventGroupInfo: {
        width: '100%',
        height: 60,
        backgroundColor: '#ffffff',
        marginTop: 15,
        borderRadius: 10
    },
    eventNoteInfo: {
        width: '100%',
        height: 330,
        backgroundColor: '#ffffff',
        marginTop: 15,
        fontSize: 20,
    },
    eventNoteSaveBtnContainer: {
        alignItems: 'center',
        marginBottom: 12
    },
    eventNoteSaveBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D9BF0',
        width: 80,
        height: 30,
        borderRadius: 20
    },
    statusEditBtn: {
        borderWidth: 0.5,
        borderColor: '#D0D2D4',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        padding: 10,
    },
    statusEditBtnDisable: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        padding: 10,
    },
    StatusModalView: {
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        width: "105%",
        height: 40,
        justifyContent: 'center',
        top: '53%'
    },
    eventStatusText: {
        marginLeft: 10,
        color: "#D0D2D4",
        fontWeight: 'bold',
        lineHeight: 18,
        fontSize: 15
    },
    eventStatusStartText: {
        marginLeft: 10,
        color: "#079f34",
        fontWeight: 'bold',
        lineHeight: 18,
        fontSize: 15
    },
    eventStatusEndText: {
        marginLeft: 10,
        color: "#b0061c",
        fontWeight: 'bold',
        lineHeight: 18,
        fontSize: 15
    }
})

export default EventDetail