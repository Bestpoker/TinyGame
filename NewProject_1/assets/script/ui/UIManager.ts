import MainUI from "./MainUI";
import RoleUI from "./RoleUI";

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
export default class UIManager extends cc.Component {

    static instance: UIManager;

    @property(Number)
    layerCount: Number = 10;

    allLayer: { [ID: number]: cc.Node; } = {

    };

    @property(cc.Prefab)
    mainUIPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roleUIPrefab: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        UIManager.instance = this;

        for (let index = 0; index < this.layerCount; index++) {
            const element = this.layerCount[index];
            var node = new cc.Node('Layer_' + index);
            node.setParent(this.node);
            this.allLayer[index] = node;
        }

        this.OpenMainUI();


    }

    start() {

    }

    // update (dt) {}

    OpenMainUI(){
        var ui = cc.instantiate(this.mainUIPrefab) as cc.Node;
        ui.setParent(this.allLayer[ui.getComponent(MainUI).uiLayer]);
    }

    CloseMainUI(){
        if(MainUI.instance.node.isValid){
            MainUI.instance.node.destroy();
        }
    }

    OpenRoleUI(){
        var ui = cc.instantiate(this.roleUIPrefab) as cc.Node;
        ui.setParent(this.allLayer[ui.getComponent(RoleUI).uiLayer]);
    }

    CloseRoleUI(){
        if(RoleUI.instance.node.isValid){
            RoleUI.instance.node.destroy();
        }
    }

}
