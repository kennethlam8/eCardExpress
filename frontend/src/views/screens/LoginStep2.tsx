import React, { useState, useEffect, useRef, } from 'react';
import { StyleSheet, Text, View, Animated, SafeAreaView, StatusBar, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import COLORS from '../../conts/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt'
import Input from '../components/Input';
import { useDispatch, useSelector, } from "react-redux";
import { checkUserEmail } from '../../redux/auth/thunks';
import { IRootState } from '../../redux/state';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginStep2 = (props: any) => {
    const dispatch = useDispatch()
    const [disable, setIsDisable] = useState<boolean>(true)
    const [inputs, setInputs] = useState<string>('');
    const [error, setError] = useState<string>('');
    // const {isRegistered} = useSelector((state: IRootState) => state.auth);
    // console.log("LoginMain2: " + isRegistered)

    const checkEmail = async () => {
        try {
            let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (inputs.match(mailFormat)) {
                setError("")
                const result = await dispatch(checkUserEmail({ email: inputs })).unwrap()
                await AsyncStorage.setItem('@email', inputs)
                result.isRegistered ? props.navigation.navigate("LoginStep3") : props.navigation.navigate("UserRegister")
            } else {
                setError("Enter a valid email address")
            }

        } catch (e) {
            console.log(e)
        }
    }

    //have text, can press the button
    useEffect(() => {
        withText()
    }, [inputs])

    const withText = () => {
        inputs ? setIsDisable(false) : setIsDisable(true)
    }

    // Platform.OS === 'ios' ? 200 : 100

    // const handleError = (error, input) => {
    //     setErrors(prevState => ({...prevState, [input]: error }));
    // };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.primaryColor} /> */}
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            <View style={styles.container} >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={disable} onPress={() => { checkEmail() }}>
                        <Text style={{fontSize:18, color: disable ? COLORS.light : COLORS.primaryColor }}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <View style={styles.upperPart}>
                        <View style={styles.logoContainer}>
                            <FontAwesomeIcon icon={faEnvelope} style={styles.email} size={60} />
                            <FontAwesomeIcon icon={faAt} style={styles.at} size={16} />
                            <View style={styles.logoBottom}>
                                <Text style={styles.logoText}>* * * *</Text>
                            </View>
                        </View>
                        <Text style={styles.h3}>What's your email?</Text>
                        <Text style={styles.p}>we'll check if you have an account</Text>
                        <Input label="Email" withText={withText} editable={true} value={inputs} error={error} maxLength={50} onChangeText={(text) => { setInputs(text) }}></Input>
                    </View>

                    <View style={styles.buttonContainer}>
                        {/* <Text style={{color:"Black"}}>{isRegistered ?123:456}</Text> */}
                        <Button
                            disabled={disable}
                            title="Continue"
                            onPress={() => {
                                checkEmail()
                            }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};
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
        // backgroundColor: 'yellow'
    },
    arrow: {
        color: COLORS.primaryColor,
    },
    logoContainer: {
        marginStart: 16,
        marginTop: 16,
        width: 64,
        height: 90,
        position: "relative",
        marginBottom: 10,
    },
    email: {
        color: COLORS.primaryColor,
    },
    at: {
        color: 'white',
        position: "absolute",
        top: 32,
        right: 3,
    },
    logoBottom: {
        width: 60,
        height: 24,
        textAlign: "center",
        backgroundColor: COLORS.primaryColor,
        borderRadius: 16,
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
        marginBottom: 16,
    },
    upperPart: {
        flex: 1,
    },
    buttonContainer: {
        marginBottom: 16,
    },
});


export default LoginStep2;