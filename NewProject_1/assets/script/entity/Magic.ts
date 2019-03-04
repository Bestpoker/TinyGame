import GameManager from "../game/GameManager";
import Utils from "./../utils/Utils";
import MagicData from "../data/MagicData";

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

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    res: MagicData = null;


    atlas: cc.SpriteAtlas;

    _resID: number = 0;
    get resID() { return this._resID; }
    set resID(res) {
        this._resID = res;
        if (this._resID > 0) {

            this.res = MagicData.resMap[this.resID];

            var self = this;

            Utils.LoadRes(this.res.resUrl, cc.AnimationClip, function (err, res) {
                if (err) {
                    console.error(err);
                }
                else {
                    var clip = <cc.AnimationClip>res;
                    self.animation.addClip(clip);
                    self.animation.play(clip.name);
                    self.scheduleOnce(function () { 
                        GameManager.instance.RemoveMagic(self);
                     }, clip.duration * clip.speed);
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
