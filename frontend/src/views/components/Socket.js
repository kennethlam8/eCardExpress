import { createContext } from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect(process.env.REACT_NATIVE_APP_HOSTING);
export const SocketContext = createContext();
export let socketUserId = '';
export function setSocketUserId(userId) {
    socketUserId = userId
    console.log("set socket user: ", socketUserId);
}
export let showSocketNotice = true;