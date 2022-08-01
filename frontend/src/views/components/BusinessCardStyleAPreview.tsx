import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { View, Text, Button, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native"
import COLORS from "../../conts/colors"
import React from "react"
import { Telephones } from "../../redux/userInfo/state"
import { resize, resizePadding, resizeText } from "../../conts/resize"

interface Props {
    name: string,
    title?: string,
    company?: string,
    profilePic?: string,
    address?: string,
    telephones?: Array<Telephones>,
    email: string,
    imageBg: string,
    imageStyle?: {}
}


const BusinessCardStyleAPreview = (props: Props) => {
    let cardBackground;
    if (props.imageBg == "1") cardBackground = require("../../assets/img/card/business-card-background1.png")
    if (props.imageBg == "2") cardBackground = require("../../assets/img/card/business-card-background2.png")
    if (props.imageBg == "3") cardBackground = require("../../assets/img/card/business-card-background3.png")
    if (props.imageBg == "4") cardBackground = require("../../assets/img/card/business-card-background4.png")
    if (props.imageBg == "5") cardBackground = require("../../assets/img/card/business-card-background5.png")
    if (props.imageBg == "6") cardBackground = require("../../assets/img/card/business-card-background6.png")

    return (
        <ImageBackground source={cardBackground} resizeMode="stretch" style={styles.businessCardImage} imageStyle={props.imageStyle}>
            <View style={styles.businessCard}>
                {props.profilePic ? <Image source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${props.profilePic}` }} style={styles.businessCardPersonPhoto} /> :
                    <View style={styles.cardWithoutPhoto}>
                        <FontAwesomeIcon icon={faUser} style={styles.userIcon} size={36 / resize} />
                    </View>}
                <View style={styles.businessCardInfo}>
                    <Text style={styles.businnesCardName}>{props.name}</Text>
                    {props.title ? <Text style={styles.businnesCardTitle}>{props.title}</Text> : ""}
                    {props.company ? <Text style={styles.businnesCardCompany}>{props.company}</Text> : ""}
                    <View style={styles.businessCardBottom}>
                        {props.address ?
                            <View style={styles.businessCardBelowItem}>
                                <FontAwesomeIcon icon={faLocationDot} style={{ color: COLORS.businessCardTextColor }} size={12 / resize} />
                                <Text style={[styles.businessCardBelowText, { textTransform: 'capitalize' }]}>{props.address}</Text>
                            </View> : ""}
                        {props.telephones?.[0].card_id ? <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.businessCardTextColor }} size={12 / resize} />
                            <Text style={styles.businessCardBelowText}>{"+" + props.telephones[0].country_code + props.telephones[0].tel_number}</Text>
                        </View> : ""}
                        <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faEnvelope} style={{ color: COLORS.businessCardTextColor }} size={12 / resize} />
                            <Text style={styles.businessCardBelowText}>{props.email}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    businessCardImage: {
        width: "100%",
        height: 190 / resize,
    },
    businessCard: {
        display: "flex",
        flexDirection: "row",
        paddingTop: 18 / resize,
        paddingHorizontal: 18 / resize,

    },
    businessCardInfo: {
        display: "flex",
        alignItems: "flex-start",
        marginLeft: 14 / resize,
    },
    businessCardPersonPhoto: {
        width: 64 / resize,
        height: 64 / resize,
        // backgroundColor: COLORS.primaryColor,
        borderRadius: 64 / resize,
        resizeMode: 'cover',
    },
    cardWithoutPhoto: {
        width: 64 / resize,
        height: 64 / resize,
        backgroundColor: COLORS.light,
        borderRadius: 64 / resize,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    userIcon: {
        color: COLORS.white,
        position: "relative",
        bottom: 0,
    },
    businnesCardName: {
        fontSize: 16 / resizeText,
        color: COLORS.black,
        fontWeight: "bold",
        textTransform: 'capitalize'
    },
    businnesCardTitle: {
        fontSize: 13 / resizeText,
        color: COLORS.businessCardTextColor,
        textTransform: 'capitalize'
    },
    businnesCardCompany: {
        fontSize: 13 / resizeText,
        color: COLORS.businessCardTextColor,
        textTransform: 'capitalize'
    },
    businessCardBottom: {
        width: "100%",
    },
    businessCardBelowItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10 / 5,
    },
    businessCardBelowText: {
        color: COLORS.businessCardTextColor,
        fontSize: 11 / resizeText,
        width: "80%",
        marginLeft: 10 / resize,

    },
})

export default BusinessCardStyleAPreview