import { SpeedType } from "./JoystickCommon";
import Data from "./Data";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    public static instance = null;

    @property(cc.Vec2)
    moveDir = cc.v2(0, 1);

    @property({ type: cc.Enum(SpeedType) })
    _speedType = SpeedType.STOP;

    @property(Number)
    _moveSpeed = 0;

    @property(cc.Integer)
    stopSpeed = 0;

    @property(cc.Integer)
    normalSpeed = 100;

    @property(cc.Integer)
    fastSpeed = 200;

    @property(cc.Animation)
    track1: cc.Animation = null;

    @property(cc.Animation)
    track2: cc.Animation = null;

    @property(cc.Node)
    bulletPrefab: cc.Node = null;

    @property(cc.Node)
    tower: cc.Node = null;

    @property(cc.Node)
    bulletStartNode: cc.Node = null;

    target: cc.Node = null;

    rotateSpeed: number = 50;

    playerHalfSize: number = 50;

    @property(cc.Node)
    gun: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Player.instance = this;
    }

    start() {

    }

    // methods
    move(dt) {
        // this.node.rotation = 90 - cc.misc.radiansToDegrees(
        //     Math.atan2(this.moveDir.y, this.moveDir.x)
        // );

        // let newPos = this.node.position.add(this.moveDir.mul(this._moveSpeed / 60));
        // this.node.setPosition(newPos);

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

        if(this.node.x < -Data.instance.mapMinX + this.playerHalfSize){
            this.node.x = -Data.instance.mapMinX + this.playerHalfSize;
        }
        else if(this.node.x > Data.instance.mapMinX - this.playerHalfSize){
            this.node.x = Data.instance.mapMinX - this.playerHalfSize;
        }

        if(this.node.y < -Data.instance.mapMinY + this.playerHalfSize){
            this.node.y = -Data.instance.mapMinY + this.playerHalfSize;
        }
        else if(this.node.y > Data.instance.mapMinY - this.playerHalfSize){
            this.node.y = Data.instance.mapMinY - this.playerHalfSize;
        }

        Game.instance.mainCamera.position = this.node.position;





    }

    update(dt) {
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
        this.move(dt);
        // console.log(this.moveDir)
        // console.log(this._moveSpeed)
        

    }

    bulletPool: cc.Node[] = [];
    gunAction: cc.Action = null;
    gunStartPos: cc.Vec2;

    public CreateBullet() {
        if(this.gunAction == null){
            this.gunStartPos = this.gun.position;
            this.gunAction = cc.sequence(cc.moveTo(0.1, this.gunStartPos.x, this.gunStartPos.y - 10), cc.moveTo(0.1, this.gunStartPos.x, this.gunStartPos.y));
        }
        this.gun.runAction(this.gunAction);

        var bullet: cc.Node = null;
        if (this.bulletPool.length > 0) {
            bullet = this.bulletPool.pop();
        }
        else {
            bullet = cc.instantiate(this.bulletPrefab);
        }

        bullet.active = true;
        bullet.setParent(Game.instance.bulletParent);
        var p = this.bulletStartNode.parent.convertToWorldSpaceAR(this.bulletStartNode.position);
        var pos = Game.instance.bulletParent.convertToNodeSpaceAR(p);
        bullet.position = pos;

        //计算出朝向
        var p1 = this.tower.parent.convertToWorldSpaceAR(this.tower.position);
        var dir = p.sub(p1);

        var angle = dir.signAngle(cc.v2(1,0));

        var degree = angle / Math.PI * 180;
        bullet.rotation = degree;

    }

}
