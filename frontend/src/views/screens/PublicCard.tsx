import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Button, ImageBackground } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import COLORS from "../../conts/colors"
import { resize } from "../../conts/resize"
import { CardInfo, CardState } from "../../redux/cardSearch/state"
import { fetchPublicCards } from "../../redux/cardSearch/thunks"
import BusinessCardStyleAPreview from "../components/BusinessCardStyleAPreview"
import BusinessCardStyleBPreview from "../components/BusinessCardStyleBPreview"
import BusinessCardStyleCPreview from "../components/BusinessCardStyleCPreview"

const PublicCard = (props: any) => {
    const dispatch = useDispatch()
    //const cards = useSelector((state: CardState) => state.cards);

    const [publicCard, SetPublicCard] = useState([])

    // props.route.params.onChangeTab(1)
    let inputedKeyword = props.route.params.keyword
    if (inputedKeyword == undefined)
        inputedKeyword = ""
    const pageFetchPublicCards = async () => {
        console.log("fetching cards")

        try {
            let res = await dispatch(fetchPublicCards({ index: -1, keyword: inputedKeyword, searchBy: 'first_name' })).unwrap();
            console.log("requests :", res)
            SetPublicCard(res)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            props.route.params.onChangeTab(1)
            console.log('Start fetch public card holder - ', inputedKeyword);
            //pageFetchPublicCards()
        });

        return unsubscribe;
    }, [props.navigation]);

    useEffect(() => {
        console.log("keyword inputed: ", props.route.params.keyword)
        if (props.route.params.keyword != "" || props.route.params.keyword != undefined) {
            console.log('Start fetch public cards - ', inputedKeyword);
            pageFetchPublicCards()
        } else {
            SetPublicCard([])
        }
    }, [props.route.params.keyword])

    // useEffect(() => {
    //     const unsubscribe = props.navigation.addListener('tabPress', (e) => {
    //         props.route.params.onChangeTab(1)
    //         console.log("Page 1 clicked")
    //     });

    //     return unsubscribe;
    // }, [props.navigation]);

    const cardContainer = (card: CardInfo, index: number) => {
        console.log("set card: ", card)
        return (
            <TouchableOpacity key={`public_${card.card_id}_${index}`} style={styles.cards} onPress={() => props.route.params.toCardDetail(card.card_id)}>
                <View style={styles.recentCardContent}>
                    <View style={{ width: 130, height: "100%", justifyContent: "flex-start", paddingTop: 25 }}>
                        {card.default_image_index == "1" ? card.image_format == "1" ? <BusinessCardStyleAPreview name={`${card.first_name} ${card.last_name}`} email={card.email} title={card.title} company={card.company_name} profilePic={card.profile_pic} address={card.address} imageBg={card.image_bg} imageStyle={{ borderRadius: 8 }}></BusinessCardStyleAPreview> : "" : ""}
                        {card.default_image_index == "1" ? card.image_format == "2" ? <BusinessCardStyleBPreview name={`${card.first_name} ${card.last_name}`} email={card.email} title={card.title} company={card.company_name} address={card.address} imageBg={card.image_bg} imageStyle={{ borderRadius: 8 }}></BusinessCardStyleBPreview> : "" : ""}
                        {card.default_image_index == "1" ? card.image_format == "3" ? <BusinessCardStyleCPreview name={`${card.first_name} ${card.last_name}`} email={card.email} title={card.title} company={card.company_name} address={card.address} imageBg={card.image_bg} imageStyle={{ borderRadius: 8 }}></BusinessCardStyleCPreview> : "" : ""}
                        {card.default_image_index == "2" ? <ImageBackground resizeMode="contain" style={{ width: "100%", height: 190/resize }} imageStyle={{ borderRadius:8}} resizeMode="stretch" source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${card.card_image}` }} /> : ""}
                    </View>
                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D9BF0', marginBottom: 13, textTransform: 'capitalize' }} numberOfLines={1}>{`${card.first_name} ${card.last_name}`}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555', marginBottom: 13, textTransform: 'capitalize' }} numberOfLines={1}>{card.title}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555', textTransform: 'capitalize' }} numberOfLines={1}>{card.company_name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            /*  <View key={`public_${card.card_id}`}>
                 <TouchableOpacity style={styles.cards} onPress={() => { props.navigation.navigate("CardDetail", { cardId: card.card_id }) }}>
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
             </View> */
        )
    }

    return (
        <View>
            {inputedKeyword != "" ?
                (publicCard ?
                    <ScrollView contentContainerStyle={{ alignItems: 'center', }}>
                        {publicCard.map((card: CardInfo, index: number) => cardContainer(card, index))}
                    </ScrollView >
                    : <Text style={{
                        fontSize: 20,
                        textAlign: 'center',
                        margin: 10,
                        color: COLORS.grey
                    }}>No card found</Text>
                ) : <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                    margin: 10,
                    color: COLORS.grey
                }}>Start your search</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    recentCardContent: {
        height: 140,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    cards: {
        width: "92.5%",
        height: 130,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 8,
        marginBottom: 15,
        shadowColor: 'grey',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
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

export default PublicCard