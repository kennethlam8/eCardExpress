import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { View, Text, Button, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native"
import COLORS from "../../conts/colors"
import React from "react"
import { Telephones } from "../../redux/userInfo/state"


interface Props {
    name: string,
    title?: string,
    company?: string,
    profilePic?: string,
    address?: string,
    telephones?: Array<Telephones>,
    email: string,
    imageBg: string,
    imageStyle?: {},
}


const BusinessCardStyleB = (props: Props) => {
    let cardBackground;
    if (props.imageBg == "7") cardBackground = require("../../assets/img/card/business-card-background7.png")
    if (props.imageBg == "8") cardBackground = require("../../assets/img/card/business-card-background8.png")
    if (props.imageBg == "9") cardBackground = require("../../assets/img/card/business-card-background9.png")
    if (props.imageBg == "10") cardBackground = require("../../assets/img/card/business-card-background10.png")
    if (props.imageBg == "11") cardBackground = require("../../assets/img/card/business-card-background11.png")
    if (props.imageBg == "12") cardBackground = require("../../assets/img/card/business-card-background12.png")

    return (
        <ImageBackground source={cardBackground} resizeMode="stretch" style={styles.businessCardImage} imageStyle={props.imageStyle}>
            <View style={styles.businessCardInfo}>
                <View style={styles.upperPart}>
                    <Text style={styles.businnesCardName}>{props.name}</Text>
                    {props.title ? <Text style={styles.businnesCardTitle}>{props.title}</Text> : ""}
                    {props.company ? <Text style={styles.businnesCardCompany}>{props.company}</Text> : ""}
                </View>
                <View style={styles.line}></View>
                {props.address ? <View style={styles.businessCardBelowItem}>
                    <Text style={[styles.businessCardBelowText, { textTransform: 'capitalize' }]}>{props.address}</Text>
                    <FontAwesomeIcon icon={faLocationDot} style={{ color: COLORS.white }} size={12} />
                </View> : ""}
                {props.telephones?.[0] ? <View style={styles.businessCardBelowItem}>
                    <Text style={styles.businessCardBelowText}>{"+" + props.telephones[0].country_code + props.telephones[0].tel_number}</Text>
                    <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.white }} size={12} />
                </View> : ""}
                <View style={styles.businessCardBelowItem}>
                    <Text style={styles.businessCardBelowText}>{props.email}</Text>
                    <FontAwesomeIcon icon={faEnvelope} style={{ color: COLORS.white }} size={12} />
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    businessCardImage: {
        width: "100%",
        height: 190,
    },
    businessCardInfo: {
        paddingTop: 18,
        paddingHorizontal: 18,
        display: "flex",
        alignItems: "flex-end",
    },
    upperPart: {
        height: 60,
    },
    businnesCardName: {
        fontSize: 16,
        color: COLORS.white,
        textAlign: "right",
        fontWeight: "bold",
        textTransform: 'capitalize'
    },
    businnesCardTitle: {
        fontSize: 13,
        color: COLORS.white,
        textAlign: "right",
        textTransform: 'capitalize'
    },
    businnesCardCompany: {
        fontSize: 13,
        color: COLORS.white,
        textAlign: "right",
        textTransform: 'capitalize'
    },
    line: {
        marginTop: 5,
        borderBottomColor: COLORS.white,
        borderBottomWidth: 2,
        width: "70%",

    },
    businessCardBelowItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10,
    },
    businessCardBelowText: {
        color: COLORS.white,
        fontSize: 11,
        textAlign: "right",
        width: "70%",
        marginRight: 10,

    },
})

export default BusinessCardStyleB