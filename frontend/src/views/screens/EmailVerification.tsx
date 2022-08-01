import { StyleSheet, Text, View, Animated, SafeAreaView, StatusBar, TextInput, Button, TouchableOpacity, Platform, ScrollView, PlatformColor, TouchableWithoutFeedback, } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import COLORS from '../../conts/colors';
import { useDispatch, useSelector } from 'react-redux';
import Phone from "react-native-bootstrap-icons/icons/phone-fill";
import ChatDotFill from "react-native-bootstrap-icons/icons/chat-dots-fill";
import ShieldFillCheck from "react-native-bootstrap-icons/icons/shield-fill-check";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emailVerify, resendEmail } from '../../redux/auth/thunks';
import { IRootState } from '../../redux/state';
import { createUserProfile } from '../../redux/userInfo/thunks';


const EmailVerification = (props: any) => {
    const dispatch = useDispatch()
    const [disable, setIsDisable] = useState<boolean>(true)
    const [email, setEmail] = useState<string>("")
    const [token, setToken] = useState({ 0: "", 1: "", 2: "", 3: "", })
    const [secondsLeft, setSecondsLeft] = useState<number>(30);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
    const [error, setError] = useState<string>('');
    const passwordInput0 = useRef<any>()
    const passwordInput1 = useRef<any>()
    const passwordInput2 = useRef<any>()
    const passwordInput3 = useRef<any>()
    const { firstName, lastName } = useSelector((state: IRootState) => state.auth);
    console.log({ firstName, lastName })
    //get data from async storage
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@email')
            if (value !== null) {
                setEmail(value)
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getData()
        passwordInput0.current.focus()
        setSecondsLeft(30)
        setIsDisable(true)
        countdown()
    }, [])

    useEffect(() => {
        if (secondsLeft == 0) {
            resetTimer()
        } 
    }, [secondsLeft])


    const resetTimer = () => {
        clearInterval(intervalId);
        setIsDisable(false)
        setSecondsLeft(30)
    }

    useEffect(() => {
        checkAllFilled()
    }, [token])

    // disallow resend within 30 seconds
    const countdown = () => {
        let inId = setInterval(() => {
            setSecondsLeft((value) => value - 1);
        }, 1000);
        setIntervalId(inId);
    };

    //  redirect to HomePage
    // const checkUserLogInStatus = async () => {
    //     let value = await AsyncStorage.getItem('isLoggedIn');
    //     if (value) {
    //         props.navigation.navigate("Footer")
    //     }
    //   }


    // input bar autofocus
    const handleOnchange = (options: { text: string, input: number }) => {
        const { text, input } = options
        setToken(prevState => ({ ...prevState, [input]: text }));
        if (text != "") {
            if (input == 0 && passwordInput1.current) {
                passwordInput1.current.focus()
            }
            if (input == 1 && passwordInput2.current) {
                passwordInput2.current.focus()
            }
            if (input == 2 && passwordInput3.current) {
                passwordInput3.current.focus()
            }
        } 
        // else {
        //     if (input == 1 && passwordInput1.current) {
        //         passwordInput0.current.focus()
        //     }
        //     if (input == 2 && passwordInput2.current) {
        //         passwordInput1.current.focus()
        //     }
        //     if (input == 3 && passwordInput3.current) {
        //         passwordInput2.current.focus()
        //     }
        // }
    };

    // auto send to server when all field are filled
    const checkAllFilled = () => {
        if (token[1] && token[2] && token[3] && token[0]) {
            checkToken()
        }
    }

    const checkToken = async () => {
        try {
            let verificationCode = token[0] + token[1] + token[2] + token[3]
            const result = await dispatch(emailVerify({ email: email, token: verificationCode })).unwrap()
            if (result.isVerified) {
                console.log(result.isVerified)
                setError("")
                await AsyncStorage.setItem('@isLoggedIn', "yes")
                let submitData = new FormData();
                submitData.append("first_name", firstName)
                submitData.append("last_name", lastName)
                submitData.append("email", email)
                // submitData.append("title", "")
                // submitData.append("company_name", "")
                // submitData.append("address","")
                // submitData.append("website", "")
                // submitData.append("description","")
                let result2 = await dispatch(createUserProfile(submitData)).unwrap()
                if(result2) props.navigation.navigate("ProfileEdit",{page:"emailVerification"})
            }
        } catch (e) {
            if (typeof e == "string") {
                setError(e)
            }
        }
    }

    const sendEmail = async () => {
        try {
            const result = await dispatch(resendEmail()).unwrap()
            if (result) {
                setError("")
                setEmail(result)
                setSecondsLeft(30)
                setIsDisable(true)
                countdown()
            }
        } catch (e) {
            if (typeof e == "string") {
                setError(e)
            }
        }
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("LoginStep2")}}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} size={20} />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <View style={styles.upperPart}>
                        <View style={styles.logoContainer}>
                            <Phone fill={COLORS.primaryColor} width="80" height="80" viewBox="-1 -2 20 20" />
                            <View style={styles.logoRow}>
                                <ChatDotFill fill={COLORS.primaryColor} width="32" height="25" viewBox="-1 -2 20 20" />
                                <Text style={{ color: COLORS.white, fontSize: 12, lineHeight: 20, fontWeight: "900", }}>- - - -</Text>
                                <ShieldFillCheck fill={COLORS.primaryColor} width="30" height="25" viewBox="-3 -2 20 20" />
                            </View>
                        </View>
                        <Text style={styles.h3}>Verify your email address</Text>
                        <Text style={styles.p}>Enter 4-digit code sent to your email address</Text>
                        <Text style={[styles.p, { fontWeight: "900", marginBottom: 28, }]}>{email}</Text>
                        <View style={styles.bottom}>
                            <View style={styles.passwordRow}>
                                <PasswordInput value={token[0]} forwardedRef={passwordInput0} error={error} onChangeText={(text: string) => {
                                    handleOnchange({ text: text, input: 0 })
                                }}></PasswordInput>
                                <PasswordInput value={token[1]} forwardedRef={passwordInput1} error={error} onChangeText={(text: string) => {
                                    handleOnchange({ text: text, input: 1 })
                                }} ></PasswordInput>
                                <PasswordInput value={token[2]} forwardedRef={passwordInput2} error={error} onChangeText={(text: string) => {
                                    handleOnchange({ text: text, input: 2 })
                                }} ></PasswordInput>
                                <PasswordInput value={token[3]} forwardedRef={passwordInput3} error={error}
                                    onChangeText={(text: string) => {
                                        handleOnchange({ text: text, input: 3 })
                                    }}
                                ></PasswordInput>
                            </View>
                            {error ? <Text style={styles.errorText}>{error}</Text> : ""}
                        </View>
                        <TouchableWithoutFeedback disabled={disable} onPress={() => { sendEmail() }}>
                            <View style={[styles.button, { backgroundColor: disable ? COLORS.buttonDisable : COLORS.primaryColor }]}>
                                <Text style={styles.buttonText}>Send email again</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {disable ? <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.buttonDisable }}>Try again in</Text>
                            <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.darkGrey, }}> {secondsLeft} seconds</Text>
                        </View> : ""}
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}

const PasswordInput = (props: any) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={[styles.passwordContainer, { borderColor: props.error ? COLORS.red : isFocused ? COLORS.black : COLORS.light, }]}>
            <TextInput value={props.value} maxLength={1} style={styles.input} keyboardType='numeric'
                // caretHidden={true}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={props.onChangeText}
                ref={props.forwardedRef}
            >

            </TextInput>
        </View>
    )

}




const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 0,
        flex: 1,
        display: "flex",
    },
    header: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        // color: 
    },
    body: {
        flex: 16,

    },
    arrow: {
        color: COLORS.primaryColor,
    },
    logoContainer: {
        marginStart: 16,
        marginTop: 16,
        width: 70,
        height: 75,
        position: "relative",
        marginBottom: 16,
        borderRadius: 10,
        // backgroundColor: COLORS.primaryColor,
    },
    logoRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 5,
        position: "relative",
        bottom: 54,
        zIndex: 2,
        backgroundColor: "",
    },
    upperPart: {
        flex: 1,
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

    },
    bottom: {
        marginBottom: 28,
    },
    passwordRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        marginBottom: 1,
    },
    errorText: {
        color: COLORS.red,
        fontWeight: "bold",
        // fontSize:14,
    },
    passwordContainer: {
        height: 48,
        width: 48,
        // paddingHorizontal: 14,
        borderColor: COLORS.light,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.darkGrey,
        height: 48,
        width: 48,
        textAlign: "center",
        paddingHorizontal: 14,
    },
    button: {
        width: 130,
        backgroundColor: COLORS.buttonDisable,
        height: 35,
        borderRadius: 8,
        marginBottom: 5,
    },
    buttonText: {
        color: COLORS.white,
        lineHeight: 35,
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default EmailVerification;

