// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleData {

    ID: number = 0;
    resUrl: string = "";
    maxHp: number = 0;
    attack: number = 0;
    attackRange: number = 0;
    attackSpeed: number = 0;
    moveRange: number = 0;

    static resMap: { [ID: number]: RoleData; } = {
        1: { ID: 1, resUrl: "model/role/character_1", maxHp: 400, attack: 200, attackRange: 150, attackSpeed: 2, moveRange: 150 },
        2: { ID: 2, resUrl: "model/role/creature_1", maxHp: 200, attack: 50, attackRange: 100, attackSpeed: 2, moveRange: 100 },
    };

}
