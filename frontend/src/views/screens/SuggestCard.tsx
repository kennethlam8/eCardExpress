import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Button } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import COLORS from "../../conts/colors"
import { CardInfo, CardState } from "../../redux/cardSearch/state"
import { fetchCards } from "../../redux/cardSearch/thunks"

const SuggestCard = (props: any) => {
    const dispatch = useDispatch()
    const cards = useSelector((state: CardState) => state.cards);

    const [card, SetCard] = useState([])
    
    //props.route.params.onChangeTab(2)
    
    const pageFetchCards = async () => {
        console.log("fetching cards")
        try {
            let res = await dispatch(fetchCards()).unwrap();
            console.log("requests :", res)
            SetCard(res)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            props.route.params.onChangeTab(2)
        });

        return unsubscribe;
    }, [props.navigation]);

    useEffect(() => {
        console.log('Start fetch card holder ', props.route.params.keyword);
        //pageFetchCards()
        /* const willFocusSubscription = props.navigation.addListener('focus', () => {
            cardFetch
        });

        return willFocusSubscription; */
    }, [])

    const cardContainer = (card: CardInfo) => {
        //console.log("set card: ", card)
        return (
            <View key={card.card_stored}>
                <TouchableOpacity style={styles.cards} onPress={() => { props.navigation.navigate("CardDetail", { cardId: card.card_stored }) }}>
                    <View style={styles.upperPart}>
                        {card.start_date_time ?
                            <View style={styles.cardInfo}>
                                <Image
                                    source={require('../../assets/img/icon/date.png')}
                                    style={styles.cardInfoIcon}
                                />
                                <Text style={styles.cardText} numberOfLines={2}>
                                    {card.start_date_time.substring(0, 10)}
                                </Text>
                            </View> : ""
                        }
                        {card.start_date_time ?
                            <View style={styles.cardInfo}>
                                <Image
                                    source={require('../../assets/img/icon/clock.png')}
                                    style={styles.cardInfoIcon}
                                />
                                <Text style={styles.cardText} numberOfLines={2}>
                                    {new Date(card.start_date_time).toTimeString().substring(0, 5)}
                                </Text>
                            </View> : ""
                        }
                        {card.location ?
                            <View style={styles.cardInfo}>
                                <Image
                                    source={require('../../assets/img/icon/location.png')}
                                    style={styles.cardInfoIcon}
                                />
                                <Text style={styles.cardText} >{card.location}</Text>
                            </View> : ""
                        }
                    </View>
                    <View style={styles.lowerPart}>
                        <View style={styles.leftPart}>
                            <Image style={{
                                height: 60,
                                width: 60,
                            }} source={card.card_image ? { uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${card.card_image}` } : require('../../assets/img/icon/gallery.png')}
                                resizeMode="contain" />
                        </View>
                        <View style={styles.rightPart}>
                            <View>
                                <Text style={styles.cardText}>
                                    {card.first_name ? card.first_name : ""} {card.last_name ? card.last_name : ""}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardText} numberOfLines={5}>{card.title ? card.title : ""}</Text>
                            </View>
                            <View>
                                <Text style={styles.cardText} numberOfLines={5}>{card.company_name ? card.company_name : ""}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View>
            {card ?
                <ScrollView >
                    {card.map((card: CardInfo) => cardContainer(card))}
                </ScrollView >
                : ""
            }
        </View>
    )
}

const styles = StyleSheet.create({
    cards: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        marginTop: 10,
        borderWidth: 2,
        height: 100
    },
    upperPart: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    lowerPart: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    leftPart: {
        marginRight: 60

    },
    rightPart: {


    },
    cardText: {


    }

})

export default SuggestCard