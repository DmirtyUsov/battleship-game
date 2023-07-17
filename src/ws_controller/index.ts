import { RoomsDB } from "./roomsdb.js";
import { User, Client, WSSCmd, WSSMessage, WebSocket2, Room } from "./types.js";
import { UsersDB } from "./usersdb.js";

interface WSSResponse {
    connection: WebSocket2,
    message: WSSMessage
}

const clients: Client = {};
const users = new UsersDB();
const rooms = new RoomsDB();


const handleCmd = (message: WSSMessage, wsc: WebSocket2): WSSResponse[] => {
  let type: WSSCmd = message.type;
  const payload = message.data ? JSON.parse(message.data) : '';
  let data = '';

  const responses: WSSResponse[] = [];

  switch (message.type) {
    case WSSCmd.reg: {
      const newUser: User = users.add(payload.name, payload.password);
      if (!newUser.error) {
        if (clients[newUser.index]) {
          newUser.error = true;
          newUser.errorText = 'User already connected';
        } else {
          wsc.userId = newUser.index;
          clients[newUser.index] = wsc;
        }
      }
      data = JSON.stringify(newUser);
      responses.push({ connection: wsc, message: { type, data, id: 0 } });
      break;
    }
    case WSSCmd.create_room: {
      if (!wsc.userRoomId) {
        // one room per user?
        const currentUser = users.getById(wsc.userId);
        const newRoom = rooms.create(currentUser.index, currentUser.name);
        wsc.userRoomId = newRoom.roomId;
      }
      const roomsSingle: Room[] = rooms.listRoomsSingleUser();
      type = WSSCmd.update_room;
      data = JSON.stringify(roomsSingle);
      Object.values(clients).forEach((connection) => {
        if (connection) {
          responses.push({ connection, message: { type, data, id: 0 } })
        }
      });
      break;
    }

    case WSSCmd.add_user_to_room: {
      if (payload.indexRoom !== wsc.userRoomId) {
        rooms.addToRoom(payload.indexRoom, wsc.userRoomId);
      }
      const roomsSingle: Room[] = rooms.listRoomsSingleUser();

      type = WSSCmd.update_room;
      data = JSON.stringify(roomsSingle);
      break;
    }
  }
  return responses;
};

export const controlWSConnection = (wsc: WebSocket2) => {
    console.log('a client connected');

    wsc.on('open', () => {
        console.log('Opened');
    });

    wsc.on('message', (data) => {
        const messageIn: WSSMessage = JSON.parse(data.toString());
        console.log('Message from client', messageIn);
        const responses = handleCmd(messageIn, wsc);
        responses.forEach((response) => {
            if(response.connection) {
                const messageOutTxt = JSON.stringify(response.message);
                response.connection.send(messageOutTxt);
                console.log('Message to Client', response.message);
            }
        });
    });

    wsc.on('close', () => {
        if(wsc.userId) {
            clients[wsc.userId] = undefined; // users index always in clients for simplicity
        }
    });

    wsc.on('error', console.error);
} 
