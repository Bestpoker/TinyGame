import GameManager from "./GameManager";
import Utils from "./Utils";

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
export default class Magic extends cc.Component {

    @property(cc.Animation)
    animation: cc.Animation = null;

    resName: string = "";

    _resID: number = 0;
    get resID() { return this._resID; }
    set resID(res) {
        this._resID = res;
        if (this._resID > 0) {
            this.resName = "animation/magic/magic_" + this._resID;
            var self = this;
            Utils.LoadRes(this.resName, cc.AnimationClip, function (err, clip) {
                if (err) {
                    console.error(err);
                }
                else {
                    var clip1 = <cc.AnimationClip>clip;
                    self.animation.addClip(<cc.AnimationClip>clip1);
                    self.animation.play();
                    self.scheduleOnce(function () { GameManager.instance.RemoveMagic(self) }, clip1.duration * clip1.speed);
                }
            });
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start() {

    // }

    // update (dt) {}

    MyUpdate(dt: any) {


    }
}
