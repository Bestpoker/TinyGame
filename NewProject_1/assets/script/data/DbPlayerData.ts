import Role from "../entity/Role";
import { RoleData } from "./RoleData";

export class DbPlayerData{

    _id: string = "";

    _openid: string = "";
    
    playerID: number = 0;

    playerName: string = "";

    gameLevel: number = 1;

    gold: number = 0;

    roles: Array<DbRoleData> = new Array<DbRoleData>();

}

export class DbRoleData{
    
    roleID: number = 0;

    roleName: string = "";

}