import { User, Client, WSSCmd, WSSMessage, WebSocket2 } from "./types.js";
import { UsersDB } from "./usersdb.js";

const clients: Client = {};
const users = new UsersDB();


const handleCmd = (message: WSSMessage,wsc: WebSocket2): WSSMessage => {
    let type: WSSCmd = message.type;
    const payload = message.data ? JSON.parse(message.data) : '';
    let data = '';

    switch (message.type) {
        case WSSCmd.reg: {
            const newUser:User = users.add(payload.name, payload.password);
            if(!newUser.error) {
                if(clients[newUser.index]) {
                    newUser.error = true;
                    newUser.errorText = 'User already connected';
                } else {
                    wsc.userId = newUser.index;
                    clients[newUser.index] = wsc;
                }
            }
            data = JSON.stringify(newUser);
            break;
        }
    }
    const response: WSSMessage = {type, data, id:0}
    return response;
};

export const controlWSConnection = (wsc: WebSocket2) => {
    console.log('a client connected');

    wsc.on('open', () => {
        console.log('Opened');
    });

    wsc.on('message', (data) => {
        const messageIn: WSSMessage = JSON.parse(data.toString());
        console.log('Message from client', messageIn);
        const messageOut = handleCmd(messageIn, wsc);
        console.log('Message to Client', messageOut);
        wsc.send(JSON.stringify(messageOut));
    });

    wsc.on('close', () => {
        if(wsc.userId) {
            clients[wsc.userId] = undefined; // users index always in clients for simplicity
        }
    });

    wsc.on('error', console.error);
} 
