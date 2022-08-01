import React, { useEffect, useInsertionEffect, useRef, useState } from "react"
import { Text, View, TextInput, StyleSheet, Image, Alert, Pressable } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DatePicker from 'react-native-date-picker'
import ImagePicker from 'react-native-image-crop-picker';


const EventCreate = (props: any) => {

    const { eventId } = props.route.params

    const [eventData, setEventData] = useState<any>()

    const [dateOpen, setDateOpen] = useState(false)
    const [startTimeOpen, setStartTimeOpen] = useState(false)
    const [endTimeOpen, setEndTimeOpen] = useState(false)

    const [eventHost, setEventHost] = useState("");
    const [eventLocation, setEventLocation] = useState('');
    const [eventAddress, setEventAddress] = useState('');
    const [eventParticipant, setEventParticipant] = useState<number | any>(null)
    const [eventDescription, setEventDescription] = useState('')
    const [eventBannerImage, setEventBannerImage] = useState<any>(null)

    const [disable, setDisable] = useState(false)
    const [errorPopper, setErrorPopper] = useState(false)
    const [successPopper, setSuccessPopper] = useState(false)
    const [groups, setGroups] = useState<any[]>([])
    const [groupsError, setGroupsError] = useState(false)


    useEffect(() => {
        try {
            fetchEventById()
        } catch (error) {
            console.log("error", error);
        }
    }, [])

    useEffect(() => {
        const uniqueNames = new Set(groups.map(v => v.group_name));
        if (uniqueNames.size < groups.length) {
            setGroupsError(true)
        } else {
            setGroupsError(false)

        }
    }, [groups])

    useEffect(() => {
        if (eventData && Object.keys(eventData).length > 0) {
            console.log('>>>>>', eventData)
            setEventHost(eventData.organiser)
            setEventLocation(eventData.location)
            setEventAddress(eventData.event_address)
            setEventParticipant(eventData.estimated_participant)
            setEventDescription(eventData.description)
            setGroups(eventData.groupList)
        }

    }, [eventData])

    const updateEventData = (key: string, value: any) => {
        console.log(`Updating data , key : ${key} ; value : ${value}`);

        setEventData((current: any) => {
            return { ...current, [key]: value }
        })
    }

    // ---------------------- Fetch ------------------------------------

    const fetchEventById = async () => {
        const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `events/${eventId}`)
        const data = await res.json()
        const eventInfo = data.data
        console.log('fetch event by id (edit Page):', eventInfo)
        setEventData({
            ...eventInfo,
            start_date_time: new Date(eventInfo.start_date_time),
            end_date_time: new Date(eventInfo.end_date_time)
        })
    }

    const onSubmit = async () => {

        setDisable(true)
        console.log(JSON.stringify(groups));

        const event: any = {
            name: eventData.name,
            organiser: eventHost,
            start_date_time: eventData.start_date_time.toUTCString(),
            end_date_time: eventData.end_date_time.toUTCString(),
            location: eventLocation,
            event_address: eventAddress,
            estimated_participant: 0 || eventParticipant,
            description: eventDescription,
            group_names: groups
        }
        console.log(event)
        if (!eventData.name || !eventData.name.trim()) {
            console.log("eventName")

            Alert.alert('Please Enter Event Name');
            return;
        }
        if (!eventHost || !eventHost.trim()) {
            console.log("eventHost")

            Alert.alert('Please Enter Event Host');
            return;
        }
        if (!eventLocation || !eventLocation.trim()) {
            console.log("eventLocation")

            Alert.alert('Please Enter Event Location');
            return;
        }
        // if (!groupList || !groupList.trim()) {
        //     console.log("groupList")

        //     Alert.alert('Please Enter group');
        //     return;
        // }
        console.log(event)

        let eventSubmitData = new FormData();
        for (let key in event) {
            if (key === 'group_names') {
                console.log('group > ', event[key])
                for (let i = 0; i < event[key].length; i++) {
                    console.log(' for i group:', event[key][i])
                    eventSubmitData.append("group_names_" + i, JSON.stringify(event[key][i]));
                }
                continue
            }
            eventSubmitData.append(key, event[key]);
        }




        if (eventBannerImage !== null) {
            eventSubmitData.append('banner_image', {
                uri: eventBannerImage.uri,
                type: 'image/jpg',
                name: 'banner_image.jpg',
            });

        } else {
            // eventSubmitData.append('banner_image', 'default')
        }


        console.log("Fetch Event Edit: ", process.env.REACT_NATIVE_APP_HOSTING + `updateEventDetail/${eventId}`)

        console.log('event edit eventSubmitData(form data):', eventSubmitData)

        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `updateEventDetail/${eventId}`, {
            method: 'PATCH',
            body: eventSubmitData
        });

        console.log("Check res (edit event) : ", res)

        if (res.status.toString().startsWith("5")) {
            console.log("Internal create event error")
            setDisable(false)
            setErrorPopper(true)
            return
        }

        let result = await res.json()
        console.log("Check create event result: ", result)

        if (res.status.toString().startsWith("4")) {
            console.log(result.message)
            setDisable(false)
            setErrorPopper(true)
            return
        }
        if (res.ok) {
            console.log("Create event success")
            setDisable(false)
            setSuccessPopper(true)
            setTimeout(() => {
                props.navigation.navigate("Event")
            }, 1000);
        }

    }

    // ---------------------- Date and Time and Image----------------------------

    // function removeTime(inputDateString: string) {
    //     let inputDate = new Date(inputDateString)
    //     let userTimezoneOffset = inputDate.getTimezoneOffset() * 60000;
    //     let result = new Date(inputDate.getTime() + userTimezoneOffset);
    //     return result;

    // }

    const getPreciseTime = (time: any) => {
        if (time.toLocaleTimeString('en-CA').slice(0, 2) === '10' || time.toLocaleTimeString('en-CA').slice(0, 2) === '11' || time.toLocaleTimeString('en-CA').slice(0, 2) === '12') {
            // return time.toLocaleTimeString('en-CA').slice(0, 5) + time.toLocaleTimeString('en-CA').slice(8)
            return time.toLocaleTimeString('en-CA').slice(0, 5)
        }
        // return time.toLocaleTimeString('en-CA').slice(0, 4) + time.toLocaleTimeString('en-CA').slice(7)
        return time.toLocaleTimeString('en-CA').slice(0, 4)
    }

    // const getTimeMeridiem = (time: any) => {
    //     if (time.toLocaleTimeString('en-CA').slice(0, 2) === '10' || time.toLocaleTimeString('en-CA').slice(0, 2) === '11' || time.toLocaleTimeString('en-CA').slice(0, 2) === '12') {
    //         return time.toLocaleTimeString('en-CA').slice(0, 5) + time.toLocaleTimeString('en-CA').slice(8)
    //     }
    //     return time.toLocaleTimeString('en-CA').slice(0, 4) + time.toLocaleTimeString('en-CA').slice(7)
    // }

    const eventImagePicker: any = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 1500,
                height: 1000,
                cropping: true,
                freeStyleCropEnabled: true
            })
            setEventBannerImage({ uri: image.path })
        }
        catch (err: any) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    }

    const DatePickerBtn: any = () => {
        return (
            <View>
                <DatePicker
                    mode='date'
                    modal
                    open={dateOpen}
                    date={new Date(
                        eventData.start_date_time.getFullYear(),
                        eventData.start_date_time.getMonth(),
                        eventData.start_date_time.getDate(),
                        eventData.start_date_time.getHours(),
                        eventData.start_date_time.getMinutes(),
                    )}
                    onConfirm={(date) => {
                        console.log('updateing date to ', date)
                        setDateOpen(false)
                        updateEventData("start_date_time", date)
                    }}
                    onCancel={() => {
                        setDateOpen(false)
                    }}
                    title={'Event Date'}
                />
                <TouchableOpacity onPress={() => setDateOpen(true)} >
                    <Image source={require('../../assets/img/icon/date.png')} style={styles.dateIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    const StartTimePickerBtn: any = () => {
        return (
            <View>
                <DatePicker
                    mode='time'
                    modal
                    open={startTimeOpen}
                    date={eventData.start_date_time}
                    onConfirm={(pickerDate) => {
                        setStartTimeOpen(false)
                        let year = (new Date(eventData.start_date_time).getFullYear())
                        let month = (new Date(eventData.start_date_time).getMonth())
                        let date = (new Date(eventData.start_date_time).getDate())
                        console.log({ year, month });

                        let updatedDate = new Date(year, month, date, pickerDate.getHours(), pickerDate.getMinutes(), pickerDate.getMinutes())
                        updateEventData("start_date_time", updatedDate)
                        // setStartTime(date)
                    }}
                    onCancel={() => {
                        setStartTimeOpen(false)
                    }}
                    title={'Start Time'}
                />
                <TouchableOpacity onPress={() => setStartTimeOpen(true)} >
                    <Image source={require('../../assets/img/icon/clock.png')} style={styles.dateIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    const EndTimePickerBtn: any = () => {
        return (
            <View>
                <DatePicker
                    mode='time'
                    modal
                    open={endTimeOpen}
                    date={eventData.end_date_time}
                    // onConfirm={(date) => {
                    //     setEndTimeOpen(false)
                    //     setEndTime(date)
                    // }}
                    onConfirm={(pickerDate) => {
                        setEndTimeOpen(false)
                        let year = (new Date(eventData.end_date_time).getFullYear())
                        let month = (new Date(eventData.end_date_time).getMonth())
                        let date = (new Date(eventData.end_date_time).getDate())
                        console.log({ year, month });

                        let updatedDate = new Date(year, month, date, pickerDate.getHours(), pickerDate.getMinutes(), pickerDate.getMinutes())
                        updateEventData("end_date_time", updatedDate)
                        // setStartTime(date)
                    }}
                    onCancel={() => {
                        setEndTimeOpen(false)
                    }}
                    title={'End Time'}
                />
                <TouchableOpacity onPress={() => setEndTimeOpen(true)} >
                    <Image source={require('../../assets/img/icon/clock.png')} style={styles.dateIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    return (

        <View>
            {eventData !== undefined
                ?
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.eventImageContainer}>
                        <TouchableOpacity style={styles.eventImage} onPress={eventImagePicker}>
                            {/* <Text>
                                {JSON.stringify(eventBannerImage)} - {eventData.banner_image}
                            </Text> */}
                            {(!eventBannerImage || eventBannerImage == null || eventBannerImage == undefined) && !eventData.banner_image ?
                                <View>
                                    <View style={styles.uploadImageContainer}>
                                        <Image source={require('../../assets/img/icon/upload.png')} style={styles.uploadLogo} />
                                        <Text style={{ color: '#babbba' }}>Upload Banner Here</Text>
                                    </View>
                                </View>
                                :
                                <View>
                                    {eventBannerImage ? <Image style={styles.selectedBannerImage} source={eventBannerImage} /> : <Image style={styles.selectedBannerImage} source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${eventData.banner_image}` }} />}
                                </View>
                            }


                        </TouchableOpacity>
                    </View>

                    <View style={styles.eventContainer}>
                        <Text style={styles.label}>Event

                        </Text>
                        <View style={styles.infoContainer}>

                            <TextInput
                                style={styles.input}
                                onChangeText={(newEventName) => updateEventData("name", newEventName)}
                                value={eventData.name}
                                // onChangeText={(newEventName) => setEventName(newEventName)}
                                // value={eventName}
                                placeholder='Event Name'
                            />

                        </View>
                        <Text style={styles.label}>Host</Text>
                        <View style={styles.infoContainer}>

                            <TextInput
                                style={styles.input}
                                onChangeText={(newEventHost) => updateEventData("organiser", newEventHost)}
                                value={eventData.organiser}
                                // onChangeText={(newEventHost) => setEventHost(newEventHost)}
                                // value={eventHost}
                                placeholder='Host Name'
                            />

                        </View>
                    </View>

                    <View style={styles.eventContainer}>
                        <Text style={styles.label}>Date</Text>
                        <View style={styles.dateContainer}>
                            <TextInput
                                style={styles.dateInput}
                                value={eventData.start_date_time.toDateString()}
                            // value={date.toDateString()}
                            // placeholder={date.toDateString()}
                            />
                            <DatePickerBtn />

                        </View>
                        <Text style={styles.label}>Start Time</Text>
                        <View style={styles.dateContainer}>

                            <TextInput
                                style={styles.dateInput}
                                value={getPreciseTime(eventData.start_date_time)}
                            // value={getTimeMeridiem(date)}
                            // placeholder={getTimeMeridiem(startTime)}
                            />
                            <StartTimePickerBtn />

                        </View>
                        <Text style={styles.label}>End Time</Text>
                        <View style={styles.dateContainer}>

                            <TextInput
                                style={styles.dateInput}
                                value={getPreciseTime(eventData.end_date_time)}
                            // value={getTimeMeridiem(endTime)}
                            // placeholder={getTimeMeridiem(endTime)}
                            />
                            <EndTimePickerBtn />

                        </View>
                    </View>

                    <View style={styles.eventContainer}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.infoContainer}>

                            <TextInput
                                style={styles.input}
                                onChangeText={(newEventHost) => updateEventData("location", newEventHost)}
                                value={eventData.location}
                                // onChangeText={(newEventLocation) => setEventLocation(newEventLocation)}
                                // value={eventLocation}
                                placeholder='Location  (e.g. xxx Centre)'
                            />

                        </View>
                        <Text style={styles.label}>Address</Text>
                        <View style={styles.infoContainer}>

                            <TextInput
                                style={styles.input}
                                onChangeText={(newEventAddress) => updateEventData("event_address", newEventAddress)}
                                value={eventData.event_address}
                                // onChangeText={(newEventAddress) => setEventAddress(newEventAddress)}
                                // value={eventAddress}
                                placeholder='Full Address'
                            />

                        </View>
                        <Text style={styles.label}>Participant Number </Text>
                        <View style={styles.infoContainer}>

                            <TextInput
                                style={styles.input}
                                onChangeText={(newEventParticipant) =>
                                    updateEventData("estimated_participant", parseInt(newEventParticipant) || 0)}
                                value={eventData.estimated_participant + ""}
                                // onChangeText={(newEventParticipant) => setEventParticipant(parseInt(newEventParticipant))}
                                // value={eventParticipant + ""}
                                placeholder={'0'}
                                keyboardType='numeric'
                                maxLength={5}
                            />

                        </View>
                    </View>

                    <View style={styles.eventContainer}>
                        <Text style={styles.label}>Description</Text>
                        <View style={styles.infoContainer}>

                            <TextInput
                                style={styles.descriptionTextArea}
                                multiline={true}
                                numberOfLines={30}
                                onChangeText={(newEventDescription) => updateEventData('description', newEventDescription)}
                                value={eventData.description}
                            // onChangeText={(newEventDescription) => setEventDescription(newEventDescription)}
                            // value={eventDescription}
                            />

                        </View>
                    </View>
                    <View style={styles.eventContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Group</Text>
                            <TouchableOpacity style={styles.eventGroupAddBtn}
                                onPress={() => {
                                    setGroups((currentGrps) => {
                                        return [...currentGrps, {
                                            groupId: null,
                                            name: ''
                                        }]
                                    })
                                }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoContainer}>
                            {groups.length > 0 && groups.map((groupName, index) => {
                                return <View key={index}>
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setGroups((t) => {
                                                    t.splice(index, 1)
                                                    return [...t]
                                                })
                                            }}
                                            style={styles.removeGroup}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>-</Text>
                                        </TouchableOpacity>

                                        {/* <Text>val{JSON.stringify(groupName)}</Text> */}

                                        <TextInput
                                            style={styles.groupInput}
                                            onChangeText={value => {
                                                setGroups(t => {
                                                    t[index].group_name = value
                                                    console.log('updated groups = ', groups)
                                                    return [...t]
                                                })
                                            }}
                                            value={groupName.group_name}
                                            placeholder={`Group ${index + 1}`}
                                        />
                                    </View>
                                </View>
                            })}
                            {
                                groupsError && <Text style={{ color: 'orange' }}>Group Name Duplicated</Text>
                            }
                        </View>
                    </View>

                    <View>
                        {successPopper ?
                            <View style={styles.submitPopMessage}>
                                <Text style={styles.submitSuccessMessage}>Edit Event Success</Text>
                            </View>
                            :
                            <View></View>
                        }
                        {errorPopper ?
                            <View style={styles.submitPopMessage}>
                                <Text style={styles.submitFailedMessage}>Edit Event Fail</Text>
                            </View>
                            :
                            <View></View>
                        }

                    </View>

                    <View style={styles.createBtnContainer}>

                        <TouchableOpacity style={styles.createBtn} onPress={() => onSubmit()} disabled={disable && !groupsError}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Update</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#1D9BF0' }}>Loading...</Text>
                </View>

            }

        </View>
    )
}

const styles = StyleSheet.create({
    eventImageContainer: {
        backgroundColor: '#ffffff',
        height: 210,
        marginTop: 20,
        justifyContent: 'center',
    },
    uploadImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d1d0cf',
        height: 200,
        backgroundColor: '#f1f1f1',
        position: "relative",
    },
    eventImage: {
        height: 200,
        marginHorizontal: 20,
        position: "relative",
        justifyContent: 'center'
    },
    uploadLogo: {
        tintColor: '#babbba',
        width: 30,
        height: 30,
        marginBottom: 15
    },
    selectedBannerImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover'
    },
    eventContainer: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: 'auto',
        marginTop: 20,
    },
    infoContainer: {
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        marginLeft: 10,
        marginVertical: 10,
        color: '#444444',
        fontWeight: 'bold'
    },
    input: {
        width: 400,
        height: 50,
        borderBottomWidth: 0.5,
        borderColor: 'grey',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
        fontSize: 20
    },
    requiredMessage: {
        color: 'red'
    },
    dateContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    dateInput: {
        width: 320,
        height: 50,
        borderBottomWidth: 0.5,
        borderColor: 'grey',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
        marginLeft: 10,
        fontSize: 20

    },
    dateIcon: {
        color: '#1D9BF0',
        marginRight: 30,
        marginBottom: 20,
        width: 30,
        height: 30,
        tintColor: '#1D9BF0'
    },
    descriptionTextArea: {
        width: 400,
        height: 200,
        borderWidth: 0.5,
        borderColor: 'grey',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
        fontSize: 20
    },
    createBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    createBtn: {
        marginBottom: 100,
        marginTop: 20,
        width: 90,
        height: 40,
        backgroundColor: '#1D9BF0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    submitPopMessage: {
        alignItems: 'center',
        marginTop: 18
    },
    submitSuccessMessage: {
        fontSize: 15,
        color: 'green',
    },
    submitFailedMessage: {
        fontSize: 15,
        color: 'red',
    },
    eventGroupAddBtn: {
        width: 22,
        height: 22,
        backgroundColor: '#1D9BF0',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    removeGroup: {
        marginHorizontal: 15,
        width: 22,
        height: 22,
        backgroundColor: '#cccccc',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupInput: {
        width: 350,
        height: 50,
        borderBottomWidth: 0.5,
        borderColor: 'grey',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
        fontSize: 20
    }
})

export default EventCreate
