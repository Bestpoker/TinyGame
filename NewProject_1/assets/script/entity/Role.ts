import ShaderComponent from "../shader/ShaderComponent";
import { ShaderType } from "../shader/ShaderManager";
import GameManager, { Grid } from "../game/GameManager";
import Utils from "../utils/Utils";
import { RoleData } from "../data/RoleData";

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

  unAttackable = false;

  lastJumpTime = 0;

  jumpCooldown = 0.5;

  jumpSpeed = 500;

  res: RoleData = null;

  _resID: number = 0;
  get resID() { return this._resID; }
  set resID(res) {
    if (this._resID != res) {
      this._resID = res;
      this.sprite.spriteFrame = null;
      if (this._resID > 0) {

        this.res = RoleData.resMap[this.resID];

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

    this.Init();

  }

  target: Role = null;

  teamType: TeamType = TeamType.Non;

  grid: Grid = null;

  lastAttackTime = 0;

  currentHp: number;

  currentMp = 0;

  isDead: boolean = false;

  Init() {
    this.node.stopAllActions();

    if (this.shaderCom) {
      this.shaderCom.shader = ShaderType.Default;
    }

    this.currentHp = this.res.maxHp;
    this.currentMp = 0;
    this.unAttackable = false;

    this.lastJumpTime = 0;
    this.target = null;
    this.lastAttackTime = 0;
    this.isDead = false;
  }


  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  // start() {

  // }

  // update(dt) {

  // }

  UpdateRole(dt) {

    if (this.node.getNumberOfRunningActions() == 0) {
      if (this.target && !this.target.isDead) {
        var selfDis = this.target.grid.position.sub(this.grid.position).mag();
        if (selfDis > this.res.attackRange * GameManager.instance.gridSize) {
          this.SeekEnemy();
        }
      }
      else {
        this.SeekEnemy();
      }

      if (this.target && !this.target.isDead) {
        var selfDis = this.target.grid.position.sub(this.grid.position).mag();
        if (selfDis <= this.res.attackRange * GameManager.instance.gridSize) {
          this.Attack();
        }
        else {

          var now = Date.now();
          if (now - this.lastJumpTime > this.jumpCooldown * 1000 && this.node.getNumberOfRunningActions() == 0) {
            //应该寻找合适的格子跳过去
            var min = -1;
            var dest: cc.Vec2;
            for (let key in GameManager.instance.gridMap) {
              var grid = GameManager.instance.gridMap[key];
              if (GameManager.instance.CanEnterGrid(grid.position)) {
                var selfDis = grid.position.sub(this.grid.position).mag();
                var taregetDis = grid.position.sub(this.target.grid.position).mag();
                if (selfDis <= this.res.moveRange * GameManager.instance.gridSize) {
                  if (min == -1 || taregetDis < min) {
                    min = taregetDis;
                    dest = grid.position;
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
        // if (array[i].unAttackable) {
        //   continue;
        // }
        var temp = array[i].grid.position.sub(this.grid.position).mag();
        if (dis == -1 || temp < dis) {
          dis = temp;
          this.SetTarget(array[i]);
        }
      }
    }
  }

  SetTarget(target: Role) {
    if (target && !target.isDead) {
      this.target = target;
    }
  }

  Jump(dest: cc.Vec2) {

    this.unAttackable = true;
    var time = dest.sub(this.grid.position).mag() / this.jumpSpeed;

    var self = this;
    var finished = cc.callFunc(function () {
      self.lastJumpTime = Date.now();
      self.unAttackable = false;
    });

    var myAction = cc.sequence(cc.moveTo(time, dest), finished);

    this.node.runAction(myAction);
    this.node.runAction(cc.sequence(
      cc.scaleTo(time / 2.0, 1.5, 1.5),
      cc.scaleTo(time / 2.0, 1, 1),
    ));

    GameManager.instance.EnterGrid(this, dest);

  }

  Attack() {
    var now = Date.now();
    if (now - this.lastAttackTime > this.res.attackSpeed * 1000) {
      if (this.node.getNumberOfRunningActions() == 0) {
        if (this.target != null && !this.target.unAttackable) {
          var action = cc.sequence(
            cc.rotateTo(0.05, -10),
            cc.rotateTo(0.1, 10),
            cc.rotateTo(0.05, 0),
          );
          this.node.runAction(action);
          GameManager.instance.CreateMagic(1, this.target.node.position);
          this.target.Hurt(this.res.attack);
          this.lastAttackTime = now;
        }
      }
    }

  }

  Hurt(hp: number) {

    this.currentHp -= hp;

    GameManager.instance.CreateHud(hp, this.node.position);



    if (this.currentHp <= 0) {
      this.unAttackable = true;

      // var self = this;
      // var finished = cc.callFunc(function () {
      //   GameManager.instance.RealRemoveRole(self);
      // });

      // var fadeAction = cc.sequence(cc.fadeOut(0.5), finished);

      // this.node.runAction(fadeAction);

      if (this.shaderCom) {
        this.unschedule(this.Recover);
        this.shaderCom.shader = ShaderType.Dissolve;
      }

      var self = this;
      this.scheduleOnce(function () {
        GameManager.instance.RealRemoveRole(self);
      }, 1);
    }
    else {
      if (this.shaderCom) {
        this.unschedule(this.Recover);
        this.shaderCom.shader = ShaderType.Hurt;
        this.scheduleOnce(this.Recover, 0.1);
      }
    }

  }

  Recover() {
    this.shaderCom.shader = ShaderType.Default;
  }




}
