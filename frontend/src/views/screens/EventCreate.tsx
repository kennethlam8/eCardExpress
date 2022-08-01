import React, { useState } from "react"
import { Text, View, TextInput, StyleSheet, Image, Alert } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DatePicker from 'react-native-date-picker'
import ImagePicker from 'react-native-image-crop-picker';


const EventCreate = (props: any) => {
    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())

    const [endTime, setEndTime] = useState(new Date())
    const [dateOpen, setDateOpen] = useState(false)

    const [startTimeOpen, setStartTimeOpen] = useState(false)
    const [endTimeOpen, setEndTimeOpen] = useState(false)

    const [eventName, setEventName] = useState('');
    const [eventHost, setEventHost] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventAddress, setEventAddress] = useState('');
    const [eventParticipant, setEventParticipant] = useState<number | any>(0)
    const [eventDescription, setEventDescription] = useState('')
    const [eventBannerImage, setEventBannerImage] = useState<any>(null)
    const [disable, setDisable] = useState(false)
    const [errorPopper, setErrorPopper] = useState(false)
    const [successPopper, setSuccessPopper] = useState(false)

    const getPreciseTime = (time: any) => {
        if (time.toLocaleTimeString('en-CA').slice(0, 2) === '10' || time.toLocaleTimeString('en-CA').slice(0, 2) === '11' || time.toLocaleTimeString('en-CA').slice(0, 2) === '12') {
            // return time.toLocaleTimeString('en-CA').slice(0, 5) + time.toLocaleTimeString('en-CA').slice(8)
            return time.toLocaleTimeString('en-CA').slice(0, 5)
        }
        // return time.toLocaleTimeString('en-CA').slice(0, 4) + time.toLocaleTimeString('en-CA').slice(7)
        return time.toLocaleTimeString('en-CA').slice(0, 4)
    }
    const getTimeMeridiem = (time: any) => {
        if (time.toLocaleTimeString('en-CA').slice(0, 2) === '10' || time.toLocaleTimeString('en-CA').slice(0, 2) === '11' || time.toLocaleTimeString('en-CA').slice(0, 2) === '12') {
            return time.toLocaleTimeString('en-CA').slice(0, 5) + time.toLocaleTimeString('en-CA').slice(8)
        }
        return time.toLocaleTimeString('en-CA').slice(0, 4) + time.toLocaleTimeString('en-CA').slice(7)
    }

    const eventImagePicker: any = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 2000,
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
                    date={date}
                    onConfirm={(date) => {
                        setDateOpen(false)
                        setDate(date)
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
                    // date={startTime}
                    date={date}
                    onConfirm={(date) => {
                        setStartTimeOpen(false)
                        // setStartTime(date)
                        setDate(date)
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
                    date={endTime}
                    onConfirm={(date) => {
                        setEndTimeOpen(false)
                        setEndTime(date)
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

    const onSubmit = async () => {
        setDisable(true)
        const events: any = {
            name: eventName,
            organiser: eventHost,
            // start_date: date.toLocaleDateString('en-CA'),
            // start_time: getPreciseTime(startTime),
            // end_time: getPreciseTime(endTime),
            location: eventLocation,
            event_address: eventAddress,
            estimated_participant: eventParticipant,
            description: eventDescription,
            start_date_time: date.toUTCString(),
            end_date_time: endTime.toUTCString()
            // banner_image: eventBannerImage,
        }
        console.log(events)
        if (!eventName.trim()) {
            Alert.alert('Please Enter Event Name');
            return;
        }
        if (!eventHost.trim()) {
            Alert.alert('Please Enter Event Host');
            return;
        }
        if (!eventLocation.trim()) {
            Alert.alert('Please Enter Event Location');
            return;
        }

        let eventSubmitData = new FormData();
        for (let event in events) {
            eventSubmitData.append(event, events[event]);
        }

        if (eventBannerImage !== null) {
            eventSubmitData.append('banner_image', {
                uri: eventBannerImage.uri,
                type: 'image/jpg',
                name: 'banner_image.jpg',
            });

        } else {
            eventSubmitData.append('banner_image', 'default')
        }



        console.log("Fetch Event: ", process.env.REACT_NATIVE_APP_HOSTING + `events`)
        console.log('creating event eventSubmitData:', eventSubmitData);

        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `events`, {
            method: 'POST',
            body: eventSubmitData
        });

        console.log("Check res: ", res)

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

    return (
        <View>
            <ScrollView>
                <View style={styles.eventImageContainer}>
                    <TouchableOpacity style={styles.eventImage} onPress={eventImagePicker}>
                        {!eventBannerImage ?
                            <View>
                                <View style={styles.uploadImageContainer}>
                                    <Image source={require('../../assets/img/icon/upload.png')} style={styles.uploadLogo} />
                                    <Text style={{ color: '#babbba' }}>Upload Banner Here</Text>
                                </View>
                            </View>
                            :
                            <View>
                                <Image style={styles.selectedBannerImage} source={eventBannerImage} />
                            </View>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.eventContainer}>
                    <Text style={styles.label}>Event</Text>
                    <View style={styles.infoContainer}>

                        <TextInput
                            style={styles.input}
                            onChangeText={(newEventName) => setEventName(newEventName)}
                            value={eventName}
                            placeholder='Event Name'
                        />

                    </View>
                    <Text style={styles.label}>Host</Text>
                    <View style={styles.infoContainer}>

                        <TextInput
                            style={styles.input}
                            onChangeText={(newEventHost) => setEventHost(newEventHost)}
                            value={eventHost}
                            placeholder='Host Name'
                        />

                    </View>
                </View>

                <View style={styles.eventContainer}>
                    <Text style={styles.label}>Date</Text>
                    <View style={styles.dateContainer}>

                        <TextInput
                            style={styles.dateInput}
                            // value={date.toDateString()}
                            // placeholder={date.toDateString()}
                            value={date.toDateString()}
                        />
                        <DatePickerBtn />

                    </View>
                    <Text style={styles.label}>Start Time</Text>
                    <View style={styles.dateContainer}>

                        <TextInput
                            style={styles.dateInput}
                            // value={getTimeMeridiem(startTime)}
                            // placeholder={getTimeMeridiem(startTime)}
                            value={getTimeMeridiem(date)}

                        />
                        <StartTimePickerBtn />

                    </View>
                    <Text style={styles.label}>End Time</Text>
                    <View style={styles.dateContainer}>

                        <TextInput
                            style={styles.dateInput}
                            value={getTimeMeridiem(endTime)}
                            placeholder={getTimeMeridiem(endTime)}
                        />
                        <EndTimePickerBtn />

                    </View>
                </View>

                <View style={styles.eventContainer}>
                    <Text style={styles.label}>Location</Text>
                    <View style={styles.infoContainer}>

                        <TextInput
                            style={styles.input}
                            onChangeText={(newEventLocation) => setEventLocation(newEventLocation)}
                            value={eventLocation}
                            placeholder='Location  (e.g. xxx Centre)'
                        />

                    </View>
                    <Text style={styles.label}>Address</Text>
                    <View style={styles.infoContainer}>

                        <TextInput
                            style={styles.input}
                            onChangeText={(newEventAddress) => setEventAddress(newEventAddress)}
                            value={eventAddress}
                            placeholder='Full Address'
                        />

                    </View>
                    <Text style={styles.label}>Participant Number</Text>
                    <View style={styles.infoContainer}>

                        <TextInput
                            style={styles.input}
                            onChangeText={(newEventParticipant) => setEventParticipant(parseInt(newEventParticipant))}
                            value={eventParticipant}
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
                            onChangeText={(newEventDescription) => setEventDescription(newEventDescription)}
                            value={eventDescription}
                        />

                    </View>
                </View>

                <View>
                    {successPopper ?
                        <View style={styles.submitPopMessage}>
                            <Text style={styles.submitSuccessMessage}>Create Event Success</Text>
                        </View>
                        :
                        <View></View>
                    }
                    {errorPopper ?
                        <View style={styles.submitPopMessage}>
                            <Text style={styles.submitFailedMessage}>Create Event Fail</Text>
                        </View>
                        :
                        <View></View>
                    }

                </View>

                <View style={styles.createBtnContainer}>

                    <TouchableOpacity style={styles.createBtn} onPress={() => onSubmit()} disabled={disable}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Create</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
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
    }
})

export default EventCreate
