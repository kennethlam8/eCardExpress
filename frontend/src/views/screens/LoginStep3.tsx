import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, SafeAreaView, StatusBar, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import COLORS from '../../conts/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import ShieldLockFill from "react-native-bootstrap-icons/icons/shield-lock-fill";
import Input from '../components/Input';
import { checkUserPassword } from '../../redux/auth/thunks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { UserStatus } from '../../redux/auth/state';
import { IRootState } from '../../redux/state';


const LoginStep3 = (props: any) => {
    const dispatch = useDispatch()
    const [disable, setIsDisable] = useState(true)
    const [error, setError] = useState<string>('');
    const [inputs, setInputs] = useState({ email: "", password: "" });
    // const isLoggedIn = useSelector((state: IRootState) => state.auth.isLoggedIn);
    // const email = useSelector((state: IRootState) => state.auth.email);
    // console.log("LoginPage3:" + email)
    // console.log("LoginPage3 isLoggedin:" + isLoggedIn)

    //have text, can press the button
    useEffect(() => {
        withText()
    }, [inputs.password])

    //page reloading
    useEffect(() => {
        getData()
    }, [])

    //get data from async storage
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@email')
            if (value !== null) {
                setInputs(prevState => ({ ...prevState, ['email']: value }));
            }
        } catch (e) {
            console.log(e)
        }
    }

    const checkPassword = async () => {
        try {
            if (inputs.password.length < 5) {
                setError('Password has to be at least 5 character long.')
                return
            }
            const result = await dispatch(checkUserPassword(inputs)).unwrap()
            if (result.isVerified) {
                await AsyncStorage.setItem('@isLoggedIn', "yes")
                let value = await AsyncStorage.getItem('@isLoggedIn')
                if (value) props.navigation.navigate("Footer", { screen: 'Home' })    //navigate to certain screen of bottom navigator
            } else {
                props.navigation.navigate("EmailVerification")
            }
        } catch (e) {
            if (typeof e == "string") {
                setError(e)
            }
        }
    }

    const withText = () => {
        inputs.password ? setIsDisable(false) : setIsDisable(true)
    }

    const handleOnchange = (options: { text: string, input: string }) => {
        const { text, input } = options
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={COLORS.primaryColor} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={disable} onPress={() => { checkPassword() }}>
                        <Text style={{ fontSize:18, color: disable ? COLORS.light : COLORS.primaryColor }}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <View style={styles.upperPart}>
                        <View style={styles.logoContainer}>
                            <ShieldLockFill fill={COLORS.primaryColor} width="60" height="60" viewBox="-1 -1 20 20" />
                            <View style={styles.logoBottom}>
                                <Text style={styles.logoText}>* * * *</Text>
                            </View>
                        </View>
                        <Text style={styles.h3}>Log in with your email</Text>
                        <Input label="Email" editable={false} value={inputs.email}></Input>
                        <Input label="Password" password={true} withText={withText} editable={true} value={inputs.password} error={error} maxLength={40} onChangeText={text => handleOnchange({ text: text, input: "password" })}></Input>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            disabled={disable}
                            title="Continue"
                            onPress={() =>
                                checkPassword()
                                // props.navigation.navigate('Footer')
                            }
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
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
        width: 64,
        height: 90,
        position: "relative",
        marginBottom: 10,
    },
    upperPart: {
        flex: 1,
    },
    buttonContainer: {
        marginBottom: 16,
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
});


export default LoginStep3;