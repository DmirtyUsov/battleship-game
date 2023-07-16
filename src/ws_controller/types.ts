import WebSocket from "ws";
export enum WSSCmd {
  // Player
  reg = 'reg',
  update_winners = 'update_winners',
  // Room
  create_room = 'create_room',
  add_user_to_room = 'add_user_to_room',
  create_game = 'create_game',
  update_room = 'update_room',
  // Ships
  add_ships = 'add_ships',
  start_game = 'start_game',
  // Game
  attack = 'attack',
  randomAttack = 'randomAttack',
  turn = 'turn',
  finish = 'finish',
};

export interface WebSocket2 extends WebSocket{
  userId: number,
  userRoomId: number,
}
export interface WSSMessage {
	type: WSSCmd,
	data: string,
	id: number, // always 0
}

export type Client = {
  [key: number] : WebSocket2 | undefined,
  }

export interface User {
  index: number;
  name: string;
  password?: string;
  error?: boolean;
  errorText?: string;
}

export interface Room {
  roomId: number,
  roomUsers: User[],
}

export interface Game {
  gameId: number,
  room: Room;
}
enum ShipSize {
  small = "small",
  medium = "medium",
  large = "large",
  huge = "huge"
}

export interface Position {
  x: number,
  y: number
}

export interface Ship {
  position: Position,
  direction: boolean,
  length: number,
  type: ShipSize

}
