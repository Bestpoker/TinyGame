import UIManager from "./UIManager";
import { DbPlayerData } from "../data/DbPlayerData";
import { GameData } from "../data/GameData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoleUI extends cc.Component {

    static instance: RoleUI;

    @property(Number)
    uiLayer: number = 0;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    @property(cc.Prefab)
    roleItem: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RoleUI.instance = this;

        this.closeBtn.node.on('click', this.OnClickCloseBtn, this);
    }

    start () {

    }

    // update (dt) {}

    OnClickCloseBtn(){
        UIManager.instance.CloseRoleUI();
    }
    
    OnOpenUI(){
        if(GameData.instance.playerData.roles != null){
            var array = GameData.instance.playerData.roles;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                
            }
        }
    }

}
