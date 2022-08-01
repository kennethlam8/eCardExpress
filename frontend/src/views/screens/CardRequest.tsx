import React, { useState, useEffect } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import COLORS from '../../conts/colors';
import { receiveNotification } from '../../redux/card/action';
import { IRootState } from '../../redux/state';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard'
import { faHandshake } from '@fortawesome/free-solid-svg-icons/faHandshake'
import { faHandHolding } from '@fortawesome/free-solid-svg-icons/faHandHolding'
import { getAllCard } from '../../redux/card/thunks';


export const CardRequest = (props) => {
    const dispatch = useDispatch()
    const [cardRequest, setCardRequest] = useState([]);
    const [disableBtn, setDisableBtn] = useState([]);
    const { requestReceived } = useSelector((state: IRootState) => state.card)
    const [fetching, setFetching] = useState(false);
    const [allowEx, setAllowEx] = useState({});

    async function FetchCardRequest() {
        let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'cardRequested')
        let result = await res.json()
        let cards = result.data
        console.log("requests :", cards)
        setCardRequest(cards)
        let disableButton = []
        for (let card of cards) {
            disableButton.push(false)
        }
        setFetching(false)
        setDisableBtn(disableButton)
    }

    function ResButtonClickable(choice, index) {
        let disableButton = disableBtn
        if (disableButton[index] == undefined) {
            disableButton[index] = false
        } else {
            disableButton[index] = choice
        }
        setDisableBtn([...disableButton])
    }

    function CardExchangeClick(index) {
        let allowExchange = allowEx
        //console.log("cardExchangeClick", allowEx[index])
        if (allowExchange[index] == undefined) {
            allowExchange[index] = false
        } else {
            allowExchange[index] = !allowEx[index]
        }
        setAllowEx({ ...allowExchange })
        //console.log("cardExchangeClick2", allowEx[index])
    }

    useEffect(() => {
        FetchCardRequest()
        dispatch(receiveNotification({ requestReceived: false }))
        //console.log("Initial fetch")

        const refreshCard = props.navigation.addListener('focus', async() => {
            await dispatch(getAllCard()).unwrap()             
        });

        return refreshCard;
    }, []);

    useEffect(() => {
        if (requestReceived && !fetching) {
            setFetching(true)
            FetchCardRequest()
            dispatch(receiveNotification({ requestReceived: false }))
        }
        //console.log("fetch card request ", requestReceived)
    }, [requestReceived]);

    function hasNumber(character) {
        return /\d/.test(character);
    }

    const cardCodeFormat = [false, false, true, true, true, true]
    function codeFormatCheck(code) {
        let codeRequestFormat = []
        code.split("").forEach(function (character) {
            codeRequestFormat.push(hasNumber(character))
        })

        console.log("Code pattern entered: ", codeRequestFormat)
        return codeRequestFormat.sort().join(',') === cardCodeFormat.sort().join(',')
    }

    async function RequestResponse(res, card_id, requestor_id, name, index, allow_ex) {
        ResButtonClickable(false, index)
        console.log("Allow card exchange - ", allowEx[index])
        if (res && codeFormatCheck(card_id)) {
            console.log("Card request accept, allow card exchange? ", (allowEx[index] || allowEx[index] == undefined))
            let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'cardholder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    user_id: requestor_id,
                    card_id: card_id,
                    allow_ex: allow_ex?((allowEx[index] || allowEx[index] == undefined) ? true : false) : false
                }),
            })
            console.log("Check create cardholder result in full: ", res.status)

            if (res.status.toString().startsWith("5")) {
                console.log("Internal request accept error")
                ResButtonClickable(true, index)
                return
            }

            let result = await res.json()
            console.log("Check create cardholder result: ", result)

            if (res.ok) {
                //show toast request accepted
                showToast(`Accepted card request from ${name}`)
                cardRequest.splice(index, 1)
                setCardRequest([...cardRequest])
            }
        } else if (!res && codeFormatCheck(card_id)) {
            console.log("Card request reject")

            let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'cardRequest', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    user_id: requestor_id,
                    card_id: card_id,
                }),
            })
            console.log("Check remove cardholder result in full: ", res.status)

            if (res.status.toString().startsWith("5")) {
                console.log("Internal request accept error - ", res)
                ResButtonClickable(true, index)
                return
            }

            let result = await res.json()
            console.log("Check remove cardholder result: ", result)

            if (res.ok) {
                showToast(`Rejected card request from ${name}`)
                cardRequest.splice(index, 1)
                setCardRequest([...cardRequest])
            }

        } else {
            console.log("Card request fail")
        }
    }

    const showToast = (data) => {
        console.log("showing toast")
        Toast.show({
            type: 'success',
            text1: data,
            topOffset: 5,
            visibilityTime: 1000,
            autoHide: true
        });
    }

    const cardRequestView =
        /* cardRequest.length > 0 ?
            cardRequest.map((card, index) => {
                return (
                    <View style={styles.cardContainer} key={index}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 20,
                        }}>
                            <View>
                                <Text key={"name" + index}>Name: {card.first_name} {card.last_name}</Text>
                                <Text key={"title" + index}>Title: {card.title}</Text>
                                <Text key={"company" + index}>Company: {card.company_name}</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{
                                        flex: 1, marginTop: 5, alignContent: "flex-start",
                                        borderRadius: 1, backgroundColor: ((allowEx[index] || allowEx[index] == undefined) ? COLORS.green : COLORS.light)
                                    }}
                                    onPress={() => {
                                        CardExchangeClick(index)
                                        console.log("on press allow ex")
                                    }}>
                                    <Text>Allow Card</Text>
                                    <Text>Exchange</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{
                            marginTop: 20,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            paddingHorizontal: 20
                        }}>
                            <TouchableOpacity
                                style={styles.acceptBtn}
                                disabled={disableBtn[index]}
                                onPress={() => RequestResponse(false, card.card_requested, card.requestor_id, card.first_name, index, card.event_code)}>
                                <Text style={styles.btnText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rejectBtn}
                                disabled={disableBtn[index]}
                                onPress={() => RequestResponse(true, card.card_requested, card.requestor_id, card.first_name, index, card.event_code)}>
                                <Text style={styles.btnText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View >
                )
            }) : "" */

        cardRequest.length > 0 ?
            cardRequest.map((card, index) => {
                return (
                    <View style={styles.cardContainer} key={index}>                       
                        {card.allow_ex ?
                            <TouchableWithoutFeedback onPress={() => {
                                CardExchangeClick(index)
                                console.log("on press allow ex")
                            }}>
                                <View style={styles.receive}>
                                    <FontAwesomeIcon icon={faIdCard} style={{ color: ((allowEx[index] || allowEx[index] == undefined) ? COLORS.primaryColor : 'grey'), position: "relative", top: 10 }} size={20} />
                                    <FontAwesomeIcon icon={faHandHolding} style={{ color: ((allowEx[index] || allowEx[index] == undefined) ? COLORS.primaryColor : 'grey') }} size={20} />
                                </View>
                            </TouchableWithoutFeedback> : ""
                        }
                        <View style={styles.row}>
                            <Text style={styles.text} key={"name" + index}>Name: {card.first_name} {card.last_name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text} key={"name" + index}>Title: {card.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text} key={"name" + index}>Company: {card.company_name}</Text>
                        </View>
                        {/* <TouchableWithoutFeedback>
                        <View style={styles.pressRow}>
                            <FontAwesomeIcon icon={faIdCard} style={{ color: COLORS.primaryColor }} size={30} />
                            <Text style={{ color: COLORS.primaryColor, fontSize: 24, fontWeight: "600" }} >{"<----->"}</Text>
                            <FontAwesomeIcon icon={faHandshake} style={{ color: COLORS.primaryColor, marginHorizontal: 16 }} size={30} />
                            <FontAwesomeIcon icon={faIdCard} style={{ color: COLORS.primaryColor }} size={30} />
                        </View>
                    </TouchableWithoutFeedback> */}
                        <View style={{
                            marginTop: 20,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            paddingHorizontal: 20
                        }}>
                            <TouchableOpacity
                                style={styles.acceptBtn}
                                disabled={disableBtn[index]}
                                onPress={() => RequestResponse(false, card.card_requested, card.requestor_id, card.first_name, index, card.allow_ex)}>
                                <Text style={styles.btnText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rejectBtn}
                                disabled={disableBtn[index]}
                                onPress={() => RequestResponse(true, card.card_requested, card.requestor_id, card.first_name, index, card.allow_ex)}>
                                <Text style={styles.btnText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }) : ""


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                {cardRequest.length < 1 ? (
                    <Text style={styles.title}>No new request received</Text>
                ) : (
                    <View>
                        {cardRequestView}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    cardContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        marginBottom: 5,
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#F5FCFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    row: {
        flexDirection: "row",
        height: 24,
    },
    text: {
        fontSize: 16,
        textTransform: "capitalize",
    },
    pressRow: {
        height: 50,
        width: "100%",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    receive: {
        height: 40,
        width: 40,
        alignItems: 'center',
        position: 'absolute',
        right: 0,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    acceptBtn: {
        width: 120,
        height: 40,
        backgroundColor: COLORS.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: -10,
        marginRight: 10
    },
    rejectBtn: {
        width: 120,
        height: 40,
        backgroundColor: "#00CA4E",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: -10
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
})