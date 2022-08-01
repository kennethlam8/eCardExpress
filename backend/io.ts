import socketIO from 'socket.io'
import http from 'http'
import { Request, Response, NextFunction } from 'express'
import MessageStore from "./messageStore";
//import { sessionMiddleware } from './session'

export let io: socketIO.Server

export let users: any = [];
export let messageStore = new MessageStore();

function getUserBySocketID(socketID: string) {
    return users.find((player: any) => player.id == socketID);
}

export function getUserByUserName(userName: string) {
    return users.find((player: any) => player.username == userName);
}

export function removeUserByUserName(userName: string) {    
    //console.log("original socket user list ", users);
    users = users.filter((user: any) => user.username != userName);
    console.log("Socket removed ", userName);
    console.log('remaining user1: ', users)
    //console.log("updated socket user list ", users);
}

export function createIOServer(server: http.Server) {
  io = new socketIO.Server(server)
  /* io.use((socket, next) => {
    let req = socket.request as Request
    let res = req.res
    //sessionMiddleware(req, res, next as NextFunction)
  }) */
  io.on('connection', socket => {
    console.log("client connected");
    socket.onAny((event, ...args) => {
        console.log(`socket_event :[${event}]`, args);
    });

    socket.on("disconnectAll", () => {
        console.log("disconnectAll");
        io.emit("disconnectAll");
    });

    /* socket.on("private_message", ({ content, to }) => {
        socket.to(to).emit("private_message", {
            content,
            from: getUserBySocketID(socket.id),
        });
        let message = {
            from: getUserBySocketID(socket.id),
            to: getUserBySocketID(to),
            content,
        };
        messageStore.saveMessage(message);
        let testFindResult = messageStore.findMessagesForUser(to);
        console.log("testFindResult = ", testFindResult);
    }); */

    socket.on("client_connect", (user) => {
        let userObj = {
            id: socket.id,
            username: user,
        };
        //removeUserByUserName(user)
        users.push(userObj);
        console.log(`${user}:${socket.id} has opened the app`);
        console.log("Current user: ", users)
        //socket.emit("init_room_list", users);
        //io.emit("new_player", userObj);
    });

    socket.on("disconnect", (reason) => {
        const presentUser = getUserBySocketID(socket.id);
        if(!presentUser){
            console.log("User not found")
            return
        }
        console.log('disconnect reason: ', reason);
        //users = users.filter((user: any) => user != presentUser);
        removeUserByUserName(presentUser)
        //io.emit("player_left", presentUser);
        console.log(`${presentUser.username}:${presentUser.id} has left the app`);
        console.log('remaining user: ', users)
    });

    // socket.on("SEND_JOIN_REQUEST", () => {
    //     console.log("Join request receive");
    //     io.emit("JOIN_REQUEST_ACCEPTED");
    // });
  })

  return io
}
