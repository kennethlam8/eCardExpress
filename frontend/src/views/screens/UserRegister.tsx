import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, SafeAreaView, StatusBar, TextInput, Button, TouchableOpacity, Platform, ScrollView } from 'react-native';
import COLORS from '../../conts/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import PersonFill from "react-native-bootstrap-icons/icons/person-fill";
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { userRegister } from '../../redux/auth/thunks';


const UserRegister = (props: any) => {
    const dispatch = useDispatch()
    const [disable, setIsDisable] = useState(true)
    const [inputs, setInputs] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const [errors, setErrors] = useState({ password: "", firstName: "", lastName: "" });

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

    const checkInput = async () => {
        try {
            let validName = /^[a-zA-Z]+$/
            let error = 0;
            setErrors({ password: "", firstName: "", lastName: "" })
            if (inputs.password.length < 5) {
                setErrors(prevState => ({ ...prevState, ["password"]: 'Password has to be at least 5 character long.' }));
                error += 1;
            }
            if (!inputs.firstName.match(validName)) {
                setErrors(prevState => ({ ...prevState, ["firstName"]: 'invalid first name' }));
                error += 1;
            }
            if (!inputs.lastName.match(validName)) {
                setErrors(prevState => ({ ...prevState, ["lastName"]: 'invalid last name' }));
                error += 1;
            }
            if (error > 0) {
                return
            }
            const result = await dispatch(userRegister(inputs)).unwrap()
            if (result) {
                props.navigation.navigate("EmailVerification")
            }
        } catch (e) {
            console.log(e)
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
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={disable} onPress={() => { checkInput() }}>
                        <Text style={{ fontSize: 18, color: disable ? COLORS.light : COLORS.primaryColor }}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <ScrollView style={styles.upperPart}>
                        <View style={styles.logoContainer}>
                            <View style={styles.bigCircle}>
                                <View style={styles.smallCircle}>
                                    <PersonFill fill={COLORS.white} width="60" height="60" viewBox="-2 -2 20 20" />
                                </View>
                            </View>
                            <View style={styles.plusLogo}>
                                <Text style={styles.plusText}>+</Text>
                            </View>
                        </View>
                        <Text style={styles.h3}>Let's get you started!</Text>
                        <Text style={styles.p}>First, create your eCardExpress account</Text>
                        <Input label="Email" editable={false} value={inputs.email}></Input>
                        <View style={styles.row}>
                            <View style={styles.columns}>
                                <Input label="First Name" editable={true} value={inputs.firstName} error={errors.firstName} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "firstName" })}></Input>
                            </View>
                            <View style={styles.columns}>
                                <Input label="Last Name" editable={true} value={inputs.lastName} error={errors.lastName} maxLength={20} onChangeText={text => handleOnchange({ text: text, input: "lastName" })}></Input>
                            </View>
                        </View>
                        <Input label="Password" password={true} withText={withText} editable={true} value={inputs.password} error={errors.password} maxLength={40} onChangeText={text => handleOnchange({ text: text, input: "password" })}></Input>
                        <View style={{ marginBottom: 8 }}></View>
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <Button
                            disabled={disable}
                            title="Continue"
                            onPress={() => checkInput()}
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
        height: 64,
        position: "relative",
        marginBottom: 16,
    },
    bigCircle: {
        width: 64,
        height: 64,
        borderRadius: 100,
        backgroundColor: "#89CFF0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    smallCircle: {
        width: 56,
        height: 56,
        borderRadius: 100,
        backgroundColor: COLORS.primaryColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    plusLogo: {
        width: 20,
        height: 20,
        borderRadius: 100,
        backgroundColor: "#4e4e4e",
        position: "relative",
        left: 45,
        bottom: 25,
    },
    plusText: {
        color: COLORS.white,
        lineHeight: 23,
        fontSize: 22,
        textAlign: "center",
    },
    upperPart: {
        flex: 1,
    },
    buttonContainer: {
        paddingVertical: 24,
        // backgroundColor: "white",
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
        marginBottom: 8,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 0,
    },
    columns: {
        width: "45%",
    }
});

export default UserRegister;