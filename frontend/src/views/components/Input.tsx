import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import COLORS from '../../conts/colors';
import Eye from "react-native-bootstrap-icons/icons/eye-fill";
import EyeSlash from "react-native-bootstrap-icons/icons/eye-slash-fill";


// interface Error{
//     email: '', 
//     password: ''
// }

interface Props {
    label: string,
    withText?: () => void,
    onChangeText?: (text: string) => void,
    value: string,
    editable: boolean,
    password?: boolean,
    error?: string,
    maxLength?: number,
    // setInput: () => void,
    // error:Error,
    // password:Boolean,
    // onFocusFunction: ()=> void,
}


const Input = (props: Props,) => {
    const [hidePassword, setHidePassword] = useState(props.password);
    const [isFocused, setIsFocused] = useState(false);
    


    return (
        <View style={{ marginBottom: props.error? 8 :16 }}>
            <Text style={[style.label, { color: isFocused ? COLORS.black : COLORS.light }]}>{props.label}</Text>
            <View style={[style.inputContainer, { borderColor: props.error? COLORS.red :isFocused ? COLORS.black : COLORS.light }, { backgroundColor: props.editable ? "inherit" : COLORS.disable }]}>
                <TextInput
                    editable={props.editable}
                    selectTextOnFocus={props.editable}
                    value={props.value}
                    secureTextEntry={hidePassword}
                    autoCorrect={false}
                    maxLength={props.maxLength}
                    style={[style.input, { color: props.editable ? "inherit" : COLORS.light }]}
                    onFocus={() => {
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    onChangeText= {props.onChangeText}
                />

                {props.password && (
                    hidePassword ?
                        <Eye
                            onPress={() => setHidePassword(!hidePassword)}
                            width="10%" height="100%" viewBox="-0 -5 28 28" color={COLORS.primaryColor}
                        /> :
                        <EyeSlash
                            onPress={() => setHidePassword(!hidePassword)}
                            width="10%" height="100%" viewBox="-0 -5 28 28" color={COLORS.primaryColor} />
                )}
            </View>
            {props.error && (
                <Text style={style.error}>
                    {props.error}
                </Text>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    inputContainer: {
        height: 40,
        width: "100%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.light,
        flexDirection: 'row',
    },
    label: {
        marginLeft:5,
        marginVertical: 5,
        color: COLORS.light,
        fontSize: 14,
    },
    input: {
        fontSize: 14,
        color: "black",
        height: 40,
        width: "90%",
        paddingStart: 10,
    },
    eyeIcon: {
        color: COLORS.primaryColor,
        fontSize: 22,
    },
    error: {
        marginLeft: 5,
        marginTop: 1, 
        color: COLORS.red, 
        fontSize: 14, 
    },
    // labelPosition: {
    //     position: 'relative',
    // },
    // animatedStyle: {
    //     top: 0,
    //     left: 10,
    //     position: 'absolute',
    //     borderRadius: 90,
    //     zIndex: 10000,
    // },
    // LabelContainer:{
    //     backgroundColor: "white",
    //     zIndex: 10,
    //     position: 'absolute',
    // },
});

export default Input;