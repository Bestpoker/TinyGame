import { DbPlayerData } from "./DbPlayerData";

export class GameData{

    static instance: GameData = new GameData();
    
    playerData: DbPlayerData = new DbPlayerData();

}