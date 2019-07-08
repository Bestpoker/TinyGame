import Entity from "./Entity";
import Bullet from "./Bullet";
import Tank from "./Tank";
import Game from "./Game";

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
export default class GameItem extends Entity {

    

    // LIFE-CYCLE CALLBACKS:

    Init(){
        super.Init();
    }

    onLoad () {
        
    }

    start () {

    }

    // update (dt) {}

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        // console.log('on collision enter');

        var otherTank = other.getComponent(Tank);
        if (otherTank != null) {
            otherTank.BeAttacked(this.currentHp);
            return;
        }
    }

    BeAttacked(value: number){
        this.currentHp -= value;
        if(this.currentHp <= 0){
            Game.instance.DestroyGameItem(this);
        }
    }

    
}
