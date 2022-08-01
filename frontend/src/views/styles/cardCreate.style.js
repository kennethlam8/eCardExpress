import { StyleSheet } from 'react-native';
import common from './common.style.js';
import COLORS from '../../conts/colors';

export default StyleSheet.create({
    firstBtn: {
        ...common.btn,
        backgroundColor: 'blue'
    },
    secondBtn: {
        ...common.btn,
        backgroundColor: 'red'
    },
    container: {
        padding: 10,
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
    }
});