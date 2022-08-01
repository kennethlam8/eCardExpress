import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { View, Text, Button, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native"
import COLORS from "../../conts/colors"
import React from "react"


const BusinessCardStyleD = (pros: any) => {
    return (
        <ImageBackground source={require("../../assets/img/card/business-card-background2.png")} resizeMode="stretch" style={styles.businessCardImage}>
            <View style={styles.businessCard}>
                <Image source={require('../../assets/img/user/user-icon-01.jpg')} style={styles.businessCardPersonPhoto} />
                <View style={styles.businessCardInfo}>
                    <Text style={styles.businnesCardName}>Dickson Wu</Text>
                    <Text style={styles.businnesCardTitle}>Instructor</Text>
                    <View style={styles.businessCardBottom}>
                        <Text style={styles.businnesCardCompany}>Tecky Academy Limited</Text>
                        <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faLocationDot} style={{ color: COLORS.businessCardTextColor }} size={12} />
                            <Text style={styles.businessCardBelowText}>Suite C-E, 11th Floor, Golden Sun Centre 59-67 Bonham Strand West, Sheung Wan</Text>
                        </View>
                        <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faPhone} style={{ color: COLORS.businessCardTextColor }} size={12} />
                            <Text style={styles.businessCardBelowText}>+85297256400</Text>
                        </View>
                        <View style={styles.businessCardBelowItem}>
                            <FontAwesomeIcon icon={faEnvelope} style={{ color: COLORS.businessCardTextColor }} size={12} />
                            <Text style={styles.businessCardBelowText}>dickson@tecky.io</Text>
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
    businnesCardName: {
        fontSize: 16,
        color: COLORS.black,
        fontWeight: "bold",
    },
    businnesCardTitle: {
        fontSize: 13,
        color: COLORS.businessCardTextColor,
    },
    businnesCardCompany: {
        fontSize: 13,
        color: COLORS.black,
        fontWeight: "500",
        marginTop:10,
        marginBottom:5,
    },
    businessCardBottom: {
        width: "100%",
    },
    businessCardBelowItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
    },
    businessCardBelowText: {
        color: COLORS.businessCardTextColor,
        fontSize: 11,
        width: "80%",
        marginLeft: 10,

    },
})

export default BusinessCardStyleD