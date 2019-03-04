import { DbPlayer } from "./DbData";

export class GameData{

    static instance: GameData = new GameData();
    
    playerData: DbPlayer = new DbPlayer();

}