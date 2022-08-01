import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
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
    imageStyle?: {}
}


const BusinessCardStyleA = (props: Props) => {
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
                        <FontAwesomeIcon icon={faUser} style={styles.userIcon} size={36} />
                    </View>}
                <View style={styles.businessCardInfo}>
                    <Text style={styles.businnesCardName}>{props.name}</Text>
                    {props.title ? <Text style={styles.businnesCardTitle}>{props.title}</Text> : ""}
                    {props.company ? <Text style={styles.businnesCardCompany}>{props.company}</Text> : ""}
                    <View style={styles.businessCardBottom}>
                        {props.address ?
                            <View style={styles.businessCardBelowItem}>
                                <FontAwesomeIcon icon={faLocationDot} style={{ color: COLORS.businessCardTextColor }} size={12} />
                                <Text style={[styles.businessCardBelowText, { textTransform: 'capitalize' }]}>{props.address}</Text>
                            </View> : ""}
                        {props.telephones?.[0] ? <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.businessCardTextColor }} size={12} />
                            <Text style={styles.businessCardBelowText}>{"+" + props.telephones[0].country_code + props.telephones[0].tel_number}</Text>
                        </View> : ""}
                        <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faEnvelope} style={{ color: COLORS.businessCardTextColor }} size={12} />
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
        height: 190,
    },
    businessCard: {
        display: "flex",
        flexDirection: "row",
        paddingTop: 18,
        paddingHorizontal: 18,

    },
    businessCardInfo: {
        display: "flex",
        alignItems: "flex-start",
        marginLeft: 14,
    },
    businessCardPersonPhoto: {
        width: 64,
        height: 64,
        // backgroundColor: COLORS.primaryColor,
        borderRadius: 64,
        resizeMode: 'cover',
    },
    cardWithoutPhoto: {
        width: 64,
        height: 64,
        backgroundColor: COLORS.light,
        borderRadius: 64,
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
        fontSize: 16,
        color: COLORS.black,
        fontWeight: "bold",
        textTransform: 'capitalize'
    },
    businnesCardTitle: {
        fontSize: 13,
        color: COLORS.businessCardTextColor,
        textTransform: 'capitalize',
    },
    businnesCardCompany: {
        fontSize: 13,
        color: COLORS.businessCardTextColor,
        textTransform: 'capitalize',
    },
    businessCardBottom: {
        width: "100%",
    },
    businessCardBelowItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
    },
    businessCardBelowText: {
        color: COLORS.businessCardTextColor,
        fontSize: 11,
        width: "80%",
        marginLeft: 10,

    },
})

export default BusinessCardStyleA