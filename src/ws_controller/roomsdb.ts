import { Room } from './types';

const START_INDEX = 1;
type dbRooms = { [id: number]: Room };

export class RoomsDB {
    private rooms:dbRooms;
    private index:number;

    constructor () {
        this.rooms = {};
        this.index = START_INDEX;
    };

    create(index: number, name: string): Room {
        let newRoom:Room;

        newRoom = {
            roomId:this.index++,
            roomUsers: [{index, name}]
        }
        this.rooms[newRoom.roomId] = newRoom;

        return newRoom;
    };

    listRoomsSingleUser():Room[] {
        const roomsArr = Object.values(this.rooms);
        return roomsArr.filter((item) => item.roomUsers.length === 1)
    }
}