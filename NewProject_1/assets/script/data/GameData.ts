import { DbPlayer } from "./DbData";

export class GameData{

    static instance: GameData = new GameData();
    
    dbData: DbPlayer;

}