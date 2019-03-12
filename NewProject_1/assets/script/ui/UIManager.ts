import MainUI from "./MainUI";

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
    mainUI: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        UIManager.instance = this;

        for (let index = 0; index < this.layerCount; index++) {
            const element = this.layerCount[index];
            var node = new cc.Node('Layer_' + index);
            node.setParent(this.node);
            this.allLayer[index] = node;
        }

        var _mainUI = cc.instantiate(this.mainUI) as cc.Node;
        _mainUI.setParent(this.allLayer[_mainUI.getComponent(MainUI).uiLayer]);


    }

    start() {

    }

    // update (dt) {}

}
