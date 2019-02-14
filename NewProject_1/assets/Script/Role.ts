import Monster, { Direction } from "./Monster";
import ShaderComponent from "./ShaderComponent";
import { ShaderType } from "./ShaderManager";
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

export enum TeamType {
  Non = 0,
  Player = 1,
  Monster = 2,
}

@ccclass
export default class Role extends cc.Component {

  @property(ShaderComponent)
  shaderCom: ShaderComponent = null;

  @property(cc.Sprite)
  sprite: cc.Sprite = null;

  isJumping: boolean = false;

  jumpSpeed: number = 500;

  attackRange: number = 150;

  resName: string = "";

  _resID: number = 0;
  get resID() { return this._resID; }
  set resID(res) {
    this._resID = res;
    if (this._resID > 0) {
      this.resName = "model/role/character_" + this._resID;
      var self = this;
      Utils.LoadRes(this.resName, cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          console.error(err);
        }
        else {
          self.sprite.spriteFrame = spriteFrame;
        }
      });
    }
  }

  target: Role = null;

  teamType: TeamType = TeamType.Non;


  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  // start() {

  // }

  // update(dt) {

  // }


  MyUpdate(dt: any) {
    var array: Array<Role> = null;
    if(this.teamType == TeamType.Player){
      array = GameManager.instance.monsters;
    }
    else if(this.teamType == TeamType.Monster){
      array = GameManager.instance.players;
    }

    var dis: number = 0;
    for (var i = 0; i < array.length; i++) {
      dis = array[i].node.position.sub(this.node.position).mag();
      if(dis == 0){

      }
    }
  }

  SetTarget(target: Role) {
    this.target = target;
  }

  Jump(dest: cc.Vec2) {
    if (this.node.getNumberOfRunningActions() == 0) {
      this.isJumping = true;
      var time = dest.sub(this.node.position).mag() / this.jumpSpeed;

      var finished = cc.callFunc(function () {
        this.isJumping = false;
      });
      var myAction = cc.sequence(cc.moveTo(time, dest), finished);

      this.node.runAction(myAction);
      this.node.runAction(cc.sequence(
        cc.scaleTo(time / 2.0, 0.75, 0.75),
        cc.scaleTo(time / 2.0, 0.5, 0.5),
      ));
    }

  }

  Attack() {
    if (this.node.getNumberOfRunningActions() == 0) {
      if (this.target != null) {
        var action = cc.sequence(
          cc.rotateTo(0.05, -10),
          cc.rotateTo(0.1, 10),
          cc.rotateTo(0.05, 0),
        );
        this.node.runAction(action);
        GameManager.instance.CreateMagic(1, cc.v2(200, 200));
      }

    }
  }

  Hurt() {
    if (this.shaderCom) {
      this.unschedule(this.Recover);
      this.shaderCom.shader = ShaderType.Hurt;
      this.scheduleOnce(this.Recover, 0.1);
    }
  }

  Recover() {
    this.shaderCom.shader = ShaderType.Default;
  }


  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.w:
        this.Jump(this.node.position.add(cc.v2(0, 100)));
        break;
      case cc.macro.KEY.s:
        this.Jump(this.node.position.add(cc.v2(0, -100)));
        break;
      case cc.macro.KEY.a:
        this.Jump(this.node.position.add(cc.v2(-100, 0)));
        break;
      case cc.macro.KEY.d:
        this.Jump(this.node.position.add(cc.v2(100, 0)));
        break;
      case cc.macro.KEY.f:
        this.Attack();
        break;
      case cc.macro.KEY.g:
        this.Hurt();
        break;
    }
  }

}
