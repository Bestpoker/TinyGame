import { SpeedType } from "./JoystickEnum";
import Data from "./Data";
import Game from "./Game";
import Bullet from "./Bullet";
import Entity from "./Entity";
import GameItem from "./GameItem";

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
export default class Tank extends Entity {

    @property(cc.Vec2)
    moveDir = cc.v2(0, 1);

    towerDic = cc.v2(0, 0);

    @property({ type: cc.Enum(SpeedType) })
    _speedType = SpeedType.STOP;

    @property(Number)
    _moveSpeed = 0;

    @property(cc.Integer)
    stopSpeed = 0;

    @property(cc.Integer)
    normalSpeed = 200;

    @property(cc.Integer)
    fastSpeed = 200;

    @property(cc.Animation)
    track1: cc.Animation = null;

    @property(cc.Animation)
    track2: cc.Animation = null;

    @property(cc.Node)
    tower: cc.Node = null;

    @property(cc.Node)
    bulletStartNode: cc.Node = null;

    target: Entity = null;

    rotateSpeed: number = 50;

    towerRotateSpeed: number = 100;

    playerHalfSize: number = 50;

    @property(cc.Node)
    gun: cc.Node = null;

    gunAction: cc.Action = null;
    gunStartPos: cc.Vec2;

    @property(Number)
    teamID: number = 0;

    @property(Number)
    roleID: number = 0;

    isAI = false;

    bulletAttackRange = 500;

    bulletMoveSpeed = 1000;

    bulletAttackHp = 2;

    attackSpeed = 1;

    attackLife = 0;

    moveRotateDir = false;

    moveRotateCD = 0;

    // LIFE-CYCLE CALLBACKS:

    Init() {
        super.Init();
        this._speedType = SpeedType.STOP;
        this._moveSpeed = 0;
        this.track1.stop();
        this.track2.stop();
        this.tower.angle = 0;
        this.gun.position = this.gunStartPos;
        this.target = null;
        this.teamID = 0;
        this.roleID = 0;
        this.isAI = false;
        this.attackLife = 0;
        this.moveRotateDir = false;
        this.moveRotateCD = 0;
    }

    onLoad() {
        this.gunStartPos = this.gun.position;
        this.gunAction = cc.sequence(cc.moveTo(0.1, this.gunStartPos.x, this.gunStartPos.y - 10), cc.moveTo(0.1, this.gunStartPos.x, this.gunStartPos.y));
    }

    start() {

    }

    update(dt) {

        if (this.isDead) {
            return;
        }

        // this.AimTarget(dt);

        this.move(dt);

        this.RotateTower(dt);

        // this.attack(dt);

        this.DoAIWork(dt);

        // console.log(this.moveDir)
        // console.log(this._moveSpeed)


    }

    attack(dt) {
        this.attackLife += dt;
        if (this.attackLife >= this.attackSpeed) {
            this.attackLife = this.attackLife - this.attackSpeed;
            this.CreateBullet();
        }
    }



    // methods
    move(dt) {
        // this.node.rotation = 90 - cc.misc.radiansToDegrees(
        //     Math.atan2(this.moveDir.y, this.moveDir.x)
        // );

        // let newPos = this.node.position.add(this.moveDir.mul(this._moveSpeed / 60));
        // this.node.setPosition(newPos);

        switch (this._speedType) {
            case SpeedType.STOP:
                this._moveSpeed = this.stopSpeed;
                if (this.track1.getAnimationState(this.track1.defaultClip.name).isPlaying) {
                    this.track1.stop();
                }
                if (this.track2.getAnimationState(this.track2.defaultClip.name).isPlaying) {
                    this.track2.stop();
                }
                break;
            case SpeedType.NORMAL:
                this._moveSpeed = this.normalSpeed;
                if (!this.track1.getAnimationState(this.track1.defaultClip.name).isPlaying) {
                    this.track1.play();
                }
                if (!this.track2.getAnimationState(this.track2.defaultClip.name).isPlaying) {
                    this.track2.play();
                }
                break;
            case SpeedType.FAST:
                this._moveSpeed = this.fastSpeed;
                if (!this.track1.getAnimationState(this.track1.defaultClip.name).isPlaying) {
                    this.track1.play();
                }
                if (!this.track2.getAnimationState(this.track2.defaultClip.name).isPlaying) {
                    this.track2.play();
                }
                break;
            default:
                break;
        }

        if (this._moveSpeed <= 0) {
            return;
        }

        var targetNum = cc.misc.radiansToDegrees(Math.atan2(this.moveDir.y, this.moveDir.x));

        if (targetNum < 0) {
            targetNum += 360;
        }

        var rotateSpeedTemp = this.rotateSpeed * dt;

        if (this.node.angle < targetNum) {
            if (targetNum - this.node.angle > 180) {
                this.node.angle -= rotateSpeedTemp;
                if (this.node.angle < 0) {
                    this.node.angle += 360;
                }
            }
            else {
                this.node.angle += rotateSpeedTemp;
                if (this.node.angle > 360) {
                    this.node.angle -= 360;
                }
            }
        }
        else if (this.node.angle > targetNum) {
            if (this.node.angle - targetNum < 180) {
                this.node.angle -= rotateSpeedTemp;
                if (this.node.angle < 0) {
                    this.node.angle += 360;
                }
            }
            else {
                this.node.angle += rotateSpeedTemp;
                if (this.node.angle > 360) {
                    this.node.angle -= 360;
                }
            }
        }

        if (Math.abs(targetNum - this.node.angle) < rotateSpeedTemp) {
            this.node.angle = targetNum;
        }


        //由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
        var angle = this.node.angle / 180 * Math.PI;
        //合成基于 X正方向的方向向量
        var dir = cc.v2(Math.cos(angle), Math.sin(angle));
        //单位化向量
        dir.normalizeSelf();

        //根据方向向量移动位置
        this.node.x += dt * dir.x * this._moveSpeed;
        this.node.y += dt * dir.y * this._moveSpeed;

        var left = -Data.instance.mapMinX + this.playerHalfSize;
        var right = Data.instance.mapMinX - this.playerHalfSize;
        var up = Data.instance.mapMinY - this.playerHalfSize;
        var down = -Data.instance.mapMinY + this.playerHalfSize;

        if (this.node.x < left) {
            this.node.x = left;
            this.SetMoveRotateDir();
        }
        else if (this.node.x > right) {
            this.node.x = right;
            this.SetMoveRotateDir();
        }

        if (this.node.y < down) {
            this.node.y = down;
            this.SetMoveRotateDir();
        }
        else if (this.node.y > up) {
            this.node.y = up;
            this.SetMoveRotateDir();
        }


    }

    SetMoveRotateDir() {
        if (this.moveRotateCD > 5) {
            this.moveRotateDir = !this.moveRotateDir;
            this.moveRotateCD = 0;
        }

    }


    DoAIWork(dt) {
        if (this.isAI) {
            this.moveRotateCD += dt;
            this.FindTarget();
            this.AimTarget(dt);
            this.AutoFindRoad();
        }
    }




    public CreateBullet() {

        if (this.isDead) {
            return;
        }

        this.gun.runAction(this.gunAction);

        var bullet = Game.instance.CreateBullet();
        bullet.roleID = this.roleID;
        bullet.teamID = this.teamID;
        bullet.SetInfo(this.bulletAttackRange, this.bulletMoveSpeed, this.bulletAttackHp);

        var p = this.bulletStartNode.parent.convertToWorldSpaceAR(this.bulletStartNode.position);
        var pos = Game.instance.bulletParent.convertToNodeSpaceAR(p);
        bullet.node.position = pos;

        //计算出朝向
        var p1 = this.tower.parent.convertToWorldSpaceAR(this.tower.position);
        var dir = p.sub(p1);

        if (dir.x != 0 || dir.y != 0) {
            var angle = dir.signAngle(cc.v2(1, 0));

            var degree = angle / Math.PI * 180;
            bullet.node.angle = -degree;
        }



    }

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        // console.log('on collision enter');

        var otherTank = other.getComponent(Tank);
        if (otherTank != null) {
            otherTank.BeAttacked(this.currentHp);
            return;
        }

        var otherGameItem = other.getComponent(GameItem);
        if (otherGameItem != null) {
            otherGameItem.BeAttacked(this.currentHp);
            return;
        }
    }

    FindTarget() {
        var target = null;
        if (this.target == null) {
            target = Game.instance.SearchEnemyWithNearest(this);
        }
        else {
            var tempDis = this.node.position.sub(this.target.node.position).mag();
            if (tempDis > this.bulletAttackRange * 0.7) {
                target = Game.instance.SearchEnemyWithNearest(this);
            }
        }

        if (target != null) {
            this.SetTarget(target);
        }
    }

    AutoFindRoad() {
        if (this.target != null && !this.target.isDead) {

            //计算出朝向

            var temp = this.target.node.position.sub(this.node.position);
            var dir = temp.normalize();
            var dis = temp.mag();
            if (dis > this.bulletAttackRange) {
                this.moveDir = dir;
            }
            else if (dis < this.bulletAttackRange * 0.5) {
                this.moveDir = cc.v2(-dir.x, -dir.y);
            }
            else {
                if (this.moveRotateDir) {
                    this.moveDir = cc.v2(dir.y, -dir.x);
                }
                else {
                    this.moveDir = cc.v2(-dir.y, dir.x);
                }

            }
            this._speedType = SpeedType.FAST;

        }
    }

    SetTarget(target: Tank) {
        this.target = target;
    }

    AimTarget(dt) {
        var targetNum = 0;
        if (this.target != null && !this.target.isDead) {
            var p = this.target.node.parent.convertToWorldSpaceAR(this.target.node.position);
            var pos = this.tower.parent.convertToNodeSpaceAR(p);

            //计算出朝向
            var dir = pos.sub(this.tower.position);

            if (dir.x != 0 || dir.y != 0) {
                var angle = dir.signAngle(cc.v2(1, 0));
                var degree = angle / Math.PI * 180;
                targetNum = -degree;
            }


        }

        if (targetNum < 0) {
            targetNum += 360;
        }

        var rotateSpeedTemp = this.towerRotateSpeed * dt;

        if (this.tower.angle < targetNum) {
            if (targetNum - this.tower.angle > 180) {
                this.tower.angle -= rotateSpeedTemp;
                if (this.tower.angle < 0) {
                    this.tower.angle += 360;
                }
            }
            else {
                this.tower.angle += rotateSpeedTemp;
                if (this.tower.angle > 360) {
                    this.tower.angle -= 360;
                }
            }
        }
        else if (this.tower.angle > targetNum) {
            if (this.tower.angle - targetNum < 180) {
                this.tower.angle -= rotateSpeedTemp;
                if (this.tower.angle < 0) {
                    this.tower.angle += 360;
                }
            }
            else {
                this.tower.angle += rotateSpeedTemp;
                if (this.tower.angle > 360) {
                    this.tower.angle -= 360;
                }
            }
        }

        if (Math.abs(targetNum - this.tower.angle) < rotateSpeedTemp) {
            this.tower.angle = targetNum;
        }


    }

    RotateTower(dt) {

        if (this.towerDic.x == 0 && this.towerDic.y == 0) {
            return;
        }

        var targetNum = 0;

        var angle = this.towerDic.signAngle(cc.v2(1, 0));

        var degree = angle / Math.PI * 180;
        targetNum = -degree;

        if (targetNum < 0) {
            targetNum += 360;
        }

        targetNum = targetNum - this.node.angle;

        if (targetNum < 0) {
            targetNum += 360;
        }

        // this.tower.angle = targetNum;

        // return;

        var rotateSpeedTemp = this.towerRotateSpeed * dt;

        if (this.tower.angle < targetNum) {
            if (targetNum - this.tower.angle > 180) {
                this.tower.angle -= rotateSpeedTemp;
                if (this.tower.angle < 0) {
                    this.tower.angle += 360;
                }
            }
            else {
                this.tower.angle += rotateSpeedTemp;
                if (this.tower.angle > 360) {
                    this.tower.angle -= 360;
                }
            }
        }
        else if (this.tower.angle > targetNum) {
            if (this.tower.angle - targetNum < 180) {
                this.tower.angle -= rotateSpeedTemp;
                if (this.tower.angle < 0) {
                    this.tower.angle += 360;
                }
            }
            else {
                this.tower.angle += rotateSpeedTemp;
                if (this.tower.angle > 360) {
                    this.tower.angle -= 360;
                }
            }
        }

        if (Math.abs(targetNum - this.tower.angle) < rotateSpeedTemp) {
            this.tower.angle = targetNum;
        }


    }

    BeAttacked(value: number){
        this.currentHp -= value;
        if(this.currentHp <= 0){
            Game.instance.DestroyTank(this);
        }
    }

}
