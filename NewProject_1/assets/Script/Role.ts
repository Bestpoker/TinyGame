import ShaderComponent from "./ShaderComponent";
import { ShaderType } from "./ShaderManager";
import GameManager, { Grid } from "./GameManager";
import Utils from "./Utils";
import RoleRes from "./Res/RoleRes";

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

  isJumping = false;

  lastJumpTime = 0;

  jumpCooldown = 0.5;

  jumpSpeed = 500;

  res: RoleRes = null;

  _resID: number = 0;
  get resID() { return this._resID; }
  set resID(res) {
    this._resID = res;
    if (this._resID > 0) {

      this.res = RoleRes.resMap[this.resID];

      var self = this;
      Utils.LoadRes(this.res.resUrl, cc.SpriteFrame, function (err, res) {
        if (err) {
          console.error(err);
        }
        else {
          self.sprite.spriteFrame = res;
        }
      });
    }
  }

  target: Role = null;

  teamType: TeamType = TeamType.Non;

  grid: Grid = null;

  lastAttackTime = 0;


  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  // start() {

  // }

  // update(dt) {

  // }

  UpdateRole(dt) {

    if (this.node.getNumberOfRunningActions() == 0) {
      if (this.target) {
        var selfDis = this.target.node.position.sub(this.node.position).mag();
        if (selfDis > this.res.attackRange) {
          this.SeekEnemy();
        }
      }
      else {
        this.SeekEnemy();
      }

      if (this.target) {
        var selfDis = this.target.node.position.sub(this.node.position).mag();
        if (selfDis <= this.res.attackRange) {
          this.Attack();
        }
        else {
          //应该寻找合适的格子跳过去
          var min = -1;
          var dest: cc.Vec2;
          for (let key in GameManager.instance.gridMap) {
            var grid = GameManager.instance.gridMap[key];
            if (grid.role == null && grid.role != this) {
              var selfDis = grid.postion.sub(this.node.position).mag();
              var taregetDis = grid.postion.sub(this.target.node.position).mag();
              if (selfDis <= this.res.moveRange) {
                if (min == -1 || taregetDis < min) {
                  min = taregetDis;
                  dest = grid.postion;
                }
              }
            }
          }

          if (min != -1) {
            this.Jump(dest);
          }

        }
      }
    }


  }

  SeekEnemy() {
    var array: Array<Role> = null;
    if (this.teamType == TeamType.Player) {
      array = GameManager.instance.monsters;
    }
    else if (this.teamType == TeamType.Monster) {
      array = GameManager.instance.players;
    }

    var dis: number = -1;
    if (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].isJumping) {
          continue;
        }
        var temp = array[i].node.position.sub(this.node.position).mag();
        if (dis == -1 || temp < dis) {
          dis = temp;
          this.SetTarget(array[i]);
        }
      }
    }
  }

  SetTarget(target: Role) {
    if (target) {
      this.target = target;
    }
  }

  Jump(dest: cc.Vec2) {
    var now = Date.now();
    if (now - this.lastJumpTime > this.jumpCooldown * 1000 &&  this.node.getNumberOfRunningActions() == 0) {
      this.isJumping = true;
      var time = dest.sub(this.node.position).mag() / this.jumpSpeed;

      var self = this;
      var finished = cc.callFunc(function () {
        self.isJumping = false;
      });

      var myAction = cc.sequence(cc.moveTo(time, dest), finished);

      this.node.runAction(myAction);
      this.node.runAction(cc.sequence(
        cc.scaleTo(time / 2.0, 1.5, 1.5),
        cc.scaleTo(time / 2.0, 1, 1),
      ));

      this.lastJumpTime = now;
    }

  }

  Attack() {
    var now = Date.now();
    if (now - this.lastAttackTime > this.res.attackSpeed * 1000) {
      if (this.node.getNumberOfRunningActions() == 0) {
        if (this.target != null && !this.target.isJumping) {
          var action = cc.sequence(
            cc.rotateTo(0.05, -10),
            cc.rotateTo(0.1, 10),
            cc.rotateTo(0.05, 0),
          );
          this.node.runAction(action);
          GameManager.instance.CreateMagic(1, this.target.node.position);
          this.target.Hurt();
          this.lastAttackTime = now;
        }
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
