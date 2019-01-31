import Monster from "./Monster";

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
export default class NewClass extends cc.Component {

@property(Monster)
pig: Monster;

    Monsters: Array<Monster> = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.Monsters.push(this.pig);
    }

     update (dt){
          for(var i = 0; i < this.Monsters.length; i++){
            this.Monsters[i].Run(dt);
          }
      }
}
