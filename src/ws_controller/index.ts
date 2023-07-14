import WebSocket from "ws";
import { WSSMessage } from "./types.js";

export const controlWSConnection = (wsc: WebSocket) => {
    console.log('a user connected');
    wsc.on('open', () => {
        console.log('Opened');
    });
    wsc.on('message', (data) => {
        const wsMessage: WSSMessage = JSON.parse(data.toString());
        console.log('Message from client', wsMessage);
    });
    wsc.on('close', () => {
        console.log('Closed');
    });
    wsc.on('error', console.error);
} 
