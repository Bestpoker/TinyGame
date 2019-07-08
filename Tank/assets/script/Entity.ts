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
export default class Entity extends cc.Component {

    isDead = false;

    currentHp = 0;
    
    private _maxHp = 0;

    get maxHp(): number{
        return this._maxHp;
    }
    set maxHp(value: number){
        this._maxHp = value;
        this.currentHp = this._maxHp;
    }

    // LIFE-CYCLE CALLBACKS:

    Init(){
        this.isDead = false;
        this.currentHp = this.maxHp;
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    

}
