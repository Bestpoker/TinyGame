import Data from "./Data";

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
export default class Game extends cc.Component {

    public static instance: Game = null;

    @property(cc.Node)
    backGround: cc.Node = null;

    @property(cc.Node)
    bulletParent: cc.Node = null;

    @property(cc.Node)
    mainCamera: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Game.instance = this;
        Data.instance.mapMinX = this.backGround.width / 2;
        Data.instance.mapMinY = this.backGround.height / 2;
    }

    start () {

    }

    // update (dt) {}
}
