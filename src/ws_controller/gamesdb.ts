import { Room, Ship } from "./types"

const START_INDEX = 1;

type Game = {
    index:number,
    room:Room,
    [key:number]:Ship[] // users board
}
type dbGames = { [id: number]: Game };

export class GamesDB {
  private games: dbGames = {};
  private index: number = START_INDEX;

  create() {
    
  }
}