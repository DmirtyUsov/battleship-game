import { RoomsDB } from "./roomsdb.js";
import { User, Client, WSSCmd, WSSMessage, WebSocket2, Room } from "./types.js";
import { UsersDB } from "./usersdb.js";

const clients: Client = {};
const users = new UsersDB();
const rooms = new RoomsDB();


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
        case WSSCmd.create_room: {
            if(!wsc.userRoomId) { // one room per user?
                const currentUser = users.getById(wsc.userId);
                const newRoom = rooms.create(currentUser.index, currentUser.name);
                wsc.userRoomId = newRoom.roomId;
            }
            const roomsSingle: Room[] = rooms.listRoomsSingleUser();
            
            type = WSSCmd.update_room;
            data = JSON.stringify(roomsSingle); 
            break;
        }

        case WSSCmd.add_user_to_room: {
            if(payload.indexRoom !== wsc.userRoomId) {
                rooms.addToRoom(payload.indexRoom, wsc.userRoomId);
            }
            const roomsSingle: Room[] = rooms.listRoomsSingleUser();

            type = WSSCmd.update_room;
            data = JSON.stringify(roomsSingle); 
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
        const messateOutTxt = JSON.stringify(messageOut);
        console.log('Message to Client', messageOut);
        switch(messageOut.type) {
            case WSSCmd.update_room: {
                Object.values(clients).forEach((connestion) => {
                    if(connestion) {
                        connestion.send(messateOutTxt);
                    }
                })
                break;
            }
            default: {
                wsc.send(messateOutTxt);
            }
        }
    });

    wsc.on('close', () => {
        if(wsc.userId) {
            clients[wsc.userId] = undefined; // users index always in clients for simplicity
        }
    });

    wsc.on('error', console.error);
} 
