import React, { useEffect, useState } from "react"
import { Button, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import Modal from "react-native-modal/dist/modal";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/state";

let cardIdSent = ""

const EventGroup = (props: any) => {

    const { groupId, groupName, eventId } = props.route.params


    console.log('group props eventId= ', props.route.params.eventId)
    console.log('group props groupId = ', props.route.params.groupId)

    const [isJoinModalVisible, setJoinModalVisible] = useState(false);
    const [participantData, setParticipantData] = useState([])
    const [isRequested, setIsRequested] = useState(false)


    // const participantDataToArray = Object.values(participantData)
    // console.log('participantData: array', participantDataToArray)
    console.log('participantData: ', participantData)

    // const groupParticipantData = participantDataToArray
    // const [groupName, setGroupName] = useState<any>();
    // console.log('fetch event by id state (Group/:id):', groupName)

    const toggleJoinModal = () => {
        setJoinModalVisible(!isJoinModalVisible);
    };
    console.log('groupId (event group) :', groupId)

    const { name, email } = useSelector((state: IRootState) => state.userInfo);


    useEffect(() => {
        getParticipantById()
            .catch(console.error);
    }, [])



    const getParticipantById = async () => {
        const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `eventGroupParticipant/${groupId}`)
        const data = await res.json()
        const participantData = data.data
        setParticipantData(participantData)
        console.log('fetch ---->', participantData)
        // setGroupName(groupData)
    }

    const joinEvent = async (event_id: number, group: number) => {
        console.log('join event:', event_id, group)
        const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `eventGroupParticipant`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                event_id: event_id,
                group: group
            })
        })
        const data = await res.json()
        const groupData = data
        console.log('fetch event by id (Group/:id):', groupData)
        // console.log('fetch event by id (Group/:id):', groupData)
        // setGroupName(groupData)
        if (res.ok) {
            //refetch participant
        }
    }

    async function sendCardRequest(cardId: string) {
        cardIdSent = ""
        console.log("Sending fetch card " + cardId)
        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `cardCode/${cardId}`)

        let result = await res.json()
        console.log("Send request result: ", result)

        if (res.status.toString().startsWith("5")) {
            console.log("Internal create user error - ", result.error)
            return "Internal create user error"
        }

        if (res.status.toString().startsWith("4")) {
            return `"Error: ", ${result.message}`
        }

        if (res.ok) {
            //show success
            console.log("successfully sent card request to ", result.data[0].first_name)
        }
        setIsRequested(true)

        setTimeout(() => {
            setIsRequested(false)
        }, 5000)

    }


    return (
        <View>
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
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1D9BF0' }}>Join Group</Text>
                        </View>

                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 18, marginHorizontal: 15, position: 'relative' }}>
                        <View style={styles.joinEventInfoContainer}>
                            <View>
                                <Text style={{ color: '#444444', textAlign: 'center', fontWeight: 'bold' }}>Are you sure  ?</Text>
                                <Text></Text>
                                <Text style={{ color: '#444444', textAlign: 'center' }}>Your contact will show to all participants</Text>
                            </View>
                            <View style={{ marginTop: 30, marginHorizontal: 20 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 20, width: 250 }}>
                                    <Image source={require('../../assets/img/icon/me.png')} style={styles.infoIcon} />
                                    <Text numberOfLines={2} style={styles.cardContactInfo}>{name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', width: 250 }}>
                                    <Image source={require('../../assets/img/icon/email.png')} style={styles.infoIcon} />
                                    <Text numberOfLines={2} style={styles.cardContactInfo}>{email}</Text>
                                </View>

                            </View>
                            <View style={styles.groupBtnContainer}>
                                <TouchableOpacity onPress={() => { toggleJoinModal() }} >
                                    <View style={styles.cancelBtn}>
                                        <Text style={{ color: '#1D9BF0', fontWeight: 'bold' }}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={async () => {
                                    await joinEvent(eventId, groupId)
                                    toggleJoinModal()
                                    getParticipantById()
                                }}>
                                    <View style={styles.acceptBtn}>
                                        {/* <Button title={'Join'} color={'#fff'} /> */}
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join</Text>
                                    </View>

                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                </View>
            </Modal>
            <View style={{ height: 80 }}>
                <View style={styles.groupHeaderContainer}>
                    <View style={styles.groupHeader}>
                        <View style={{ width: 300 }}>
                            <Text style={styles.groupHeaderText} numberOfLines={1}>{groupName}</Text>
                        </View>
                        <View>
                            {/* <TouchableOpacity onPress={toggleJoinModal}> */}
                            <TouchableOpacity onPress={() => { toggleJoinModal() }}>

                                <View style={styles.joinBtn}>
                                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>Join</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </View>
            <View>
                <ScrollView>
                    {isRequested &&
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#aaaaaa' }}>request has been sent </Text>
                        </View>
                    }

                    <View style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
                        {participantData?.map((data: any, index) => {
                            return <React.Fragment key={index}>
                                <View >
                                    <TouchableOpacity style={styles.cardContainer} onPress={() => sendCardRequest(data.card_id)} >
                                        <View style={{ flexDirection: 'row', marginBottom: 20, width: 250 }}>
                                            <Image source={require('../../assets/img/icon/me.png')} style={styles.infoIcon} />
                                            <Text numberOfLines={2} style={styles.cardContactInfo}>{data.first_name} {data.last_name}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', width: 250 }}>
                                            <Image source={require('../../assets/img/icon/email.png')} style={styles.infoIcon} />
                                            <Text numberOfLines={2} style={styles.cardContactInfo}>{data.email}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Image source={require('../../assets/img/icon/add-user.png')} style={styles.addUserIcon} />
                                        </View>


                                    </TouchableOpacity>
                                </View>
                            </React.Fragment>

                        })

                        }



                    </View>
                    <View style={{ height: 100, marginBottom: 200 }}>

                    </View>

                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    groupHeaderContainer: {
        flex: 1,
        height: 80,
        backgroundColor: '#fff',
        padding: 20
    },
    groupHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    groupHeaderText: {
        color: '#121212',
        fontSize: 25,
        fontWeight: 'bold'
    },
    joinBtn: {
        width: 70,
        height: 30,
        backgroundColor: '#1D9BF0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
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
        bottom: '40%',
        width: "100%",
        height: 340,
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
        height: 260,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 10
    },
    // eventJoinBtn: {
    //     backgroundColor: '#1D9BF0',
    //     width: 70,
    //     height: 30,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 20,
    //     position: 'absolute',
    //     bottom: -105,
    //     left: 127,
    // },
    groupBtnContainer: {
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        width: '100%',
        flexDirection: 'row',
        marginTop: 50
    },
    cancelBtn: {
        width: 70,
        height: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItem: 'center',
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#1D9BF0'
    },
    acceptBtn: {
        // width: 70,
        width: 70,
        height: 30,
        backgroundColor: '#1D9BF0',
        justifyContent: 'center',
        alignItem: 'center',
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    cardContainer: {
        flex: 1,
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 20,
        borderRadius: 20,
        padding: 20
    },
    infoIcon: {
        width: 18,
        height: 18,
        marginRight: 20,
        tintColor: '#1D9BF0'
    },
    whiteIcon: {
        width: 18,
        height: 18,
        marginRight: 20,
        tintColor: '#ffffff'
    },
    addUserIcon: {
        width: 18,
        height: 18,
        tintColor: '#555555'
    },
    cardContactInfo: {
        color: '#444444',
        fontWeight: 'bold',
        fontSize: 15
    }
})

export default EventGroup