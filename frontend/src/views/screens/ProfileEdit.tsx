import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, ScrollView, TouchableNativeFeedback, Image, Modal, Pressable, StatusBar, Platform, Alert } from 'react-native';
import COLORS from '../../conts/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import PersonFill from 'react-native-bootstrap-icons/icons/person-fill';
import ImagePicker from 'react-native-image-crop-picker';
import { TextInput } from 'react-native-gesture-handler';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IRootState } from '../../redux/state';
import { useDispatch, useSelector } from 'react-redux';
import { getMyInfo, updateUserProfile } from '../../redux/userInfo/thunks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// import { UserInfo } from ;

const ProfileEdit = (props: any) => {
    const dispatch = useDispatch()
    const [disable, setDisable] = useState(false)
    const [telephone, setTelephone] = useState([{ id: 0, category: "Work", telephone: "", topHeight: 165 + 50 * 5 + 26, dy: 0 }])
    const { email, name, userId, title, telephones, company, address, website, imageFormat, imageBg, cardImage, defaultImageIndex, description, profilePic, cardId, firstName, lastName, } = useSelector((state: IRootState) => state.userInfo);
    // console.log(telephones)
    const topHeight = useRef(165 + 50 * 5 + 26)
    const id = useRef(0)
    const descriptionInput0 = useRef<any>()
    const descriptionInput1 = useRef<any>()
    const descriptionInput2 = useRef<any>()
    const yDiff = useRef<number>(0)
    const [deletePhoto, setDeletePhoto] = useState()
    const [descriptionRow, setDescriptionRow] = useState({ 0: "", 1: "", 2: "", })
    const [iconSrc, setIconSrc] = useState<{ uri: string } | null>(null);
    const [iconFromDB, setIconFromDB] = useState("");
    const [inputs, setInputs] = useState({
        first_name: firstName, last_name: lastName, title: title, company_name: company,
        tel: "", email: email, address: address, website: website, description: description, card_id: cardId
    });
    const [errors, setErrors] = useState({
        first_name: "", last_name: "", title: "", company_name: "",
        tel: "", email: "", address: "", website: "", description: ""
    });
    const [changed, setChanged] = useState(false)

    console.log(props.route.params)
    useEffect(() => {
        if (telephones.length > 0) {
            let newTel = [...telephone]
            newTel[0]["category"] = `${telephones[0].category}`
            newTel[0]["telephone"] = `${telephones[0].tel_number}`
            setTelephone(newTel)
        }
        if (telephones.length > 1) {
            let telCopy = telephones.slice(1)
            let newTel = [...telephone]
            for (let i = 0; i < telCopy.length; i++) {
                topHeight.current = topHeight.current + 45
                id.current = id.current + 1
                let telItem = { id: id.current, category: telCopy[i].category, telephone: `${telCopy[i].tel_number}`, topHeight: topHeight.current, dy: 0 }
                newTel.push(telItem)
            }
            setTelephone(newTel)
            console.log(telephone)
        }
        if (description.includes("\n")) {
            let descriptionArray = description.split("\n")
            for (let i = 0; i < descriptionArray.length; i++) {
                setDescriptionRow(prevState => ({ ...prevState, [i]: descriptionArray[i] }));
            }
        } else {
            setDescriptionRow(prevState => ({ ...prevState, [0]: description }));
        }
        setIconFromDB(profilePic)
        console.log(process.env.REACT_NATIVE_APP_HOSTING)
    }, [])

    // when user change something and tap back arrow, popup to user
    const createAlert = () =>
        Alert.alert(
            "Save?",
            "Would you like to save your changes?",
            [
                {
                    text: "No",
                    onPress: () => props.navigation.navigate("Me"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => submit() }
            ]
        );

    const addTelephones = () => {
        topHeight.current = topHeight.current + 45
        id.current = id.current + 1
        setTelephone(previousState => [...previousState, { id: id.current, category: "Work", telephone: "", topHeight: topHeight.current, dy: yDiff.current }])
        setChanged(true)
    }

    const deleteTelephones = (index: number) => {
        topHeight.current = topHeight.current - 45
        let telCopy = [...telephone]
        telCopy.map(telephone => { if (telephone.id > index) telephone.topHeight = telephone.topHeight - 45 })  //adjust position height
        let remaining = telCopy.filter(telephone => telephone.id != index)
        setTelephone(remaining)
        setChanged(true)
    }

    const getIcon = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 112,
                height: 112,
                cropping: true,
                cropperCircleOverlay: true
            });
            console.log("picker set: ", image.path)
            setIconSrc({ uri: image.path });
            setChanged(true)
            //console.log("image set: ", iconSrc)
        } catch (err: any) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    };

    const checkInput = async () => {
        setDisable(true)
        try {
            let validName = /^[a-zA-Z]+$/
            let validEmail = /\s*\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*/
            let error = 0;
            setErrors({
                first_name: "", last_name: "", title: "", company_name: "",
                tel: "", email: "", address: "", website: "", description: ""
            })
            // if (inputs.password.length < 5) {
            //   setErrors(prevState => ({ ...prevState, ["password"]: 'Password has to be at least 5 character long.' }));
            //   error += 1;
            // }
            if (!inputs.first_name.match(validName)) { //check empty?
                setErrors(prevState => ({ ...prevState, ["first_name"]: 'invalid first name' }));
                error += 1;
            }
            if (!inputs.last_name.match(validName)) {
                setErrors(prevState => ({ ...prevState, ["last_name"]: 'invalid last name' }));
                error += 1;
            }
            if (!inputs.title.match(validName)) {
                setErrors(prevState => ({ ...prevState, ["title"]: 'invalid title' }));
                error += 1;
            }
            if (!inputs.company_name.match(validName)) {
                setErrors(prevState => ({ ...prevState, ["company_name"]: 'invalid company name' }));
                error += 1;
            }
            //invalid phone
            // if (!inputs.company_name.match(validName)) {
            //   setErrors(prevState => ({ ...prevState, ["company_name"]: 'invalid company name' }));
            //   error += 1;
            // }
            if (!inputs.email.match(validEmail)) {
                setErrors(prevState => ({ ...prevState, ["email"]: 'invalid email' }));
                error += 1;
            }
            if (error > 0) {
                setDisable(false)
                return
            }
            submit()
        } catch (e) {
            console.log(e)
            setDisable(false)
        }
    }

    const handleOnchange = (options: { text: string, input: string }) => {
        const { text, input } = options
        setInputs(prevState => ({ ...prevState, [input]: text }));
        setChanged(true)
    };

    //change telephone number
    const handleTelephoneOnchange = (options: { tel: string, index: number }) => {
        const { tel, index } = options
        let newTel = [...telephone]
        newTel.map(telephone => { if (telephone.id == index) telephone.telephone = tel })
        setTelephone(newTel);
        setChanged(true)
    }

    //change phone categories
    const handleCategoryOnchange = (options: { category: string, index: number }) => {
        const { category, index } = options
        let newTel = [...telephone]
        newTel.map(telephone => { if (telephone.id == index) telephone.category = category })
        setTelephone(newTel);
        setChanged(true)
    }

    //Due to scroll
    const changeDropdownPositions = (dy: number) => {
        let newTel = [...telephone]
        yDiff.current = dy
        newTel.map(telephone => { telephone.dy = dy })
        setTelephone(newTel);
    }

    const handleDescriptionOnChange = (options: { text: string, input: number }) => {
        const { text, input } = options
        setDescriptionRow(prevState => ({ ...prevState, [input]: text }));
        // console.log("try:" + descriptionValue)
        setChanged(true)
        if (text.length == 52) {
            if (input == 0 && descriptionInput0.current) {
                descriptionInput1.current.focus()
            }
            if (input == 1 && descriptionInput1.current) {
                descriptionInput2.current.focus()
            }
        }
    };

    const submit = async () => {
        try {
            let submitData = new FormData();

            setInputs(prevState => ({ ...prevState, ["description"]: descriptionValue }));
            for (let key in inputs) {
                submitData.append(key, inputs[key as keyof {
                    first_name: string, last_name: string, title: string, company_name: string,
                    tel: string, email: string, address: string, website: string, description: string
                }]);
                // console.log(submitData)
            }

            let descriptionValue: string;
            descriptionValue = descriptionRow[0] + "\n" + descriptionRow[1] + "\n" + descriptionRow[2]
            submitData.append("description", descriptionValue)

            if (iconSrc) {
                submitData.append("profile_image", {
                    uri: iconSrc.uri,//"file:///storage/emulated/0/Android/data/com.ecardexpress/files/Pictures/7ab4d6da-2bee-47ca-acc5-fcc2afa747fb.jpg",
                    type: 'image/jpg',
                    name: 'card.jpg',
                });
            }
            submitData.append("iconFromDB", iconFromDB)

            interface Tel {
                tel_number: string, category: string
            }
            let telInfos: Array<Tel> = []
            for (let i = 0; i < telephone.length; i++) {
                let telInfo: Tel = { tel_number: "", category: "" }
                if (telephone[i].telephone && telephone[i].telephone) {
                    telInfo["tel_number"] = telephone[i].telephone
                    telInfo["category"] = telephone[i].category
                    telInfos.push(telInfo)
                }
            }
            console.log("telInfos" + telInfos)
            submitData.append('tel', JSON.stringify(telInfos))

            let result = await dispatch(updateUserProfile(submitData)).unwrap()
            if (result == `User profile updated`) {
                let values = await AsyncStorage.multiGet(['@email', '@isLoggedIn',])
                let emailByLocalStorage = values[0][1]
                let isLoggedInByLocalStorage = values[1][1]
                if (emailByLocalStorage && isLoggedInByLocalStorage) {
                    await dispatch(getMyInfo({ email: emailByLocalStorage, isLoggedIn: isLoggedInByLocalStorage })).unwrap()
                    if (props.route.params) {
                        props.navigation.navigate("Footer", { screen: 'Home' })
                        return
                    }
                    props.navigation.navigate("Footer")            
                }
            }
        } catch (e) {
            console.log(e)

            // let res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `userProfile`, {
            //   method: 'POST',
            //   headers: {
            //     //'Accept': 'application/json',
            //     'Content-Type': 'multipart/form-data;'
            //   },
            //   body: submitData
            // });

            // console.log("Check res: ", res)

            // if (res.status.toString().startsWith("5")) {
            //   console.log("Internal create user error")
            //   setDisable(false)
            //   return
            // }

            // let result = await res.json()
            // console.log("Check create user result: ", result)

            // if (res.status.toString().startsWith("4")) {
            //   console.log(result.message)
            //   setDisable(false)
            //   return
            // }
            // if (res.ok) {
            //   console.log("Create card success")
            //   setDisable(false)
            //   //props.navigation.navigate("Footer")
            // }
        };
    }

    const onLayout = (event: any) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        console.log(x)
        console.log(y)
        console.log(height)
        console.log(width)
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            {props.route.params ?
                <View style={styles.header}>
                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}> Edit Profile</Text>
                    </View>
                </View> :
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        if (changed) {
                            createAlert()
                        } else {
                            props.navigation.goBack()
                        }
                    }}>
                        <View style={{ backgroundColor: COLORS.primaryColor, marginRight: 16, }}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: COLORS.white }} size={18} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}> Edit Profile</Text>
                </View>}
            <ScrollView showsVerticalScrollIndicator={false} onMomentumScrollEnd={(e) => { changeDropdownPositions(e.nativeEvent.contentOffset.y) }}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <View style={styles.upperPart} >
                            <TouchableOpacity onPress={getIcon}>
                                {iconSrc ? <Image style={styles.imgCircle} source={iconSrc} /> :
                                    iconFromDB ? <Image style={styles.imgCircle} source={{ uri: `${process.env.REACT_NATIVE_APP_HOSTING}images/${profilePic}` }} /> :
                                        <View style={styles.bigCircle}>
                                            <PersonFill fill={COLORS.white} width="90" height="90" viewBox="-3 -3 22 22" />
                                        </View>
                                }
                            </TouchableOpacity>
                            {iconFromDB || iconSrc ?
                                <TouchableNativeFeedback onPress={() => {
                                    setIconSrc(null)
                                    setIconFromDB("")
                                    setChanged(true)
                                }}>
                                    <View style={{ backgroundColor: COLORS.red, width: 16, height: 16, borderRadius: 16, position: "absolute", alignItems: 'center', justifyContent: 'center', left: 90, top: 10 }}>
                                        <FontAwesomeIcon icon={faXmark} style={{ color: COLORS.white }} size={14} />
                                    </View>
                                </TouchableNativeFeedback> : ""}
                            {/* <TouchableNativeFeedback onPress={() => props.navigation.navigate("Upload Card", "profileEdit")}>
                                <Text style={styles.uploadText}>Scan your Business Card</Text>
                            </TouchableNativeFeedback> */}
                        </View>
                        <InfoInputRow label="First Name" value={inputs.first_name} onChangeText={text => handleOnchange({ text: text, input: "first_name" })}></InfoInputRow>
                        <InfoInputRow label="Last Name" value={inputs.last_name} onChangeText={text => handleOnchange({ text: text, input: "last_name" })}></InfoInputRow>
                        <InfoInputRow label="Title" value={inputs.title} onChangeText={text => handleOnchange({ text: text, input: "title" })}></InfoInputRow>
                        <InfoInputRow label="Company" value={inputs.company_name} onChangeText={text => handleOnchange({ text: text, input: "company_name" })}></InfoInputRow>
                        <View style={styles.telInputRow}>
                            <View style={styles.telHeader}>
                                <Text style={styles.label}>Tel</Text>
                                <TouchableNativeFeedback onPress={() => { addTelephones() }}>
                                    <View style={styles.plusLogo}>
                                        <Text style={styles.plusText}>+</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            {/* <InputWithDropdown position={topHeight} category={telephones[0].category}
                onChangeText={tel => handleTelephoneOnchange({ tel: tel, index: 0 })}
                onSelect={category => handleCategoryOnchange({ category: category, index: 0 })}
              /> */}
                            <>
                                {telephone ? telephone.map((telephone, key) => {
                                    return (
                                        <InputWithDropdown position={telephone.topHeight} category={telephone.category} dy={telephone.dy} key={key} value={telephone.telephone}
                                            onChangeText={tel => handleTelephoneOnchange({ tel: tel, index: telephone.id })}
                                            onSelect={category => handleCategoryOnchange({ category: category, index: telephone.id })}
                                            onDelete={() => { deleteTelephones(telephone.id) }}
                                        />
                                    )
                                }) : ""}
                            </>
                        </View>
                        <InfoInputRow label="Email" value={inputs.email} onChangeText={text => handleOnchange({ text: text, input: "email" })}></InfoInputRow>
                        <InfoInputRow label="Address" value={inputs.address} onChangeText={text => handleOnchange({ text: text, input: "address" })}></InfoInputRow>
                        <InfoInputRow label="Website" value={inputs.website} onChangeText={text => handleOnchange({ text: text, input: "website" })}></InfoInputRow>
                        <View style={styles.aboutMeRow}>
                            <Text style={styles.label}>About Me :</Text>
                            <View style={styles.aboutMeContainer}>
                                <TextInput style={styles.aboutMeInput} value={descriptionRow[0]} maxLength={52} ref={descriptionInput0}
                                    onChangeText={(text: string) => handleDescriptionOnChange({ text: text, input: 0 })}>
                                </TextInput>
                                <TextInput style={styles.aboutMeInput} value={descriptionRow[1]} maxLength={52} ref={descriptionInput1}
                                    onChangeText={(text: string) => handleDescriptionOnChange({ text: text, input: 1 })}>
                                </TextInput>
                                <TextInput style={styles.aboutMeInput} value={descriptionRow[2]} maxLength={52} ref={descriptionInput2}
                                    onChangeText={(text: string) => handleDescriptionOnChange({ text: text, input: 2 })}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={{ marginBottom: 8 }}></View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    disabled={disable}
                    title="Continue"
                    onPress={() => submit()}
                />
            </View>
        </SafeAreaView >
    );
};

interface Props {
    label: string,
    value: string,
    onChangeText?: (text: string) => void,
}

const InfoInputRow = (props: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.inputRow}>
            <Text style={styles.label}>{props.label} :</Text>
            <View style={styles.rightPart}>
                <TextInput style={[styles.input, { borderBottomWidth: isFocused ? 1 : 0 }]}
                    value={props.value}
                    onFocus={() => { setIsFocused(true); }}
                    onBlur={() => { setIsFocused(false); }}
                    onChangeText={props.onChangeText}
                >
                </TextInput>
            </View>
        </View>
    )

}

interface Props2 {
    onChangeText?: (text: string) => void,
    onSelect: (item: string) => void;
    onDelete: () => void;
    category: string,
    position: number,
    dy: number,
    value: string,
}

const InputWithDropdown = (props: Props2) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.telDropdownRow}>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Pressable onPress={() => { setModalVisible(false); }}>
                    <View style={{ width: "100%", height: "100%" }}></View>
                </Pressable>
                <View style={[styles.dropdownContainer, { top: props.position - props.dy }]}>
                    <Pressable style={styles.dropdownItem} onPress={() => {
                        props.onSelect("Work")
                        setModalVisible(!modalVisible)
                    }}>
                        <Text style={styles.dropdownText}>Work</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={() => {
                        props.onSelect("Office")
                        setModalVisible(!modalVisible)
                    }}>
                        <Text style={styles.dropdownText}>Office</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={() => {
                        props.onSelect("Personal")
                        setModalVisible(!modalVisible)
                    }}>
                        <Text style={styles.dropdownText}>Personal</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={() => {
                        props.onSelect("Direct")
                        setModalVisible(!modalVisible)
                    }}>
                        <Text style={styles.dropdownText}>Direct</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={() => {
                        props.onSelect("Fax")
                        setModalVisible(!modalVisible)
                    }}>
                        <Text style={styles.dropdownText}>Fax</Text>
                    </Pressable>
                </View>
            </Modal>
            <TouchableNativeFeedback onPress={() => setModalVisible(!modalVisible)} >
                <Text style={[styles.label, { color: COLORS.darkGrey, textAlign: 'center' }]}>{props.category} :</Text>
            </TouchableNativeFeedback>
            <View style={styles.rightPart}>
                <TextInput style={[styles.input, { borderBottomWidth: isFocused ? 1 : 0 }]} keyboardType='numeric'
                    onChangeText={props.onChangeText}
                    maxLength={8}
                    onFocus={() => { setIsFocused(true); }}
                    onBlur={() => { setIsFocused(false); }}
                    value={props.value}
                ></TextInput>
                <TouchableNativeFeedback onPress={props.onDelete}>
                    <View style={styles.cancel}>
                        <FontAwesomeIcon icon={faXmark} style={{ color: COLORS.light }} size={18} />
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        flex: 1,
        display: "flex",
    },
    header: {
        height: 56,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: COLORS.primaryColor,
        // color: 
    },
    headerText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 18,
    },
    innerContainer: {
        alignItems: 'center',
        justifyItems: 'center',
        display: "flex",
    },
    upperPart: {
        alignItems: 'center',
        justifyItems: 'center',
        display: "flex",
        marginVertical: 16,
    },
    bigCircle: {
        width: 112,
        height: 112,
        borderRadius: 100,
        backgroundColor: COLORS.lightBlue,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: 10,
    },
    imgCircle: {
        width: 112,
        height: 112,
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: 10,
    },
    buttonContainer: {
        paddingVertical: 24,
        paddingHorizontal: 10,
        //   backgroundColor: COLORS.white,
        //   ...Platform.select({
        //     ios: {
        //         shadowColor: '#000',
        //         shadowOffset: { width: 0, height: 2 },
        //         shadowOpacity: 0.2,
        //     },
        //     android: {
        //         elevation: 2,
        //     },
        // }),
    },
    logoText: {
        color: "white",
        textAlign: "center",
        lineHeight: 24,
    },
    h3: {
        fontSize: 22,
        color: COLORS.darkGrey,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    p: {
        fontSize: 14,
        color: COLORS.darkGrey,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    inputRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        height: 45,
        width: "100%",
        marginBottom: 5,
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    label: {
        width: "25%",
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        color: COLORS.darkGrey,
        height: 25,
        width: "85%",
        borderColor: COLORS.primaryColor,
        borderBottomWidth: 1,
        padding: 0,
    },
    telInputRow: {
        width: "100%",
        // height: 80,
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    telHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 13,
        width: "100%",
        height: 20,
    },
    telDropdownRow: {
        display: 'flex',
        position: 'relative',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        height: 45,
        // paddingBottom: ,
    },
    dropdownContainer: {
        height: 175,
        width: "21%",
        backgroundColor: COLORS.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: "absolute",
        top: 0,
        left: 10,
    },
    dropdownItem: {
        alignItems: "center",
        justifyContent: "center",
        height: 35,
        width: "100%",
        backgroundColor: COLORS.white,
        // borderBottomWidth:0.5,
        // borderBottomColor: COLORS.light,
        // marginBottom:2,
    },
    dropdownText: {
        color: COLORS.darkGrey,
        fontSize: 16,
    },
    rightPart: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        width: "75%",
    },
    plusLogo: {
        width: 18,
        height: 18,
        borderRadius: 100,
        backgroundColor: COLORS.primaryColor,
        marginRight: 8,
    },
    plusText: {
        color: COLORS.white,
        lineHeight: 20,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
    },
    cancel: {
        marginRight: 8,
    },
    columns: {
        width: "45%",
    },
    uploadText: {
        color: COLORS.primaryColor,
        textAlign: 'center',
        marginTop: 10,
    },
    aboutMeRow: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        width: "100%",
        paddingVertical: 16,
    },
    aboutMeContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.darkGrey,
        borderRadius: 8,
        width: "100%",
        height: 85,
        padding: 10,
        paddingHorizontal: 14,
    },
    aboutMeInput: {
        width: "100%",
        height: 20,
        fontSize: 16,
        padding: 0,
        margin: 0,
        // borderWidth:1,
    }
});

export default ProfileEdit;