import { createAction } from '@reduxjs/toolkit'

const receiveNotification = createAction<{
    requestReceived:boolean
}>('notification')

const setSocketUserId = createAction<{
    socketUserId:string
}>('setupUserSockerId')


export { receiveNotification, setSocketUserId}