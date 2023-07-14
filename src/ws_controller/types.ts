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

export interface WSSMessage {
	type: WSSCmd,
	data: string,
	id: number, // always 0
}
