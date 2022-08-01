import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { showSocketNotice, SocketContext } from './Socket'; //setSocketUserId, socketUserId
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as RootNavigation from '../../../RootNavigation.js';
import { useDispatch, useSelector } from 'react-redux';
//import cardRequestReducer from '../../redux/card/reducer';
import { receiveNotification } from '../../redux/card/action';
import { IRootState } from '../../redux/state';

const socketCD = 5000

export const SocketListener = (props) => {
    const dispatch = useDispatch()
    const socket = useContext(SocketContext);
    const [networkStatus, setNetworkStatus] = useState(false);
    const { name, userId } = useSelector((state: IRootState) => state.userInfo);
   console.log("user id: ", userId);
    //const {socketUserId} = useSelector((state: IRootState) => state.card)
    //const [userId, setUserId] = useState('');
    //const [countReq, setCountReq] = useState(0)

    // async function FetchCardRequestCount() {
    //     let res = await fetch('/cardRequestedCount')
    //     let result = await res.json()
    //     let requestCount = result.data
    //     console.log("Count result:", requestCount)
    //     setCountReq
    //     if (requestCount > 0) {
    //         setCountReq(requestCount)
    //     } else {
    //         setCountReq(0)
    //     }
    // }

    const showRequest = () => {
        Toast.hide();
        RootNavigation.navigate("CardRequest")
    }

    const showToast = (data) => {
        //console.log("showing toast")
        Toast.show({
            type: 'success',
            text1: data,
            topOffset: 5,
            visibilityTime: 3000, //default 4000  
            autoHide: true,
            onPress: showRequest
        });
    }

    const setUpSocketListener = () => {
        console.log(`${userId}: header socket set for listen`);
        socket.emit("client_connect", userId);

        //only the first login receive notification, coz only found first socket id in user list 
        socket.on("newCardRequest", async (data) => {
            console.log(`Receive message: `, data);
            if (showSocketNotice) {
                showToast(data.content)
                await dispatch(receiveNotification({ requestReceived: true }))
            }
            //FetchCardRequestCount()
        });

        socket.on('event_updated', (id) => {
            console.log(`event ${id} is updated!!`)
        })
    }
    //if (networkStatus) {
        if (!(userId == "" || userId == undefined)) {
            console.log("user has id ", userId);
            setUpSocketListener()
        } else {
            console.log("no user id - ", userId);
        }
    useEffect(() => {
        //for testing only        
        //let userId = 'admin#1'

        const unsubscribe = NetInfo.addEventListener(state => {
            //console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setNetworkStatus(state.isConnected ? true : false)
        });
      
    }, [socket, networkStatus]); 

    /* return (
        <View>
            <Text>Click the button to send a request to join chat!</Text>
            <TouchableOpacity
                onPress={() => {
                    showToast("Hello world")
                }}>
                <Text>Join Chat</Text>
            </TouchableOpacity>
        </View>
    ); */
};