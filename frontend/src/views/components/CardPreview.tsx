import { View, Text, StatusBar, Image, StyleSheet, ScrollView, BackHandler, Alert, Platform, TouchableOpacity, ImageBackground } from "react-native"
import COLORS from "../../conts/colors"
import React from "react"
import BusinessCardStyleC from "./BusinessCardStyleC"
import BusinessCardStyleB from "./BusinessCardStyleB"
import BusinessCardStyleA from "./BusinessCardStyleA"
import { Telephones } from "../../redux/userInfo/state"
import BusinessCardStyleAPreview from "./BusinessCardStyleAPreview"
import BusinessCardStyleBPreview from "./BusinessCardStyleBPreview"
import BusinessCardStyleCPreview from "./BusinessCardStyleCPreview"
import { resize } from "../../conts/resize"


interface Props {
    name: string,
    email: string,
    defaultImageIndex: string,
    imageBg: string,
    address?: string,
    title?: string,
    company?: string,
    imageFormat?: string,
    profilePic?: string,
    telephones?: Array<Telephones>,
    cardImage?: string,
    date?: string,
    time?: string,
    onPress: () => void,
}

const CardPreview = (props: Props) => {

    return (
        <TouchableOpacity style={styles.cards} onPress={props.onPress}>

            <View style={styles.recentCardHeader}>
                <View style={styles.recentCardHeaderView}>
                    <Text style={styles.recentCardHeaderText} numberOfLines={1}>{props.date}</Text>
                </View>
                <View style={styles.recentCardHeaderView}>
                    <Text style={styles.recentCardHeaderText} numberOfLines={1}>{props.time}</Text>
                </View>
                {/* <View style={styles.recentCardHeaderView}>
                    <Text style={styles.recentCardHeaderText} numberOfLines={1}>Sheung Wan</Text>
                </View> */}
            </View>
            <View style={styles.recentCardContent}>
                <View style={{ width: 130, height: "100%", justifyContent: "flex-start", paddingTop: 25 }}>
                    {props.defaultImageIndex == "1" ? props.imageFormat == "1" ? <BusinessCardStyleAPreview name={props.name} email={props.email} title={props.title} company={props.company} profilePic={props.profilePic} telephones={props.telephones} address={props.address} imageBg={props.imageBg} imageStyle={{ borderRadius: 8 }}></BusinessCardStyleAPreview> : "" : ""}
                    {props.defaultImageIndex == "1" ? props.imageFormat == "2" ? <BusinessCardStyleBPreview name={props.name} email={props.email} title={props.title} company={props.company} telephones={props.telephones} address={props.address} imageBg={props.imageBg} imageStyle={{ borderRadius: 8 }}></BusinessCardStyleBPreview> : "" : ""}
                    {props.defaultImageIndex == "1" ? props.imageFormat == "3" ? <BusinessCardStyleCPreview name={props.name} email={props.email} title={props.title} company={props.company} telephones={props.telephones} address={props.address} imageBg={props.imageBg} imageStyle={{ borderRadius: 8 }}></BusinessCardStyleCPreview> : "" : ""}
                    {props.defaultImageIndex == "2" ? <ImageBackground style={{ width: "100%", height: 190/resize }} imageStyle={{ borderRadius:8}} resizeMode="stretch" source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${props.cardImage}` }} /> : ""}
                </View>
                <View style={{ marginLeft: 20, marginTop: 10, flex:1}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D9BF0', marginBottom: 13, textTransform: 'capitalize' , width: "90%"}} numberOfLines={1} ellipsizeMode='tail'>{props.name}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555', marginBottom: 13, textTransform: 'capitalize' , width: "90%"}} numberOfLines={1} ellipsizeMode='tail'>{props.title}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555', textTransform: 'capitalize', width: "90%" }} numberOfLines={1} ellipsizeMode='tail'>{props.company}</Text>
                </View>
            </View>
        </TouchableOpacity>


    )
}
const styles = StyleSheet.create({

    cards: {
        // borderColor: "#000000",
        // borderWidth: 1,
        width: "92.5%",
        height: 160,
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
    recentCardHeader: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingTop: 10,
        paddingHorizontal: 16,
    },
    recentCardHeaderView: {
        // marginRight: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    recentCardHeaderText: {
        color: 'grey',
        fontWeight: 'bold',
    },
    recentCardContent: {
        height: 140,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
})
export default CardPreview;


{/* <TouchableOpacity>
                    <View style={styles.cards}>
                        <View style={styles.recentCardHeader}>
                            <View style={styles.recentCardHeaderView}>
                                <Text style={styles.recentCardHeaderText} numberOfLines={1}>30-6-2022</Text>
                            </View>
                            <View style={styles.recentCardHeaderView}>
                                <Text style={styles.recentCardHeaderText} numberOfLines={1}>17:35</Text>
                            </View>
                            <View
                                style={styles.recentCardHeaderView}>
                                <Text style={styles.recentCardHeaderText} numberOfLines={1}>Central</Text>
                            </View>
                        </View>
                        <View style={styles.recentCardContent}>
                            <View style={{ width: 120, height: 120 }}>
                                <Image
                                    source={require('../../assets/img/card/card-template-01.jpg')}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ marginLeft: 20, marginTop: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D9BF0', marginBottom: 13 }} numberOfLines={1}>Gordon Lau</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555', marginBottom: 13 }} numberOfLines={1}>Curriculum Director</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555555' }} numberOfLines={1}>Tecky Academy</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> */}