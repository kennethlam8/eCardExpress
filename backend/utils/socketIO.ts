import socketIO from 'socket.io'
import { logger } from './logger';

let io : socketIO.Server


export function setSocketIO(value :socketIO.Server){
    io = value
    io.on('connection',(socket)=>{
        logger.info(`${socket.id} is connected`);
    })
}