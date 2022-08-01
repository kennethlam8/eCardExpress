import { faThumbTack, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Button } from "react-native"
import Toast from "react-native-toast-message"
import { useDispatch, useSelector } from "react-redux"
import COLORS from "../../conts/colors"
import { CardInfo, CardState } from "../../redux/cardSearch/state"
import { fetchCards } from "../../redux/cardSearch/thunks"
import CardPreview from "../components/CardPreview"

const CardholderSearch = (props: any) => {
    const dispatch = useDispatch()
    const cards = useSelector((state: CardState) => state.cards);

    const [card, SetCard] = useState([])

    //props.route.params.onChangeTab(0)
    let inputedKeyword = props.route.params.keyword
    if (inputedKeyword == undefined)
        inputedKeyword = ""

    //{ keyword: props.route.params.keyword, searchBy: props.route.params.keyword }
    const pageFetchCards = async () => {
        console.log("fetching cards: ", props.route.params.keyword)
        try {
            let res = await dispatch(fetchCards({ index: -1, keyword: inputedKeyword, searchBy: 'first_name' })).unwrap();
            console.log("requests :", res)
            SetCard(res)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            props.route.params.onChangeTab(0)
            console.log('Start fetch card holder - ', inputedKeyword);
            //pageFetchCards();
        });

        return unsubscribe;
    }, [props.navigation]);

    useEffect(() => {
        console.log('Start fetch card holder - ', inputedKeyword);
        pageFetchCards()
    }, [props.route.params.keyword])

    const deleteCard = async (card_id) => {
        console.log('Click delete card');

        const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'card', {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                card_id: card_id,
            })
        })
        const data = await res.json()

        if (res.ok) {
            Toast.show({
                type: 'success',
                text1: 'Card deleted successfully',
                topOffset: 5,
                visibilityTime: 1000,
                autoHide: true
            });
            console.log("card delete success")
            pageFetchCards()
        }
    }

    const cardContainer = (card: CardInfo, index: number) => {
        //console.log("set card: ", card)
        return (
            <View key={`myCard_${card.card_stored}_${index}`} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {card.has_acct ? "" : <FontAwesomeIcon icon={faThumbTack} style={{ color: COLORS.primaryColor, position: "absolute", top: 15, zIndex: 5 }} size={15} />}
                <CardPreview name={`${card.first_name} ${card.last_name}`} email={card.email} defaultImageIndex={card.default_image_index} imageBg={card.image_bg} imageFormat={card.image_format}
                    address={card.address} title={card.title} company={card.company_name} profilePic={card.profile_pic}
                    telephones={[{ card_id: card.card_id, tel_number: card.tel_number, country_code: card.country_code, category: card.category }]} cardImage={card.card_image}
                    date={card.created_at.split("T")[0]} time={card.created_at.split("T")[1].slice(0, 5)} onPress={() => props.route.params.toCardDetail(card.card_stored)}
                ></CardPreview>
                <TouchableOpacity onPress={() => deleteCard(card.card_stored)} style={{ position: "absolute", top: 5, zIndex: 5, right: 10 }} >
                    <FontAwesomeIcon icon={faTrash} style={{ color: 'transparent' }} size={25} />
                </TouchableOpacity>

            </View>
            /*   <View key={`myCard_${card.card_stored}_${index}`}>
                  <TouchableOpacity style={styles.cards} onPress={() => { props.navigation.navigate("CardDetail", { cardId: card.card_stored}) }}>
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
              </View> */
        )
    }

    return (
        <View>
            {card ?
                <ScrollView showsVerticalScrollIndicator={false} style={styles.cardsContainer} contentContainerStyle={{ alignItems: 'center', }}>
                    {card.map((card: CardInfo, index) => cardContainer(card, index))}
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

export default CardholderSearch